import type { Maybe } from "purify-ts";
import type { PropertyShape } from "./PropertyShape";
import type { Shape } from "./Shape.js";

export interface NodeShape<
  NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT> & ShapeT,
  PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT> & ShapeT,
  ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
> extends Shape<NodeShapeT, PropertyShapeT, ShapeT> {
  readonly constraints: NodeShape.Constraints<
    NodeShapeT,
    PropertyShapeT,
    ShapeT
  >;
}

export namespace NodeShape {
  export interface Constraints<
    NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT> & ShapeT,
    PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT> & ShapeT,
    ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
  > extends Shape.Constraints<NodeShapeT, PropertyShapeT, ShapeT> {
    readonly closed: Maybe<boolean>;
    readonly properties: readonly PropertyShapeT[];
  }
}
