import type { CompositeType } from "./CompositeType.js";
import type { Type } from "./Type.js";

/**
 * A disjunction/union of types, corresponding to an sh:or.
 */
export interface UnionType extends CompositeType<Type> {
  readonly kind: "UnionType";
}
