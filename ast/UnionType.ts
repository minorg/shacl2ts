import type { Type } from "./Type.js";

/**
 * A disjunction/union of types, corresponding to an sh:or.
 */
export interface UnionType {
  readonly kind: "UnionType";
  readonly types: readonly Type[];
}
