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
        type: [
          ...new Set(
            [this.name].concat(
              this.descendantObjectTypes.map((objectType) => objectType.name),
            ),
          ),
        ]
          .sort()
          .map((name) => `"${name}"`)
          .join("|"),
      });
    },
  );

  return {
    extends: this.parentObjectTypes.map(
      (parentObjectType) => parentObjectType.interfaceQualifiedName,
    ),
    isExported: true,
    kind: StructureKind.Interface,
    name: this.interfaceUnqualifiedName,
    properties,
  };
}
