import { Maybe } from "purify-ts";
import { Type, Name } from ".";
import { NamedNode } from "@rdfjs/types";

export interface Property {
  readonly name: Name;
  readonly maxCount: Maybe<number>;
  readonly minCount: Maybe<number>;
  readonly path: NamedNode;
  readonly type: Type;
}
