import type { ComposedType } from ".";

/**
 * A disjunction ("or") of types, corresponding to an sh:or.
 */
export interface OrType extends ComposedType {
  readonly kind: "Or";
}
