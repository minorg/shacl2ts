import type { Maybe } from "purify-ts";
import { shaclmate } from "../vocabularies/index.js";
import type { Shape } from "./Shape.js";

export function extern(this: Shape): Maybe<boolean> {
  return this.resource
    .value(shaclmate.extern)
    .chain((value) => value.toBoolean())
    .toMaybe();
}
