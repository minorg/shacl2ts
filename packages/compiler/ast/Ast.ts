import type { IntersectionType } from "./IntersectionType.js";
import type { ObjectType } from "./ObjectType.js";
import type { UnionType } from "./UnionType.js";

export interface Ast {
  readonly objectIntersectionTypes: readonly IntersectionType<ObjectType>[];
  readonly objectTypes: readonly ObjectType[];
  readonly objectUnionTypes: readonly UnionType<ObjectType>[];
}
