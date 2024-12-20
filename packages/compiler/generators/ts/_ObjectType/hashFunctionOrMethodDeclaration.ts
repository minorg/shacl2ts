import { Maybe } from "purify-ts";
import type {
  OptionalKind,
  ParameterDeclarationStructure,
  TypeParameterDeclarationStructure,
} from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

const hasherVariable = "_hasher";

export const hasherTypeConstraint =
  "{ update: (message: string | number[] | ArrayBuffer | Uint8Array) => void; }";

export function hashFunctionOrMethodDeclaration(this: ObjectType): Maybe<{
  parameters: OptionalKind<ParameterDeclarationStructure>[];
  returnType: string;
  statements: string[];
  typeParameters: OptionalKind<TypeParameterDeclarationStructure>[];
}> {
  if (!this.features.has("hash")) {
    return Maybe.empty();
  }

  const propertyHashStatements = this.properties.flatMap((property) =>
    property.hashStatements({
      depth: 0,
      variables: {
        hasher: hasherVariable,
        value: `${this.thisVariable}.${property.name}`,
      },
    }),
  );
  if (
    this.declarationType === "class" &&
    this.parentObjectTypes.length > 0 &&
    propertyHashStatements.length === 0
  ) {
    // If there's a parent class and no hash statements in this class, can skip overriding hash
    return Maybe.empty();
  }

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
  if (this.declarationType === "interface") {
    parameters.push({
      name: this.thisVariable,
      type: this.name,
    });
  }
  parameters.push({
    name: hasherVariable,
    type: "HasherT",
  });

  const statements: string[] = [];

  let hasOverrideKeyword = false;
  if (this.parentObjectTypes.length > 0) {
    switch (this.declarationType) {
      case "class": {
        statements.push(`super.hash(${hasherVariable});`);
        hasOverrideKeyword = true;
        break;
      }
      case "interface": {
        for (const parentObjectType of this.parentObjectTypes) {
          statements.push(
            `${parentObjectType.name}.${parentObjectType.hashFunctionName}(${this.thisVariable}, ${hasherVariable});`,
          );
        }
        break;
      }
    }
  }

  statements.push(...propertyHashStatements);

  statements.push(`return ${hasherVariable};`);

  return Maybe.of({
    hasOverrideKeyword,
    parameters,
    returnType: "HasherT",
    statements,
    typeParameters: [
      {
        name: "HasherT",
        constraint: hasherTypeConstraint,
      },
    ],
  });
}
