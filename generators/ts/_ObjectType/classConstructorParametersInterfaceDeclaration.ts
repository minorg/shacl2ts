import { type InterfaceDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

export function classConstructorParametersInterfaceDeclaration(
  this: ObjectType,
): InterfaceDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();
  return {
    extends:
      this.parentObjectTypes.length > 0
        ? [
            `${this.parentObjectTypes[0].classQualifiedName}.ConstructorParameters`,
          ]
        : undefined,
    isExported: true,
    kind: StructureKind.Interface,
    properties: this.properties.flatMap((property) =>
      property.classConstructorParametersPropertySignature.toList(),
    ),
    name: "ConstructorParameters",
  };
}
