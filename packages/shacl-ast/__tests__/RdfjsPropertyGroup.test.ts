import { describe } from "vitest";
import { RdfjsShapesGraph } from "../RdfjsShapesGraph.js";
import {
  type DefaultRdfjsShapesGraph,
  defaultRdfjsFactory,
} from "../defaultRdfjsFactory.js";
import { behavesLikePropertyGroup } from "./behavesLikePropertyGroup.js";
import { testData } from "./testData.js";

describe("RdfjsPropertyGroup", () => {
  const shapesGraph: DefaultRdfjsShapesGraph = new RdfjsShapesGraph({
    dataset: testData.shapesGraph,
    factory: defaultRdfjsFactory,
  });

  behavesLikePropertyGroup(shapesGraph);
});
