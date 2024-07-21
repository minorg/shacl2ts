import { BlankNode, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";

export interface TypeName {
  readonly identifier: BlankNode | NamedNode;
  readonly shName: Maybe<string>;
  readonly tsName: string;
}
