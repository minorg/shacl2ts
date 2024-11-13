import type { Type } from "./Type.js";

/**
 * A type with zero or one values of an item type.
 *
 * This is a property with sh:minCount 0 and sh:maxCount 1.
 */
export interface OptionType {
  readonly itemType: Type;
  readonly kind: "OptionType";
}
