import type { BlankNode, DefaultGraph, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";

export interface ShapesGraph<
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
> {
  readonly node: BlankNode | DefaultGraph | NamedNode | null;
  readonly nodeShapes: readonly NodeShapeT[];
  readonly ontologies: readonly OntologyT[];
  readonly propertyGroups: readonly PropertyGroupT[];
  readonly propertyShapes: readonly PropertyShapeT[];

  nodeShapeByIdentifier(identifier: BlankNode | NamedNode): Maybe<NodeShapeT>;
  ontologyByIdentifier(identifier: BlankNode | NamedNode): Maybe<OntologyT>;
  propertyGroupByIdentifier(identifier: NamedNode): Maybe<PropertyGroupT>;
  propertyShapeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Maybe<PropertyShapeT>;
  shapeByIdentifier(identifier: BlankNode | NamedNode): Maybe<ShapeT>;
}
