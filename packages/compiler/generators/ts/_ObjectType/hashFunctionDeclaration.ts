import { Maybe } from "purify-ts";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { hashFunctionOrMethodDeclaration } from "./hashFunctionOrMethodDeclaration.js";

export function hashFunctionDeclaration(
  this: ObjectType,
): Maybe<FunctionDeclarationStructure> {
  if (this.declarationType !== "interface") {
    return Maybe.empty();
  }

  if (this.extern) {
    return Maybe.empty();
  }

  return hashFunctionOrMethodDeclaration
    .bind(this)()
    .map((hashFunctionOrMethodDeclaration) => ({
      ...hashFunctionOrMethodDeclaration,
      isExported: true,
      kind: StructureKind.Function,
      name: this.hashFunctionName,
    }));
}
