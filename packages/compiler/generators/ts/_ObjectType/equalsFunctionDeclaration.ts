import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

export function equalsFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  let expression = `purifyHelpers.Equatable.objectEquals(left, right, { ${this.properties
    .map((property) => `${property.name}: ${property.equalsFunction}`)
    .join()} })`;
  for (const parentObjectType of this.parentObjectTypes) {
    expression = `${parentObjectType.name}.equals(left, right).chain(() => ${expression})`;
  }

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "equals",
    parameters: [
      {
        name: "left",
        type: this.name,
      },
      {
        name: "right",
        type: this.name,
      },
    ],
    returnType: "purifyHelpers.Equatable.EqualsResult",
    statements: [`return ${expression};`],
  };
}
