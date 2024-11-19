import { beforeAll, describe, it } from "vitest";
import { ShapesGraph } from "..";
import { testData } from "./testData";

describe("ShapesGraph", () => {
  let shapesGraph: ShapesGraph;

  beforeAll(() => {
    shapesGraph = ShapesGraph.fromDataset(testData.shapesGraph);
  });

  it("should parse the shapes correctly", ({ expect }) => {
    expect(shapesGraph.nodeShapes).toHaveLength(84);
    expect(shapesGraph.propertyShapes).toHaveLength(70);
  });
});
