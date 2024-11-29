import type { BlankNode, DefaultGraph, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { PropertyGroup } from "./PropertyGroup.js";

export interface ShapesGraph<NodeShapeT, PropertyShapeT, ShapeT> {
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
