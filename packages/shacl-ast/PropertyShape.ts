import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeShape } from "./NodeShape";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyPath } from "./PropertyPath.js";
import type { Shape } from "./Shape.js";

export interface PropertyShape<
  NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT> & ShapeT,
  PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT> & ShapeT,
  ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
> extends Shape<NodeShapeT, PropertyShapeT, ShapeT> {
  readonly defaultValue: Maybe<BlankNode | Literal | NamedNode>;
  readonly editor: Maybe<NamedNode>;
  readonly group: Maybe<PropertyGroup>;
  readonly order: Maybe<number>;
  readonly path: PropertyPath;
  readonly singleLine: Maybe<boolean>;
  readonly viewer: Maybe<NamedNode>;
}
