import type { DatasetCore } from "@rdfjs/types";
import { RdfjsShapesGraph } from "@shaclmate/shacl-ast";
import type { Resource } from "rdfjs-resource";
import { NodeShape } from "./NodeShape.js";
import { Ontology } from "./Ontology.js";
import { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";

export class ShapesGraph extends RdfjsShapesGraph<
  NodeShape,
  Ontology,
  PropertyShape,
  Shape
> {
  constructor({ dataset }: { dataset: DatasetCore }) {
    super({
      dataset,
      factory: {
        createNodeShape(
          resource: Resource,
          shapesGraph: ShapesGraph,
        ): NodeShape {
          return new NodeShape(resource, shapesGraph);
        },
        createOntology(resource): Ontology {
          return new Ontology(resource);
        },
        createPropertyShape(
          resource: Resource,
          shapesGraph: ShapesGraph,
        ): PropertyShape {
          return new PropertyShape(resource, shapesGraph);
        },
      },
    });
  }
}
