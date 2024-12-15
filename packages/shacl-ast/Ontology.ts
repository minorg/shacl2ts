import type { BlankNode, NamedNode } from "@rdfjs/types";

export interface Ontology {
  readonly identifier: BlankNode | NamedNode;
}
