import { beforeAll, describe, it } from "vitest";
import { RdfjsShapesGraph } from "../RdfjsShapesGraph.js";
import {
  type DefaultRdfjsShapesGraph,
  defaultRdfjsShapeFactory,
} from "../defaultRdfjsShapeFactory.js";
import { testData } from "./testData.js";

describe("RdfjsShapesGraph", () => {
  let shapesGraph: DefaultRdfjsShapesGraph;

  beforeAll(() => {
    shapesGraph = new RdfjsShapesGraph({
      dataset: testData.shapesGraph,
      shapeFactory: defaultRdfjsShapeFactory,
    });
  });

  it("should parse the shapes correctly", ({ expect }) => {
    expect(shapesGraph.nodeShapes).toHaveLength(84);
    expect(shapesGraph.propertyShapes).toHaveLength(70);
  });
});
