import { NamedNode } from "@rdfjs/types";
import { Name } from ".";

export interface LiteralType {
  readonly datatype: NamedNode;
  readonly kind: "Literal";
  readonly name: Name;
}
