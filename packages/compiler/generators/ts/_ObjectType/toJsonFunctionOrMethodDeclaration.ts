import { camelCase } from "change-case";
import { Maybe } from "purify-ts";
import type { OptionalKind, ParameterDeclarationStructure } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

export function toJsonFunctionOrMethodDeclaration(this: ObjectType): Maybe<{
  name: string;
  parameters: OptionalKind<ParameterDeclarationStructure>[];
  returnType: string;
  statements: string[];
}> {
  if (!this.features.has("toJson")) {
    return Maybe.empty();
  }

  if (
    this.declarationType === "class" &&
    this.properties.length === 0 &&
    this.parentObjectTypes.length > 0
  ) {
    return Maybe.empty();
  }

  let thisVariable: string;
  switch (this.declarationType) {
    case "class":
      thisVariable = "this";
      break;
    case "interface":
      thisVariable = camelCase(this.name);
      break;
  }

  const jsonObjectMembers: string[] = [];
  const returnType: string[] = [];

  if (this.properties.length > 0) {
    returnType.push(
      `{ ${this.properties.map((property) => property.jsonDeclaration)} }`,
    );
  }

  if (this.parentObjectTypes.length > 0) {
    switch (this.declarationType) {
      case "class":
        jsonObjectMembers.push("...super.toJson()");
        break;
      case "interface":
        for (const parentObjectType of this.parentObjectTypes) {
          jsonObjectMembers.push(
            `...${parentObjectType.name}.toJson(${thisVariable});`,
          );
        }
        break;
    }

    for (const parentObjectType of this.parentObjectTypes) {
      returnType.push(parentObjectType.jsonDeclaration);
    }
  }

  switch (this.toRdfTypes.length) {
    case 0:
      break;
    case 1:
      jsonObjectMembers.push(`"@type": "${this.toRdfTypes[0].value}"`);
      break;
    default:
      jsonObjectMembers.push(
        `"@type": ${JSON.stringify(this.toRdfTypes.map((rdfType) => rdfType.value))}`,
      );
      break;
  }

  for (const property of this.properties) {
    jsonObjectMembers.push(
      `${property.name}: ${property.toJsonExpression({ variables: { value: `${thisVariable}.${property.name}` } })}`,
    );
  }

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
  if (this.declarationType === "interface") {
    parameters.push({
      name: thisVariable,
      type: this.name,
    });
  }

  return Maybe.of({
    name: "toJson",
    parameters,
    returnType: returnType.length > 0 ? returnType.join(" & ") : "object",
    statements: [
      `return JSON.parse(JSON.stringify({ ${jsonObjectMembers.join(",")} }));`,
    ],
  });
}
