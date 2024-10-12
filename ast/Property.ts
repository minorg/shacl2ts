import type { Maybe } from "purify-ts";
import type { PredicatePath } from "shacl-ast";
import type { Name, Type } from ".";

export interface Property {
  readonly inline: boolean;
  readonly name: Name;
  readonly maxCount: Maybe<number>;
  readonly minCount: Maybe<number>;
  readonly path: PredicatePath;
  readonly type: Type;
}
