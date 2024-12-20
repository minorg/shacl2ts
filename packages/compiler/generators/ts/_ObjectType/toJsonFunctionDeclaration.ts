import { Maybe } from "purify-ts";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { toJsonFunctionOrMethodDeclaration } from "./toJsonFunctionOrMethodDeclaration.js";

export function toJsonFunctionDeclaration(
  this: ObjectType,
): Maybe<FunctionDeclarationStructure> {
  if (this.declarationType !== "interface") {
    return Maybe.empty();
  }

  if (this.extern) {
    return Maybe.empty();
  }

  return toJsonFunctionOrMethodDeclaration
    .bind(this)()
    .map((toJsonFunctionOrMethodDeclaration) => ({
      ...toJsonFunctionOrMethodDeclaration,
      isExported: true,
      kind: StructureKind.Function,
    }));
}
