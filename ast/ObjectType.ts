import type { NodeKind } from "shacl-ast";
import type { Name, Property } from ".";

export interface ObjectType {
  readonly kind: "Object";
  readonly properties: Property[]; // This is mutable to support cycle-handling logic in the transformer.
  readonly name: Name;
  readonly nodeKind:
    | NodeKind.BLANK_NODE
    | NodeKind.BLANK_NODE_OR_IRI
    | NodeKind.IRI;
}
