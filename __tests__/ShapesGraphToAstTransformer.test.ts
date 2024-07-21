import { describe, it } from "vitest";
import { testShapesGraph } from "./testShapesGraph.js";
import { ShapesGraphToAstTransformer } from "../ShapesGraphToAstTransformer.js";

describe("ShapesGraphToAstTransformer", () => {
  it("should get an AST from the test shapes graph", ({ expect }) => {
    const ast = new ShapesGraphToAstTransformer()
      .transform(testShapesGraph)
      .extract();
    if (ast instanceof Error) {
      throw ast;
    }
    expect(ast.objectTypes).toHaveLength(2);
  });
});
