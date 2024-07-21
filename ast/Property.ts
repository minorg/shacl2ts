import { Maybe } from "purify-ts";
import { Type, TypeName } from ".";

export interface Property {
  readonly name: TypeName;
  readonly maxCount: Maybe<number>;
  readonly minCount: Maybe<number>;
  readonly type: Type;
}
