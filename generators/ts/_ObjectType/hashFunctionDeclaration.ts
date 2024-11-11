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
      omitPropertyNamesSet.add(property.name);
      continue;
    }

    if (property.name === this.configuration.objectTypeIdentifierPropertyName) {
      if (this.parentObjectTypes.length === 0) {
        statements.push(
          `if (typeof ${propertyValueVariable} !== "undefined") { ${propertyHashStatements.join("\n")} }`,
        );
      }
      continue;
    }

    statements.push(...propertyHashStatements);
  }

  const omitPropertyNames = [...omitPropertyNamesSet];
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
