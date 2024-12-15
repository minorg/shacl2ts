import { Maybe } from "purify-ts";
import {
  type InterfaceDeclarationStructure,
  type OptionalKind,
  type PropertySignatureStructure,
  StructureKind,
} from "ts-morph";
import { TsObjectDeclarationType } from "../../../enums/TsObjectDeclarationType.js";
import type { ObjectType } from "../ObjectType.js";

export function interfaceDeclaration(
  this: ObjectType,
): Maybe<InterfaceDeclarationStructure> {
  if (this.declarationType !== TsObjectDeclarationType.INTERFACE) {
    return Maybe.empty();
  }

  if (this.extern) {
    return Maybe.empty();
  }

  const properties: OptionalKind<PropertySignatureStructure>[] =
    this.properties.map((property) => property.interfacePropertySignature);

  return Maybe.of({
    extends: this.parentObjectTypes.map(
      (parentObjectType) => parentObjectType.name,
    ),
    isExported: true,
    kind: StructureKind.Interface,
    name: this.name,
    properties,
  });
}
