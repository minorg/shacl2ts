import type { TsFeature } from "../enums/index.js";
import type { ObjectCompositeType } from "./ObjectCompositeType.js";

/**
 * A disjunction/union of object types, corresponding to an sh:or on a node shape.
 */
export interface ObjectUnionType extends ObjectCompositeType {
  /**
   * Should generated code derived from this ObjectType be visible outside its module?
   *
   * Defaults to true.
   */
  readonly export: boolean;

  readonly kind: "ObjectUnionType";

  /**
   * TypeScript features to generate.
   */
  readonly tsFeatures: Set<TsFeature>;
}
