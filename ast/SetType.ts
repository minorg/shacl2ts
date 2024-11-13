import type { Type } from "./Type.js";

/**
 * A set of items of a specific type.
 *
 * This is typically a property with sh:maxCount != 1.
 */
export interface SetType {
  readonly itemType: Type;
  readonly kind: "SetType";
}
