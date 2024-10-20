import type { Type } from "./Type";

/**
 * A composition of other types, such as sh:and or sh:or.
 */
export interface ComposedType {
  readonly types: readonly Type[];
}
