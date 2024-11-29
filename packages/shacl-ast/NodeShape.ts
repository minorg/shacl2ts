import type { Maybe } from "purify-ts";
import type { Shape } from "./Shape.js";

export interface NodeShape<NodeShapeT, PropertyShapeT, ShapeT>
  extends Shape<NodeShapeT, ShapeT> {
  readonly constraints: NodeShape.Constraints<
    NodeShapeT,
    PropertyShapeT,
    ShapeT
  >;
}

export namespace NodeShape {
  export interface Constraints<NodeShapeT, PropertyShapeT, ShapeT>
    extends Shape.Constraints<NodeShapeT, ShapeT> {
    readonly closed: Maybe<boolean>;
    readonly properties: readonly PropertyShapeT[];
  }
}
