import { camelCase } from "change-case";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

const hasherVariable = "hasher";

export const hasherTypeConstraint =
  "{ update: (message: string | number[] | ArrayBuffer | Uint8Array) => void; }";

export function hashFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  const thisVariable = camelCase(this.name);

  const omitPropertyNames: string[] = [];
  const statements: string[] = [];

  for (const parentObjectType of this.parentObjectTypes) {
    statements.push(
      `${parentObjectType.name}.${parentObjectType.hashFunctionName}(${thisVariable}, ${hasherVariable})`,
    );
  }

  for (const property of this.properties) {
    const propertyValueVariable = `${thisVariable}.${property.name}`;
    const propertyHashStatements = property.hashStatements({
      hasherVariable,
      valueVariable: propertyValueVariable,
    });
    if (propertyHashStatements.length === 0) {
      omitPropertyNames.push(property.name);
      continue;
    }

    if (
      property.name === this.configuration.objectTypeIdentifierPropertyName &&
      this.parentObjectTypes.length === 0
    ) {
      statements.push(
        `if (typeof ${propertyValueVariable} !== "undefined") { ${propertyHashStatements.join("\n")} }`,
      );
      omitPropertyNames.push(property.name);
    } else {
      statements.push(...propertyHashStatements);
    }
  }

  if (this.configuration.objectTypeDeclarationType === "class") {
    omitPropertyNames.push("equals", "hash", "toRdf");
  }

  omitPropertyNames.sort();

  statements.push(`return ${hasherVariable};`);

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: this.hashFunctionName,
    parameters: [
      {
        name: thisVariable,
        type: `Omit<${this.name}, ${omitPropertyNames.map((propertyName) => `"${propertyName}"`).join(" | ")}> & { ${this.configuration.objectTypeIdentifierPropertyName}?: ${this.identifierType.name} }`,
      },
      {
        name: hasherVariable,
        type: "HasherT",
      },
    ],
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
