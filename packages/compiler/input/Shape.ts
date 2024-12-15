import type { Shape as IShape } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";

export interface Shape
  extends IShape<NodeShape, Ontology, PropertyGroup, PropertyShape, any> {
  readonly extern: Maybe<boolean>;
  readonly resource: Resource;
  readonly shaclmateName: Maybe<string>;
}
