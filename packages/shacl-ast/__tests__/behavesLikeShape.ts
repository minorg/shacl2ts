import { schema, xsd } from "@tpluscode/rdf-ns-builders";
import { expect, it } from "vitest";
import type { NodeShape } from "../NodeShape.js";
import type { Ontology } from "../Ontology.js";
import type { PropertyShape } from "../PropertyShape.js";
import type { Shape } from "../Shape.js";
import type { ShapesGraph } from "../ShapesGraph.js";
import { findPropertyShape as findPropertyShape_ } from "./findPropertyShape.js";

export function behavesLikeShape<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
>(shapesGraph: ShapesGraph<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>) {
  const findPropertyShape = findPropertyShape_(shapesGraph);

  it("should have a name", ({ expect }) => {
    expect(
      findPropertyShape(schema.Person, schema.givenName).name.extractNullable()
        ?.value,
    ).toStrictEqual("given name");
  });

  it("constraints: should have a datatype", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.Person,
        schema.givenName,
      ).constraints.datatype.extractNullable()?.value,
    ).toStrictEqual(xsd.string.value);

    expect(
      findPropertyShape(
        schema.Person,
        schema.parent,
      ).constraints.datatype.extractNullable(),
    ).toBeNull();
  });

  it("constraints: should have a maxCount", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.Person,
        schema.birthDate,
      ).constraints.maxCount.extractNullable(),
    ).toStrictEqual(1);
  });

  it("constraints: should have a sh:node", () => {
    const nodeShapes = findPropertyShape(schema.Vehicle, schema.fuelConsumption)
      .constraints.nodes;
    expect(nodeShapes).toHaveLength(1);
  });

  it("constraints: should have sh:in", ({ expect }) => {
    const propertyShape = findPropertyShape(schema.Person, schema.gender);
    const in_ = propertyShape.constraints.in_.orDefault([]);
    expect(in_).toHaveLength(2);
    expect(
      in_.find(
        (member) => member.termType === "Literal" && member.value === "female",
      ),
    );
    expect(
      in_.find(
        (member) => member.termType === "Literal" && member.value === "male",
      ),
    );
  });

  it("constraints: should have sh:or", ({ expect }) => {
    const propertyShape = findPropertyShape(
      schema.DatedMoneySpecification,
      schema.endDate,
    );
    const or = propertyShape.constraints.or;
    expect(or).toHaveLength(2);
    expect(
      or.some((propertyShape) =>
        propertyShape.constraints.datatype.extractNullable()?.equals(xsd.date),
      ),
    ).toStrictEqual(true);
    expect(
      or.some((propertyShape) =>
        propertyShape.constraints.datatype
          .extractNullable()
          ?.equals(xsd.dateTime),
      ),
    ).toStrictEqual(true);
  });
}
