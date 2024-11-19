import { schema } from "@tpluscode/rdf-ns-builders";
import { beforeAll, describe, it } from "vitest";
import { ShapesGraph } from "..";
import { testData } from "./testData";

describe("NodeShape", () => {
  let shapesGraph: ShapesGraph;

  beforeAll(() => {
    shapesGraph = ShapesGraph.fromDataset(testData.shapesGraph);
  });

  it("should have properties", ({ expect }) => {
    expect(
      shapesGraph.nodeShapeByNode(schema.Person).unsafeCoerce().constraints
        .properties,
    ).toHaveLength(9);
  });

  it("should get closed true", ({ expect }) => {
    expect(
      shapesGraph
        .nodeShapeByNode(schema.DatedMoneySpecification)
        .unsafeCoerce()
        .constraints.closed.unsafeCoerce(),
    ).toStrictEqual(true);
  });

  it("should convert to a string", ({ expect }) => {
    expect(
      shapesGraph.nodeShapeByNode(schema.Person).unsafeCoerce().toString(),
    ).not.toHaveLength(0);
  });
});
