import { Maybe } from "purify-ts";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import { TsObjectDeclarationType } from "../../../enums/index.js";
import type { ObjectType } from "../ObjectType.js";
import { equalsFunctionOrMethodDeclaration } from "./equalsFunctionOrMethodDeclaration.js";

export function equalsFunctionDeclaration(
  this: ObjectType,
): Maybe<FunctionDeclarationStructure> {
  if (this.declarationType !== TsObjectDeclarationType.INTERFACE) {
    return Maybe.empty();
  }

  if (this.extern) {
    return Maybe.empty();
  }

  return equalsFunctionOrMethodDeclaration
    .bind(this)()
    .map((equalsFunctionOrMethodDeclaration) => ({
      ...equalsFunctionOrMethodDeclaration,
      isExported: true,
      kind: StructureKind.Function,
    }));
}
