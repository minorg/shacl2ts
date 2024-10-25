import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

export function equalsFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  let expression = `purifyHelpers.Equatable.objectEquals(left, right, { ${this.properties
    .map((property) => `${property.name}: ${property.equalsFunction}`)
    .join()} })`;
  for (const superObjectType of this.superObjectTypes) {
    expression = `${superObjectType.name("module")}.equals(left, right).chain(() => ${expression})`;
  }

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "equals",
    parameters: [
      {
        name: "left",
        type: this.name("interface"),
      },
      {
        name: "right",
        type: this.name("interface"),
      },
    ],
    statements: [`return ${expression};`],
    returnType: "purifyHelpers.Equatable.EqualsResult",
  };
}
