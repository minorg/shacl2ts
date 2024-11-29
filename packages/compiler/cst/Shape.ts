import type { Shape as IShape } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape";
import type { PropertyShape } from "./PropertyShape";

export interface Shape extends IShape<NodeShape, PropertyShape, any> {
  readonly inline: Maybe<boolean>;
  readonly resource: Resource;
  readonly shaclmateName: Maybe<string>;
}
