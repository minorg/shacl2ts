import { Type } from ".";

export interface UnionType {
  readonly kind: "Union";
  readonly types: readonly Type[];
}
