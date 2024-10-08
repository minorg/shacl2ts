import type { BlankNode, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";

export interface Name {
  readonly curie: Maybe<string>;
  readonly identifier: BlankNode | NamedNode;
  readonly shName: Maybe<string>;
  readonly shacl2tsName: Maybe<string>;
  readonly tsName: string;
}
