import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { toRdfFunctionOrMethodDeclaration } from "./toRdfFunctionOrMethodDeclaration.js";

export function toRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  return {
    ...toRdfFunctionOrMethodDeclaration.bind(this)(),
    isExported: true,
    kind: StructureKind.Function,
  };
}
