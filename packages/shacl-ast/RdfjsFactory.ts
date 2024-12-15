import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export type RdfjsFactory<
  NodeShapeT extends NodeShape<
    any,
    OntologyT,
    PropertyGroupT,
    PropertyShapeT,
    ShapeT
  > &
    ShapeT,
  OntologyT extends Ontology,
  PropertyGroupT extends PropertyGroup,
  PropertyShapeT extends PropertyShape<
    NodeShapeT,
    OntologyT,
    PropertyGroupT,
    any,
    ShapeT
  > &
    ShapeT,
  ShapeT extends Shape<
    NodeShapeT,
    OntologyT,
    PropertyGroupT,
    PropertyShapeT,
    any
  >,
> = {
  createNodeShape(
    resource: Resource,
    shapesGraph: ShapesGraph<
      NodeShapeT,
      OntologyT,
      PropertyGroupT,
      PropertyShapeT,
      ShapeT
    >,
  ): NodeShapeT;

  createOntology(
    resource: Resource,
    shapesGraph: ShapesGraph<
      NodeShapeT,
      OntologyT,
      PropertyGroupT,
      PropertyShapeT,
      ShapeT
    >,
  ): OntologyT;

  createPropertyGroup(
    resource: Resource,
    shapesGraph: ShapesGraph<
      NodeShapeT,
      OntologyT,
      PropertyGroupT,
      PropertyShapeT,
      ShapeT
    >,
  ): PropertyGroupT;

  createPropertyShape(
    resource: Resource,
    shapesGraph: ShapesGraph<
      NodeShapeT,
      OntologyT,
      PropertyGroupT,
      PropertyShapeT,
      ShapeT
    >,
  ): PropertyShapeT;
};
