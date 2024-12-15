import { dash, schema, xsd } from "@tpluscode/rdf-ns-builders";
import { DataFactory as dataFactory } from "n3";
import { it } from "vitest";
import { NodeKind } from "../NodeKind.js";
import type { NodeShape } from "../NodeShape.js";
import type { Ontology } from "../Ontology.js";
import type { PropertyGroup } from "../PropertyGroup.js";
import type { PropertyShape } from "../PropertyShape.js";
import type { Shape } from "../Shape.js";
import type { ShapesGraph } from "../ShapesGraph.js";
import { findPropertyShape as findPropertyShape_ } from "./findPropertyShape.js";

export function behavesLikeShape<
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
  const findPropertyShape = findPropertyShape_(shapesGraph);

  it("should have a description", ({ expect }) => {
    expect(
      findPropertyShape(
        dash.ScriptAPIShape,
        dash.generateClass,
      ).description.extractNullable()?.value,
    ).toMatch(/^The API generator/);
  });

  it("should be defined by an ontology", ({ expect }) => {
    const schemaShaclNodeShape = shapesGraph
      .nodeShapeByIdentifier(
        dataFactory.namedNode(
          "http://topbraid.org/examples/schemashacl#AustralianAddressShape",
        ),
      )
      .unsafeCoerce();
    const schemaShaclOntology = schemaShaclNodeShape.isDefinedBy.unsafeCoerce();
    expect(schemaShaclOntology.identifier.value).toStrictEqual(
      "http://topbraid.org/examples/schemashacl",
    );

    const dashNodeShape = shapesGraph
      .nodeShapeByIdentifier(dash.ScriptAPIShape)
      .unsafeCoerce();
    const dashOntology = dashNodeShape.isDefinedBy.unsafeCoerce();
    expect(dashOntology.identifier.value).toStrictEqual(
      "http://datashapes.org/dash",
    );
  });

  it("should have a name", ({ expect }) => {
    expect(
      findPropertyShape(schema.Person, schema.givenName).name.extractNullable()
        ?.value,
    ).toStrictEqual("given name");
  });

  // No shape in the test data with a clean sh:and

  it("constraints: should have an sh:class", ({ expect }) => {
    const classes = findPropertyShape(schema.Person, schema.parent).constraints
      .classes;
    expect(classes).toHaveLength(1);
    expect(classes[0].equals(schema.Person)).toStrictEqual(true);
  });

  it("constraints: should have an sh:datatype", ({ expect }) => {
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

  it("constraints: should have an sh:hasValue", ({ expect }) => {
    expect(
      findPropertyShape(
        dataFactory.namedNode(
          "http://topbraid.org/examples/schemashacl#FemalePerson",
        ),
        schema.gender,
      ).constraints.hasValue.extractNullable()?.value,
    ).toStrictEqual("female");
  });

  it("constraints: should have an sh:in", ({ expect }) => {
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

  it("constraints: should have an sh:maxCount", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.Person,
        schema.birthDate,
      ).constraints.maxCount.extractNullable(),
    ).toStrictEqual(1);
  });

  it("constraints: should have an sh:maxExclusive", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.PriceSpecification,
        schema.baseSalary,
      ).constraints.maxExclusive.extractNullable()?.value,
    ).toStrictEqual("1000000000");
  });

  it("constraints: should have an sh:maxInclusive", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.GeoCoordinates,
        schema.latitude,
      ).constraints.maxInclusive.extractNullable()?.value,
    ).toStrictEqual("90");
  });

  it("constraints: should have an sh:minCount", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.DatedMoneySpecification,
        schema.amount,
      ).constraints.minCount.extractNullable(),
    ).toStrictEqual(1);
  });

  it("constraints: should have an sh:minExclusive", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.PriceSpecification,
        schema.baseSalary,
      ).constraints.minExclusive.extractNullable()?.value,
    ).toStrictEqual("0");
  });

  it("constraints: should have an sh:minInclusive", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.GeoCoordinates,
        schema.latitude,
      ).constraints.minInclusive.extractNullable()?.value,
    ).toStrictEqual("-90");
  });

  it("constraints: should have an sh:node", ({ expect }) => {
    const nodeShapes = findPropertyShape(schema.Vehicle, schema.fuelConsumption)
      .constraints.nodes;
    expect(nodeShapes).toHaveLength(1);
  });

  it("constraints: should have an sh:nodeKind", ({ expect }) => {
    const nodeKinds = findPropertyShape(schema.Person, schema.parent)
      .constraints.nodeKinds;
    expect(nodeKinds.size).toStrictEqual(1);
    expect(nodeKinds.has(NodeKind.IRI)).toStrictEqual(true);
  });

  // No shape in the test data with a clean sh:not

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

  // No sh:xone in the test data
}
