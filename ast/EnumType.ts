import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";

export interface EnumType {
  readonly kind: "Enum";
  readonly members: readonly (BlankNode | Literal | NamedNode)[];
}
