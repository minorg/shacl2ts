import { Property, TypeName } from ".";

export interface ObjectType {
  readonly kind: "Object";
  readonly properties: readonly Property[];
  readonly name: TypeName;
}
