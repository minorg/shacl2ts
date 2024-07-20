import { BlankNode, NamedNode } from "@rdfjs/types";

export interface TypeName {
  readonly identifier: BlankNode | NamedNode;
  readonly shName: string | null;
  readonly tsName: string;
}
