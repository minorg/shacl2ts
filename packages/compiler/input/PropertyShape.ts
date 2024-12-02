import { RdfjsPropertyShape } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";
import type { NodeShape } from "./NodeShape.js";
import type { Shape } from "./Shape.js";
import { inline } from "./inline.js";
import { shaclmateName } from "./shaclmateName.js";

export class PropertyShape
  extends RdfjsPropertyShape<NodeShape, any, Shape>
  implements Shape
{
  get inline(): Maybe<boolean> {
    return inline.bind(this)();
  }

  get shaclmateName(): Maybe<string> {
    return shaclmateName.bind(this)();
  }
}
