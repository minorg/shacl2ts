import { schema } from "@tpluscode/rdf-ns-builders";
import { it } from "vitest";
import type { NodeShape } from "../NodeShape.js";
import type { Ontology } from "../Ontology.js";
import type { PropertyGroup } from "../PropertyGroup.js";
import type { PropertyShape } from "../PropertyShape.js";
import type { Shape } from "../Shape.js";
import type { ShapesGraph } from "../ShapesGraph.js";

export function behavesLikeNodeShape<
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
  it("constraints: should get closed true", ({ expect }) => {
    expect(
      shapesGraph
        .nodeShapeByIdentifier(schema.DatedMoneySpecification)
        .unsafeCoerce()
        .constraints.closed.unsafeCoerce(),
    ).toStrictEqual(true);
  });

  it("constraints: should have properties", ({ expect }) => {
    expect(
      shapesGraph.nodeShapeByIdentifier(schema.Person).unsafeCoerce()
        .constraints.properties,
    ).toHaveLength(9);
  });
}
