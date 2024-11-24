import type { Type } from "./Type.js";

/**
 * A disjunction/union of types, corresponding to an sh:or.
 */
export interface UnionType {
  readonly kind: "UnionType";

  /**
   * Member types of the union.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly memberTypes: Type[];
}
