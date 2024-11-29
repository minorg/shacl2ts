import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { ShapesGraph } from "./ShapesGraph";

export type ShapeFactory<
  NodeShapeT extends NodeShape,
  PropertyShapeT extends PropertyShape,
> = {
  createNodeShape(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, PropertyShapeT>,
  ): NodeShapeT;

  createPropertyShape(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, PropertyShapeT>,
  ): PropertyShapeT;
};
