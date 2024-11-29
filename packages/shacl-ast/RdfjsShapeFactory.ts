import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape";
import type { PropertyShape } from "./PropertyShape";
import type { Shape } from "./Shape";
import type { ShapesGraph } from "./ShapesGraph";

export type RdfjsShapeFactory<
  NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT> & ShapeT,
  PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT> & ShapeT,
  ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
> = {
  createNodeShape(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, PropertyShapeT, ShapeT>,
  ): NodeShapeT;

  createPropertyShape(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, PropertyShapeT, ShapeT>,
  ): PropertyShapeT;
};
