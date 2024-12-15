import { dash } from "@tpluscode/rdf-ns-builders";
import { it } from "vitest";
import type { NodeShape } from "../NodeShape.js";
import type { Ontology } from "../Ontology.js";
import type { PropertyShape } from "../PropertyShape.js";
import type { Shape } from "../Shape.js";
import type { ShapesGraph } from "../ShapesGraph.js";
import { findPropertyShape as findPropertyShape_ } from "./findPropertyShape.js";

export function behavesLikePropertyShape<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
>(shapesGraph: ShapesGraph<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>) {
  const findPropertyShape = findPropertyShape_(shapesGraph);

  it("should have a group", ({ expect }) => {
    expect(
      findPropertyShape(dash.ScriptAPIShape, dash.generateClass)
        .group.unsafeCoerce()
        .identifier.equals(dash.ScriptAPIGenerationRules),
    ).toStrictEqual(true);
  });
}
