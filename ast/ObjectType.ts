import { Property, Name } from ".";

export interface ObjectType {
  readonly kind: "Object";
  readonly properties: Property[]; // This is mutable to support cycle-handling logic in the transformer.
  readonly name: Name;
}
