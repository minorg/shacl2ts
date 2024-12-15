import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";

export interface RdfjsTermType<
  _RdfjsTermT extends BlankNode | Literal | NamedNode,
  ValueRdfjsTermT extends Literal | NamedNode,
> {
  readonly defaultValue: Maybe<ValueRdfjsTermT>;
  readonly hasValue: Maybe<ValueRdfjsTermT>;
  readonly in_: Maybe<readonly ValueRdfjsTermT[]>;
  readonly kind: "IdentifierType" | "LiteralType";
}
