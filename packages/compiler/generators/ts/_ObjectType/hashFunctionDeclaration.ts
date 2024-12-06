import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { hashFunctionOrMethodDeclaration } from "./hashFunctionOrMethodDeclaration.js";

export function hashFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  return {
    ...hashFunctionOrMethodDeclaration.bind(this)(),
    isExported: true,
    kind: StructureKind.Function,
    name: this.hashFunctionName,
  };
}
