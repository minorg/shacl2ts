import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyPath } from "./PropertyPath.js";
import type { Shape } from "./Shape.js";

export interface PropertyShape<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
> extends Shape<NodeShapeT, OntologyT, PropertyShapeT, ShapeT> {
  readonly defaultValue: Maybe<BlankNode | Literal | NamedNode>;
  readonly group: Maybe<PropertyGroup>;
  readonly order: Maybe<number>;
  readonly path: PropertyPath;
}
