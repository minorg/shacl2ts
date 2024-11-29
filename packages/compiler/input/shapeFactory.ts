import type { RdfjsShapeFactory } from "@shaclmate/shacl-ast";
import { NodeShape } from "./NodeShape.js";
import { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph";

export const shapeFactory: RdfjsShapeFactory<NodeShape, PropertyShape, Shape> =
  {
    createNodeShape(resource: any, shapesGraph: ShapesGraph): NodeShape {
      return new NodeShape(resource, shapesGraph);
    },
    createPropertyShape(
      resource: any,
      shapesGraph: ShapesGraph,
    ): PropertyShape {
      return new PropertyShape(resource, shapesGraph);
    },
  };
