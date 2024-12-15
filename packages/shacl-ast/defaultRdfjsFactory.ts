import type { Resource } from "rdfjs-resource";
import type { RdfjsFactory } from "./RdfjsFactory.js";
import { RdfjsNodeShape } from "./RdfjsNodeShape.js";
import { RdfjsOntology } from "./RdfjsOntology.js";
import { RdfjsPropertyShape } from "./RdfjsPropertyShape.js";
import type { RdfjsShape } from "./RdfjsShape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export type DefaultRdfjsOntology = RdfjsOntology;

export type DefaultRdfjsNodeShape = RdfjsNodeShape<
  any,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
>;
export type DefaultRdfjsPropertyShape = RdfjsPropertyShape<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  any,
  DefaultRdfjsShape
>;
export type DefaultRdfjsShape = RdfjsShape<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyShape,
  any
>;
export type DefaultRdfjsShapesGraph = ShapesGraph<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
>;

export const defaultRdfjsFactory: RdfjsFactory<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
> = {
  createNodeShape(resource: Resource, shapesGraph: DefaultRdfjsShapesGraph) {
    return new RdfjsNodeShape(resource, shapesGraph);
  },

  createOntology(
    resource: Resource,
    _shapesGraph: DefaultRdfjsShapesGraph,
  ): DefaultRdfjsOntology {
    return new RdfjsOntology(resource);
  },

  createPropertyShape(
    resource: Resource,
    shapesGraph: DefaultRdfjsShapesGraph,
  ) {
    return new RdfjsPropertyShape(resource, shapesGraph);
  },
};
