import type { NamedNode } from "@rdfjs/types";
import type { NodeKind } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";

/**
 * A type corresponding to sh:nodeKind of a blank node or IRI, and not corresponding to a node shape.
 */
export interface IdentifierType {
  readonly defaultValue: Maybe<NamedNode>;
  readonly hasValue: Maybe<NamedNode>;
  readonly in_: Maybe<readonly NamedNode[]>;
  readonly kind: "IdentifierType";
  readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
}
