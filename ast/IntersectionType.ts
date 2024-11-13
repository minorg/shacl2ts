import type { Type } from "./Type.js";

/**
 * A conjunction ("and") of types, corresponding to an sh:and.
 */
export interface IntersectionType {
  readonly kind: "IntersectionType";
  readonly types: readonly Type[];
}
