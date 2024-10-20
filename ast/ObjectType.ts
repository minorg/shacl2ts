import type { NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeKind } from "shacl-ast";
import type { Name, Property } from ".";

export interface ObjectType {
  readonly ancestorObjectTypes: ObjectType[]; // This is mutable to support cycle-handling logic in the transformer.
  readonly kind: "Object";
  readonly name: Name;
  readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
  readonly properties: Property[]; // This is mutable to support cycle-handling logic in the transformer.
  readonly rdfType: Maybe<NamedNode>;
  readonly superObjectTypes: ObjectType[]; // This is mutable to support cycle-handling logic in the transformer.
}
