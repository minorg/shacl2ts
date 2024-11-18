import type { ObjectType } from "./ObjectType.js";

export interface Ast {
  readonly objectTypes: readonly ObjectType[];
}
