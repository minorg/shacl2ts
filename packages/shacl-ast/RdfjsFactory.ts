import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export type RdfjsFactory<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
> = {
  createNodeShape(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>,
  ): NodeShapeT;

  createOntology(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>,
  ): OntologyT;

  createPropertyShape(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>,
  ): PropertyShapeT;
};
