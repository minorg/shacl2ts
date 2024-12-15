import { fail } from "node:assert";
import { dash, rdf, schema } from "@tpluscode/rdf-ns-builders";
import { it } from "vitest";
import type { NodeShape } from "../NodeShape.js";
import type { Ontology } from "../Ontology.js";
import type { PredicatePath } from "../PropertyPath.js";
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

  // No sh:defaultValue in the test data

  it("should have a group", ({ expect }) => {
    expect(
      findPropertyShape(dash.ScriptAPIShape, dash.generateClass)
        .group.unsafeCoerce()
        .identifier.equals(dash.ScriptAPIGenerationRules),
    ).toStrictEqual(true);
  });

  it("should have an order", ({ expect }) => {
    expect(
      findPropertyShape(
        dash.ScriptAPIShape,
        dash.generatePrefixClasses,
      ).order.unsafeCoerce(),
    ).toStrictEqual(15);
  });

  it("should parse a property path", ({ expect }) => {
    const path = findPropertyShape(
      dash.ScriptAPIShape,
      dash.generatePrefixClasses,
    ).path;
    expect(path.kind).toStrictEqual("PredicatePath");
    expect(
      (path as PredicatePath).iri.equals(dash.generatePrefixClasses),
    ).toStrictEqual(true);
  });

  it("should parse an inverse property path", ({ expect }) => {
    const nodeShape = shapesGraph
      .nodeShapeByIdentifier(schema.Person)
      .unsafeCoerce();
    for (const propertyShape of nodeShape.constraints.properties) {
      if (propertyShape.path.kind !== "InversePath") {
        continue;
      }
      expect(propertyShape.path.path.kind).toStrictEqual("PredicatePath");
      expect(
        (propertyShape.path.path as PredicatePath).iri.equals(schema.parent),
      ).toStrictEqual(true);
      return;
    }
    fail();
  });

  it("should parse a zero or more property path", ({ expect }) => {
    const nodeShape = shapesGraph
      .nodeShapeByIdentifier(dash.ListShape)
      .unsafeCoerce();
    for (const propertyShape of nodeShape.constraints.properties) {
      if (propertyShape.path.kind !== "ZeroOrMorePath") {
        continue;
      }
      expect(propertyShape.path.path.kind).toStrictEqual("PredicatePath");
      expect(
        (propertyShape.path.path as PredicatePath).iri.equals(rdf.rest),
      ).toStrictEqual(true);
      return;
    }
    fail();
  });
}
