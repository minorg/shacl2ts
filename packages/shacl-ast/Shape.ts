import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeKind } from "./NodeKind.js";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";

export interface Shape<
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
  readonly constraints: Shape.Constraints<
    NodeShapeT,
    OntologyT,
    PropertyGroupT,
    PropertyShapeT,
    ShapeT
  >;
  readonly description: Maybe<Literal>;
  readonly identifier: BlankNode | NamedNode;
  readonly isDefinedBy: Maybe<OntologyT>;
  readonly name: Maybe<Literal>;
  readonly targets: Shape.Targets;
}

export namespace Shape {
  export interface Constraints<
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
    readonly and: readonly ShapeT[];
    readonly classes: readonly NamedNode[];
    readonly datatype: Maybe<NamedNode>;
    readonly hasValue: Maybe<BlankNode | Literal | NamedNode>;
    readonly in_: Maybe<readonly (BlankNode | Literal | NamedNode)[]>;
    readonly maxCount: Maybe<number>;
    readonly maxExclusive: Maybe<Literal>;
    readonly maxInclusive: Maybe<Literal>;
    readonly minCount: Maybe<number>;
    readonly minExclusive: Maybe<Literal>;
    readonly minInclusive: Maybe<Literal>;
    readonly nodeKinds: Set<NodeKind>;
    readonly nodes: readonly NodeShapeT[];
    readonly not: readonly ShapeT[];
    readonly or: readonly ShapeT[];
    readonly xone: readonly ShapeT[];
  }

  export interface Targets {
    readonly targetClasses: readonly NamedNode[];
    readonly targetNodes: readonly (Literal | NamedNode)[];
    readonly targetObjectsOf: readonly NamedNode[];
    readonly targetSubjectsOf: readonly NamedNode[];
  }
}
