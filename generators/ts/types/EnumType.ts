import type * as ast from "../../../ast";
import type { Type } from "./Type.js";

export class EnumType implements Type {
  equalsFunction(_leftValue: string, _rightValue: string): string {
    throw new Error("not implemented.");
  }

  readonly kind = "Enum";

  get externName(): string {
    throw new Error("not implemented");
  }

  static fromAstType(_astType: ast.EnumType): EnumType {
    throw new Error("not implemented");
  }

  get inlineName(): string {
    throw new Error("not implemented");
  }
}
