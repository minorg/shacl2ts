import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";
import { toRdfFunctionOrMethodDeclaration } from "./toRdfFunctionOrMethodDeclaration";

export function toRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  return {
    ...toRdfFunctionOrMethodDeclaration.bind(this)(),
    isExported: true,
    kind: StructureKind.Function,
  };
}
