import { describe } from "vitest";
import { RdfjsShapesGraph } from "../RdfjsShapesGraph.js";
import {
  type DefaultRdfjsShapesGraph,
  defaultRdfjsFactory,
} from "../defaultRdfjsFactory.js";
import { behavesLikeShape } from "./behavesLikeShape.js";
import { testData } from "./testData.js";

describe("RdfjsShape", () => {
  const shapesGraph: DefaultRdfjsShapesGraph = new RdfjsShapesGraph({
    dataset: testData.shapesGraph,
    factory: defaultRdfjsFactory,
  });

  behavesLikeShape(shapesGraph);
});
