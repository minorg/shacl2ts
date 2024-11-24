import type { Type } from "./Type.js";

/**
 * A conjunction ("and") of types, corresponding to an sh:and.
 */
export interface IntersectionType {
  readonly kind: "IntersectionType";

  /**
   * Member types of the intersection.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly memberTypes: Type[];
}
