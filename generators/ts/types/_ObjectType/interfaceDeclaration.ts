import type { InterfaceDeclarationStructure, OptionalKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

export function interfaceDeclaration(
  this: ObjectType,
): OptionalKind<InterfaceDeclarationStructure> {
  return {
    extends: this.superObjectTypes.map((superObjectType) =>
      superObjectType.name("inline"),
    ),
    isExported: true,
    name: this.name("inline"),
    properties: this.properties.map(
      (property) => property.interfacePropertySignature,
    ),
  };
}
