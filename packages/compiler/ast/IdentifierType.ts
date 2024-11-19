import type { BlankNode, NamedNode } from "@rdfjs/types";
import type { NodeKind } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";

/**
 * A type corresponding to sh:nodeKind of a blank node or IRI, and not corresponding to a node shape.
 */
export interface IdentifierType {
  readonly defaultValue: Maybe<BlankNode | NamedNode>;
  readonly hasValue: Maybe<BlankNode | NamedNode>;
  readonly kind: "IdentifierType";
  readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
}
