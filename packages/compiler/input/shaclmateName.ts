import type { Maybe } from "purify-ts";
import { shaclmate } from "../vocabularies/index.js";
import type { Shape } from "./Shape.js";

export function shaclmateName(this: Shape): Maybe<string> {
  return this.resource
    .value(shaclmate.name)
    .chain((value) => value.toString())
    .toMaybe();
}
