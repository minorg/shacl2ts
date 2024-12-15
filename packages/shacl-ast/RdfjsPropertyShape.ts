import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { sh } from "@tpluscode/rdf-ns-builders";
import type { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import { PropertyPath } from "./PropertyPath.js";
import type { PropertyShape } from "./PropertyShape.js";
import { RdfjsShape } from "./RdfjsShape.js";
import type { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export class RdfjsPropertyShape<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
> extends RdfjsShape<NodeShapeT, OntologyT, PropertyShapeT, ShapeT> {
  readonly constraints: RdfjsShape.Constraints<
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
    this.constraints = new RdfjsShape.Constraints(resource, shapesGraph);
  }

  get defaultValue(): Maybe<BlankNode | Literal | NamedNode> {
    return this.resource
      .value(sh.defaultValue)
      .map((value) => value.toTerm())
      .toMaybe();
  }

  get group(): Maybe<PropertyGroup> {
    return this.resource
      .value(sh.group)
      .chain((value) => value.toIri())
      .toMaybe()
      .chain((node) => this.shapesGraph.propertyGroupByIdentifier(node));
  }

  get order(): Maybe<number> {
    return this.resource
      .value(sh.maxCount)
      .chain((value) => value.toNumber())
      .toMaybe();
  }

  get path(): PropertyPath {
    return this.resource
      .value(sh.path)
      .chain((value) => value.toResource())
      .chain(PropertyPath.fromResource)
      .unsafeCoerce();
  }

  override toString(): string {
    const keyValues: string[] = [`node=${this.resource.identifier.value}`];
    const path = this.path;
    if (path.kind === "PredicatePath") {
      keyValues.push(`path=${path.iri.value}`);
    }
    return `PropertyShape(${keyValues.join(", ")})`;
  }
}
