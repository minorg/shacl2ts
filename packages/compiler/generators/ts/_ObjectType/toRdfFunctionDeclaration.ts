import { Maybe } from "purify-ts";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import { TsObjectDeclarationType } from "../../../enums/index.js";
import type { ObjectType } from "../ObjectType.js";
import { toRdfFunctionOrMethodDeclaration } from "./toRdfFunctionOrMethodDeclaration.js";

export function toRdfFunctionDeclaration(
  this: ObjectType,
): Maybe<FunctionDeclarationStructure> {
  if (this.declarationType !== TsObjectDeclarationType.INTERFACE) {
    return Maybe.empty();
  }

  if (this.extern) {
    return Maybe.empty();
  }

  return toRdfFunctionOrMethodDeclaration
    .bind(this)()
    .map((toRdfFunctionOrMethodDeclaration) => ({
      ...toRdfFunctionOrMethodDeclaration,
      isExported: true,
      kind: StructureKind.Function,
    }));
}
