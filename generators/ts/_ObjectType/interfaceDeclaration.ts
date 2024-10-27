import {
  type InterfaceDeclarationStructure,
  type OptionalKind,
  type PropertySignatureStructure,
  StructureKind,
} from "ts-morph";
import type { ObjectType } from "../ObjectType";

export function interfaceDeclaration(
  this: ObjectType,
): InterfaceDeclarationStructure {
  const properties: OptionalKind<PropertySignatureStructure>[] =
    this.properties.map((property) => property.interfacePropertySignature);
  this.configuration.objectTypeDiscriminatorPropertyName.ifJust(
    (typeDiscriminatorPropertyName) => {
      properties.push({
        isReadonly: true,
        name: typeDiscriminatorPropertyName,
        type: `"${this.name}"`,
      });
    },
  );

  return {
    extends: this.superObjectTypes.map(
      (superObjectType) => superObjectType.interfaceQualifiedName,
    ),
    isExported: true,
    kind: StructureKind.Interface,
    name: this.interfaceUnqualifiedName,
    properties,
  };
}
