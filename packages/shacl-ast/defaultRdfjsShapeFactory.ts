import type { Resource } from "rdfjs-resource";
import { RdfjsNodeShape } from "./RdfjsNodeShape.js";
import { RdfjsPropertyShape } from "./RdfjsPropertyShape.js";
import type { RdfjsShape } from "./RdfjsShape.js";
import type { RdfjsShapeFactory } from "./RdfjsShapeFactory.js";
import type { ShapesGraph } from "./ShapesGraph";

export type DefaultRdfjsNodeShape = RdfjsNodeShape<
  any,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
>;
export type DefaultRdfjsPropertyShape = RdfjsPropertyShape<
  DefaultRdfjsNodeShape,
  any,
  DefaultRdfjsShape
>;
export type DefaultRdfjsShape = RdfjsShape<
  DefaultRdfjsNodeShape,
  DefaultRdfjsPropertyShape,
  any
>;
export type DefaultRdfjsShapesGraph = ShapesGraph<
  DefaultRdfjsNodeShape,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
>;

export const defaultRdfjsShapeFactory: RdfjsShapeFactory<
  DefaultRdfjsNodeShape,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
> = {
  createNodeShape(resource: Resource, shapesGraph: DefaultRdfjsShapesGraph) {
    return new RdfjsNodeShape(resource, shapesGraph);
  },

  createPropertyShape(
    resource: Resource,
    shapesGraph: DefaultRdfjsShapesGraph,
  ) {
    return new RdfjsPropertyShape(resource, shapesGraph);
  },
};
