import type { DatasetCore } from "@rdfjs/types";
import { RdfjsShapesGraph } from "@shaclmate/shacl-ast";
import { NodeShape } from "./NodeShape.js";
import { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";

export class ShapesGraph extends RdfjsShapesGraph<
  NodeShape,
  PropertyShape,
  Shape
> {
  constructor({ dataset }: { dataset: DatasetCore }) {
    super({
      dataset,
      factory: {
        createNodeShape(resource: any, shapesGraph: ShapesGraph): NodeShape {
          return new NodeShape(resource, shapesGraph);
        },
        createPropertyShape(
          resource: any,
          shapesGraph: ShapesGraph,
        ): PropertyShape {
          return new PropertyShape(resource, shapesGraph);
        },
      },
    });
  }
}
