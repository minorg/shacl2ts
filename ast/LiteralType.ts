import { Literal, NamedNode } from "@rdfjs/types";
import { Name } from ".";
import { Maybe } from "purify-ts";

export interface LiteralType {
  readonly datatype: Maybe<NamedNode>;
  readonly hasValue: Maybe<Literal>;
  readonly maxExclusive: Maybe<Literal>;
  readonly maxInclusive: Maybe<Literal>;
  readonly minExclusive: Maybe<Literal>;
  readonly minInclusive: Maybe<Literal>;
  readonly kind: "Literal";
  readonly name: Name;
}
