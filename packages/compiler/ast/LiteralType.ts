import type { Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";

export interface LiteralType {
  readonly datatype: Maybe<NamedNode>;
  readonly defaultValue: Maybe<Literal>;
  readonly hasValue: Maybe<Literal>;
  readonly in_: Maybe<readonly Literal[]>;
  readonly kind: "LiteralType";
  readonly maxExclusive: Maybe<Literal>;
  readonly maxInclusive: Maybe<Literal>;
  readonly minExclusive: Maybe<Literal>;
  readonly minInclusive: Maybe<Literal>;
}
