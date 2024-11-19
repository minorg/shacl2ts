import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { dash, sh } from "@tpluscode/rdf-ns-builders";
import type { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { PropertyGroup } from "./PropertyGroup.js";
import { PropertyPath } from "./PropertyPath.js";
import { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export class PropertyShape extends Shape {
  readonly constraints: Shape.Constraints;

  constructor(
    resource: Resource,
    private readonly shapesGraph: ShapesGraph,
  ) {
    super(resource);
    this.constraints = new PropertyShape.Constraints(resource, shapesGraph);
  }

  get defaultValue(): Maybe<BlankNode | Literal | NamedNode> {
    return this.resource
      .value(sh.defaultValue)
      .map((value) => value.toTerm())
      .toMaybe();
  }

  get editor(): Maybe<NamedNode> {
    return this.resource
      .value(dash.editor)
      .chain((value) => value.toIri())
      .toMaybe();
  }

  get group(): Maybe<PropertyGroup> {
    return this.resource
      .value(sh.group)
      .chain((value) => value.toIri())
      .toMaybe()
      .chain((node) => this.shapesGraph.propertyGroupByNode(node));
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

  get singleLine(): Maybe<boolean> {
    return this.resource
      .value(dash.singleLine)
      .chain((value) => value.toBoolean())
      .toMaybe();
  }

  get viewer(): Maybe<NamedNode> {
    return this.resource
      .value(dash.viewer)
      .chain((value) => value.toIri())
      .toMaybe();
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
