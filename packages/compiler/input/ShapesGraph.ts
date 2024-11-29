import type { DatasetCore } from "@rdfjs/types";
import { RdfjsShapesGraph } from "@shaclmate/shacl-ast";
import type { NodeShape } from "./NodeShape.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import { shapeFactory } from "./shapeFactory.js";

export class ShapesGraph extends RdfjsShapesGraph<
  NodeShape,
  PropertyShape,
  Shape
> {
  constructor({ dataset }: { dataset: DatasetCore }) {
    super({ dataset, shapeFactory });
  }
}
