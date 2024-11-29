import { RdfjsPropertyShape } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";
import type { NodeShape } from "./NodeShape";
import type { Shape } from "./Shape";
import { inline } from "./inline.js";
import { shaclmateName } from "./shaclmateName.js";

export class PropertyShape extends RdfjsPropertyShape<NodeShape, any, Shape> {
  get inline(): Maybe<boolean> {
    return inline.bind(this)();
  }

  get shaclmateName(): Maybe<string> {
    return shaclmateName.bind(this)();
  }
}
