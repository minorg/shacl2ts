import type { CompositeType } from "./CompositeType.js";
import type { Type } from "./Type.js";

/**
 * A conjunction ("and") of types, corresponding to an sh:and.
 */
export interface IntersectionType extends CompositeType<Type> {
  readonly kind: "IntersectionType";
}
