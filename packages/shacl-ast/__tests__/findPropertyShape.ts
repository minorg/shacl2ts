import type { NamedNode } from "@rdfjs/types";
import { expect } from "vitest";
import type { NodeShape } from "../NodeShape.js";
import type { Ontology } from "../Ontology.js";
import type { PropertyGroup } from "../PropertyGroup.js";
import type { PropertyShape } from "../PropertyShape.js";
import type { Shape } from "../Shape.js";
import type { ShapesGraph } from "../ShapesGraph.js";

export function findPropertyShape<
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
>(
  shapesGraph: ShapesGraph<
    NodeShapeT,
    OntologyT,
    PropertyGroupT,
    PropertyShapeT,
    ShapeT
  >,
) {
  return (nodeShapeIdentifier: NamedNode, path: NamedNode) => {
    const nodeShape = shapesGraph
      .nodeShapeByIdentifier(nodeShapeIdentifier)
      .unsafeCoerce();
    const propertyShape = nodeShape.constraints.properties.find(
      (propertyShape) => {
        const propertyShapePath = propertyShape.path;
        return (
          propertyShapePath.kind === "PredicatePath" &&
          propertyShapePath.iri.equals(path)
        );
      },
    );
    expect(propertyShape).toBeDefined();
    return propertyShape!;
  };
}
