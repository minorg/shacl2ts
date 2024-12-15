import type { Resource } from "rdfjs-resource";
import type { RdfjsFactory } from "./RdfjsFactory.js";
import { RdfjsNodeShape } from "./RdfjsNodeShape.js";
import { RdfjsOntology } from "./RdfjsOntology.js";
import { RdfjsPropertyGroup } from "./RdfjsPropertyGroup.js";
import { RdfjsPropertyShape } from "./RdfjsPropertyShape.js";
import type { RdfjsShape } from "./RdfjsShape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export type DefaultRdfjsOntology = RdfjsOntology;
export type DefaultRdfjsPropertyGroup = RdfjsPropertyGroup;

export type DefaultRdfjsNodeShape = RdfjsNodeShape<
  any,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyGroup,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
>;
export type DefaultRdfjsPropertyShape = RdfjsPropertyShape<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyGroup,
  any,
  DefaultRdfjsShape
>;
export type DefaultRdfjsShape = RdfjsShape<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyGroup,
  DefaultRdfjsPropertyShape,
  any
>;
export type DefaultRdfjsShapesGraph = ShapesGraph<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyGroup,
  DefaultRdfjsPropertyShape,
  DefaultRdfjsShape
>;

export const defaultRdfjsFactory: RdfjsFactory<
  DefaultRdfjsNodeShape,
  DefaultRdfjsOntology,
  DefaultRdfjsPropertyGroup,
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

  createPropertyGroup(
    resource: Resource,
    _shapesGraph: DefaultRdfjsShapesGraph,
  ): DefaultRdfjsPropertyGroup {
    return new RdfjsPropertyGroup(resource);
  },

  createPropertyShape(
    resource: Resource,
    shapesGraph: DefaultRdfjsShapesGraph,
  ) {
    return new RdfjsPropertyShape(resource, shapesGraph);
  },
};
