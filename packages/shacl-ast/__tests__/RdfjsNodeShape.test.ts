import { schema } from "@tpluscode/rdf-ns-builders";
import { beforeAll, describe, it } from "vitest";
import { RdfjsShapesGraph } from "../RdfjsShapesGraph.js";
import {
  type DefaultRdfjsShapesGraph,
  defaultRdfjsShapeFactory,
} from "../defaultRdfjsShapeFactory.js";
import { testData } from "./testData.js";

describe("RdfjsNodeShape", () => {
  let shapesGraph: DefaultRdfjsShapesGraph;

  beforeAll(() => {
    shapesGraph = new RdfjsShapesGraph({
      dataset: testData.shapesGraph,
      shapeFactory: defaultRdfjsShapeFactory,
    });
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