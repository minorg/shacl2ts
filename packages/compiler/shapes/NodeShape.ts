import { RdfjsNodeShape } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import { inline } from "./inline.js";
import { shaclmateName } from "./shaclmateName.js";

export class NodeShape extends RdfjsNodeShape<any, PropertyShape, Shape> {
  get inline(): Maybe<boolean> {
    return inline.bind(this)();
  }

  get shaclmateName(): Maybe<string> {
    return shaclmateName.bind(this)();
  }
}
