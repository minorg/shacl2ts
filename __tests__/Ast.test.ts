import { describe, it } from "vitest";
import { Ast } from "../ast/Ast";
import { testShapesGraph } from "./testShapesGraph";

describe("Ast", () => {
  it("should get an AST from the test shapes graph", ({ expect }) => {
    const ast = Ast.fromShapesGraph(testShapesGraph);
    expect(ast.objectTypes).toHaveLength(2);
  });
});
