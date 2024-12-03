import type { Maybe } from "purify-ts";
import { shaclmate } from "../vocabularies/index.js";
import type { Shape } from "./Shape.js";

export function inline(this: Shape): Maybe<boolean> {
  return this.resource
    .value(shaclmate.inline)
    .chain((value) => value.toBoolean())
    .toMaybe();
}
