import type { BlankNode, DefaultGraph, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeShape } from "./NodeShape.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";

export interface ShapesGraph<
  NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT>,
  PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT>,
  ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
> {
  readonly node: BlankNode | DefaultGraph | NamedNode | null;
  readonly nodeShapes: readonly NodeShapeT[];
  readonly propertyGroups: readonly PropertyGroup[];
  readonly propertyShapes: readonly PropertyShapeT[];

  nodeShapeByNode(nodeShapeNode: BlankNode | NamedNode): Maybe<NodeShapeT>;
  propertyGroupByNode(propertyGroupNode: NamedNode): Maybe<PropertyGroup>;
  propertyShapeByNode(
    propertyShapeNode: BlankNode | NamedNode,
  ): Maybe<PropertyShapeT>;
  shapeByNode(node: BlankNode | NamedNode): Maybe<ShapeT>;
}
