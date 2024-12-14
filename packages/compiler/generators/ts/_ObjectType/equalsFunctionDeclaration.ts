import { Maybe } from "purify-ts";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { equalsFunctionOrMethodDeclaration } from "./equalsFunctionOrMethodDeclaration.js";

export function equalsFunctionDeclaration(
  this: ObjectType,
): Maybe<FunctionDeclarationStructure> {
  if (this.configuration.objectTypeDeclarationType !== "interface") {
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
