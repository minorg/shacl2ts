import type * as ast from "../ast/index.js";

export type NodeShapeAstType =
  | ast.ObjectIntersectionType
  | ast.ObjectType
  | ast.ObjectUnionType;
