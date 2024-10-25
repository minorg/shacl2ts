import { type InterfaceDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

export function classConstructorParametersInterfaceDeclaration(
  this: ObjectType,
): InterfaceDeclarationStructure {
  return {
    extends:
      this.superObjectTypes.length > 0
        ? [`${this.superObjectTypes[0].name("class")}.Parameters`]
        : undefined,
    isExported: true,
    kind: StructureKind.Interface,
    properties: this.properties.map(
      (property) => property.classConstructorParametersPropertySignature,
    ),
    name: "Parameters",
  };
}
