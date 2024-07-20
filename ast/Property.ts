import { Type, TypeName } from ".";

export interface Property {
  readonly name: TypeName;
  readonly maxCount: number | null;
  readonly minCount: number | null;
  readonly type: Type;
}
