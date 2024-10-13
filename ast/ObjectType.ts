import type { NodeKind } from "shacl-ast";
import type { Name, Property } from ".";

export interface ObjectType {
  readonly kind: "Object";
  readonly properties: Property[]; // This is mutable to support cycle-handling logic in the transformer.
  readonly name: Name;
  readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
}
