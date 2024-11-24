import type { Name } from "./Name.js";
import type { ObjectType } from "./ObjectType.js";

/**
 * A conjunction/intersection of object types, corresponding to an sh:and on a node shape.
 */
export interface ObjectIntersectionType {
  readonly kind: "ObjectIntersectionType";

  /**
   * Member types of the intersection.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly memberTypes: ObjectType[];

  /**
   * Name of this type, usually derived from sh:name or shaclmate:name.
   */
  readonly name: Name;
}
