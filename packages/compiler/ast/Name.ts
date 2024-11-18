import type { BlankNode, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";

export interface Name {
  readonly curie: Maybe<string>;
  readonly identifier: BlankNode | NamedNode;
  readonly propertyPath: Maybe<{
    curie: Maybe<string>;
    identifier: NamedNode;
  }>;
  readonly shName: Maybe<string>;
  readonly shaclmateName: Maybe<string>;
}
