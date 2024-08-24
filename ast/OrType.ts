import type { Type } from ".";

/**
 * A disjunction ("or") of types, corresponding to an sh:or.
 */
export interface OrType {
  readonly kind: "Or";
  readonly types: readonly Type[];
}
