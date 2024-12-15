import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";

export interface PropertyGroup {
  readonly identifier: BlankNode | NamedNode;
  readonly label: Maybe<Literal>;
}
