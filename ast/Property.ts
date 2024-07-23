import { Maybe } from "purify-ts";
import { Type, Name } from ".";
import { PredicatePath } from "shacl-ast";

export interface Property {
  readonly name: Name;
  readonly maxCount: Maybe<number>;
  readonly minCount: Maybe<number>;
  readonly path: PredicatePath;
  readonly type: Type;
}
