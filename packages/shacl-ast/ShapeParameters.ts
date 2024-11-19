import type { BlankNode, NamedNode } from "@rdfjs/types";
import type { ShapesGraph } from "./ShapesGraph.js";

export interface ShapeParameters {
  node: BlankNode | NamedNode;
  shapesGraph: ShapesGraph;
}
