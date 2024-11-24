import type { Name } from "./Name.js";
import type { ObjectType } from "./ObjectType.js";

/**
 * A disjunction/union of object types, corresponding to an sh:or on a node shape.
 */
export interface ObjectUnionType {
  /**
   * Should generated code derived from this ObjectType be visible outside its module?
   *
   * Defaults to true.
   */
  readonly export: boolean;

  readonly kind: "ObjectUnionType";

  /**
   * Member types of the union.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly memberTypes: ObjectType[];

  /**
   * Name of this type, usually derived from sh:name or shaclmate:name.
   */
  readonly name: Name;
}
