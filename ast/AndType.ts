import type { ComposedType } from ".";

/**
 * A conjunction ("and") of types, corresponding to an sh:and.
 */
export interface AndType extends ComposedType {
  readonly kind: "And";
}
