import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeKind } from "./NodeKind.js";
import type { NodeShape } from "./NodeShape.js";
import type { PropertyShape } from "./PropertyShape.js";

export interface Shape<
  NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT> & ShapeT,
  PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT> & ShapeT,
  ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
> {
  readonly constraints: Shape.Constraints<NodeShapeT, PropertyShapeT, ShapeT>;
  readonly description: Maybe<Literal>;
  readonly name: Maybe<Literal>;
  readonly targets: Shape.Targets;
}

export namespace Shape {
  export interface Constraints<
    NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT> & ShapeT,
    PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT> & ShapeT,
    ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
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
