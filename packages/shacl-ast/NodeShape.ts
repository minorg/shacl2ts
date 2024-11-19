import { sh } from "@tpluscode/rdf-ns-builders";
import type { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { PropertyShape } from "./PropertyShape.js";
import { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export class NodeShape extends Shape {
  readonly constraints: NodeShape.Constraints;

  constructor(resource: Resource, shapesGraph: ShapesGraph) {
    super(resource);
    this.constraints = new NodeShape.Constraints(resource, shapesGraph);
  }

  override toString(): string {
    return `NodeShape(node=${this.resource.identifier.value})`;
  }
}

export namespace NodeShape {
  export class Constraints extends Shape.Constraints {
    get closed(): Maybe<boolean> {
      return this.resource
        .value(sh.closed)
        .chain((value) => value.toBoolean())
        .toMaybe();
    }

    get properties(): readonly PropertyShape[] {
      return [...this.resource.values(sh.property)].flatMap((value) =>
        value
          .toIdentifier()
          .toMaybe()
          .chain((shapeNode) => this.shapesGraph.propertyShapeByNode(shapeNode))
          .toList(),
      );
    }
  }
}
