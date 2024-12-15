import type { Maybe } from "purify-ts";
import type { Ontology } from "./Ontology.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";

export interface NodeShape<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
> extends Shape<NodeShapeT, OntologyT, PropertyShapeT, ShapeT> {
  readonly constraints: NodeShape.Constraints<
    NodeShapeT,
    OntologyT,
    PropertyShapeT,
    ShapeT
  >;
}

export namespace NodeShape {
  export interface Constraints<
    NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> &
      ShapeT,
    OntologyT extends Ontology,
    PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
      ShapeT,
    ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
  > extends Shape.Constraints<NodeShapeT, OntologyT, PropertyShapeT, ShapeT> {
    readonly closed: Maybe<boolean>;
    readonly properties: readonly PropertyShapeT[];
  }
}
