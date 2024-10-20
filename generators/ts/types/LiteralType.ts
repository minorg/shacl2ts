import type * as ast from "../../../ast";
import type { Type } from "./Type.js";

export class LiteralType implements Type {
  readonly kind = "Literal";

  get externName(): string {
    return this.inlineName;
  }

  get inlineName(): string {
    return "rdfjs.Literal";
  }

  static fromAstType(_astType: ast.LiteralType): LiteralType {
    return new LiteralType();
  }

  equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  toRdf({ value }: { value: string }): string {
    return value;
  }
}
