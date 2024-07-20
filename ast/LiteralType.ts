import { NamedNode } from "@rdfjs/types";
import { TypeName } from ".";

export interface LiteralType {
  readonly datatype: NamedNode;
  readonly kind: "Literal";
  readonly name: TypeName;
}
