import { Property, Name } from ".";

export interface ObjectType {
  readonly kind: "Object";
  readonly properties: readonly Property[];
  readonly name: Name;
}
