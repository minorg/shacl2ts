import { type InterfaceDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

export function interfaceDeclaration(
  this: ObjectType,
): InterfaceDeclarationStructure {
  return {
    extends: this.superObjectTypes.map(
      (superObjectType) => superObjectType.interfaceQualifiedName,
    ),
    isExported: true,
    kind: StructureKind.Interface,
    name: this.interfaceUnqualifiedName,
    properties: this.properties.map(
      (property) => property.interfacePropertySignature,
    ),
  };
}
