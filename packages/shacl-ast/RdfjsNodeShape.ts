import { sh } from "@tpluscode/rdf-ns-builders";
import type { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyShape } from "./PropertyShape.js";
import { RdfjsShape } from "./RdfjsShape.js";
import type { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export class RdfjsNodeShape<
    NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> &
      ShapeT,
    OntologyT extends Ontology,
    PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
      ShapeT,
    ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
  >
  extends RdfjsShape<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>
  implements NodeShape<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>
{
  readonly constraints: RdfjsNodeShape.Constraints<
    NodeShapeT,
    OntologyT,
    PropertyShapeT,
    ShapeT
  >;

  constructor(
    resource: Resource,
    shapesGraph: ShapesGraph<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>,
  ) {
    super(resource, shapesGraph);
    this.constraints = new RdfjsNodeShape.Constraints(resource, shapesGraph);
  }

  override toString(): string {
    return `NodeShape(node=${this.resource.identifier.value})`;
  }
}

export namespace RdfjsNodeShape {
  export class Constraints<
    NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> &
      ShapeT,
    OntologyT extends Ontology,
    PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
      ShapeT,
    ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
  > extends RdfjsShape.Constraints<
    NodeShapeT,
    OntologyT,
    PropertyShapeT,
    ShapeT
  > {
    get closed(): Maybe<boolean> {
      return this.resource
        .value(sh.closed)
        .chain((value) => value.toBoolean())
        .toMaybe();
    }

    get properties(): readonly PropertyShapeT[] {
      return [...this.resource.values(sh.property)].flatMap((value) =>
        value
          .toIdentifier()
          .toMaybe()
          .chain((shapeNode) =>
            this.shapesGraph.propertyShapeByIdentifier(shapeNode),
          )
          .toList(),
      );
    }
  }
}
