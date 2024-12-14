import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export type RdfjsFactory<
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
