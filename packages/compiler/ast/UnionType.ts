import type { Type } from "./Type.js";

/**
 * A disjunction/union of types, corresponding to an sh:or.
 */
export interface UnionType<MemberTypeT extends Type = Type> {
  readonly kind: "UnionType";
  readonly memberTypes: readonly MemberTypeT[];
}
