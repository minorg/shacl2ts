import { schema } from "@tpluscode/rdf-ns-builders";
import { describe, it } from "vitest";
import { RdfjsShapesGraph } from "../RdfjsShapesGraph.js";
import {
  type DefaultRdfjsShapesGraph,
  defaultRdfjsFactory,
} from "../defaultRdfjsFactory.js";
import { behavesLikeNodeShape } from "./behavesLikeNodeShape.js";
import { testData } from "./testData.js";

describe("RdfjsNodeShape", () => {
  const shapesGraph: DefaultRdfjsShapesGraph = new RdfjsShapesGraph({
    dataset: testData.shapesGraph,
    factory: defaultRdfjsFactory,
  });

  it("should convert to a string", ({ expect }) => {
    expect(
      shapesGraph
        .nodeShapeByIdentifier(schema.Person)
        .unsafeCoerce()
        .toString(),
    ).not.toHaveLength(0);
  });

  behavesLikeNodeShape(shapesGraph);
});
