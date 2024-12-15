import { dash } from "@tpluscode/rdf-ns-builders";
import { it } from "vitest";
import type { NodeShape } from "../NodeShape.js";
import type { Ontology } from "../Ontology.js";
import type { PropertyShape } from "../PropertyShape.js";
import type { Shape } from "../Shape.js";
import type { ShapesGraph } from "../ShapesGraph.js";

export function behavesLikePropertyGroup<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
>(shapesGraph: ShapesGraph<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>) {
  it("should have a label", ({ expect }) => {
    const propertyGroup = shapesGraph
      .propertyGroupByIdentifier(dash.ScriptAPIGenerationRules)
      .unsafeCoerce();
    expect(propertyGroup.label.unsafeCoerce().value).toStrictEqual(
      "Script API Generation Rules",
    );
  });
}
