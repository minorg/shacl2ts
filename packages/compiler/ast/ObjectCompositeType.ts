import type { CompositeType } from "./CompositeType.js";
import type { Name } from "./Name.js";
import type { ObjectType } from "./ObjectType.js";

/**
 * A composite of object types, such as an intersection or union.
 */
export interface ObjectCompositeType extends CompositeType<ObjectType> {
  /**
   * Name of this type, usually derived from sh:name or shaclmate:name.
   */
  readonly name: Name;
}
