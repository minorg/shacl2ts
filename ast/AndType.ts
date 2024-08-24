import type { Type } from ".";

/**
 * A conjunction ("and") of types, corresponding to an sh:and.
 */
export interface AndType {
  readonly kind: "And";
  readonly types: readonly Type[];
}
