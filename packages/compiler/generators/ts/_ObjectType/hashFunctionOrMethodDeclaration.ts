import { camelCase } from "change-case";
import type {
  OptionalKind,
  ParameterDeclarationStructure,
  TypeParameterDeclarationStructure,
} from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

const hasherVariable = "_hasher";

export const hasherTypeConstraint =
  "{ update: (message: string | number[] | ArrayBuffer | Uint8Array) => void; }";

export function hashFunctionOrMethodDeclaration(this: ObjectType): {
  parameters: OptionalKind<ParameterDeclarationStructure>[];
  returnType: string;
  statements: string[];
  typeParameters: OptionalKind<TypeParameterDeclarationStructure>[];
} {
  let thisVariable: string;
  switch (this.configuration.objectTypeDeclarationType) {
    case "class":
      thisVariable = "this";
      break;
    case "interface":
      thisVariable = `_${camelCase(this.name)}`;
      break;
  }

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
  if (this.configuration.objectTypeDeclarationType === "interface") {
    parameters.push({
      name: thisVariable,
      type: this.name,
    });
  }
  parameters.push({
    name: hasherVariable,
    type: "HasherT",
  });

  const omitPropertyNamesSet = new Set<string>();
  omitPropertyNamesSet.add(this.configuration.objectTypeIdentifierPropertyName);
  omitPropertyNamesSet.add(
    this.configuration.objectTypeDiscriminatorPropertyName,
  );
  if (this.configuration.objectTypeDeclarationType === "class") {
    omitPropertyNamesSet.add("equals");
    omitPropertyNamesSet.add("hash");
    omitPropertyNamesSet.add("toRdf");
  }

  const statements: string[] = [];

  switch (this.configuration.objectTypeDeclarationType) {
    case "class": {
      if (this.parentObjectTypes.length > 0) {
        statements.push(`super.hash(${hasherVariable});`);
      }
      break;
    }
    case "interface": {
      for (const parentObjectType of this.parentObjectTypes) {
        statements.push(
          `${parentObjectType.name}.${parentObjectType.hashFunctionName}(${thisVariable}, ${hasherVariable});`,
        );
      }
      break;
    }
  }

  for (const property of this.properties) {
    const propertyValueVariable = `${thisVariable}.${property.name}`;
    const propertyHashStatements = property.hashStatements({
      variables: {
        hasher: hasherVariable,
        value: propertyValueVariable,
      },
    });

    if (propertyHashStatements.length === 0) {
      omitPropertyNamesSet.add(property.name);
      continue;
    }

    if (property.name === this.configuration.objectTypeIdentifierPropertyName) {
      // Don't hash the identifier since we may be using hash to calculate the identifier, leading to infinite recursion
      continue;
    }

    statements.push(...propertyHashStatements);
  }

  const omitPropertyNames = [...omitPropertyNamesSet];
  omitPropertyNames.sort();

  statements.push(`return ${hasherVariable};`);

  return {
    parameters,
    returnType: "HasherT",
    statements,
    typeParameters: [
      {
        name: "HasherT",
        constraint: hasherTypeConstraint,
      },
    ],
  };
}
