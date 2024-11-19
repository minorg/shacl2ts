import type { NamedNode } from "@rdfjs/types";
import { schema, xsd } from "@tpluscode/rdf-ns-builders";
import { beforeAll, describe, expect, it } from "vitest";
import { type PropertyShape, ShapesGraph } from "..";
import { testData } from "./testData";

describe("PropertyShape", () => {
  let shapesGraph: ShapesGraph;

  beforeAll(() => {
    shapesGraph = ShapesGraph.fromDataset(testData.shapesGraph);
  });

  const findPropertyShape = (
    nodeShapeNode: NamedNode,
    path: NamedNode,
  ): PropertyShape => {
    const nodeShape = shapesGraph.nodeShapeByNode(nodeShapeNode).unsafeCoerce();
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
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return propertyShape!;
  };

  it("should have a datatype", ({ expect }) => {
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

  it("should have a maxCount", ({ expect }) => {
    expect(
      findPropertyShape(
        schema.Person,
        schema.birthDate,
      ).constraints.maxCount.extractNullable(),
    ).toStrictEqual(1);
  });

  it("should have a name", ({ expect }) => {
    expect(
      findPropertyShape(schema.Person, schema.givenName).name.extractNullable()
        ?.value,
    ).toStrictEqual("given name");
  });

  it("should have a sh:node", () => {
    const nodeShapes = findPropertyShape(schema.Vehicle, schema.fuelConsumption)
      .constraints.nodes;
    expect(nodeShapes).toHaveLength(1);
  });

  it("should have sh:in", ({ expect }) => {
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

  it("should have sh:or", ({ expect }) => {
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

  it("should convert to a string", ({ expect }) => {
    expect(
      findPropertyShape(schema.Person, schema.givenName).toString(),
    ).not.toHaveLength(0);
  });
});
