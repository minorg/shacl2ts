import type * as ast from "../../../ast";
import type { Type } from "./Type.js";

export class LiteralType implements Type {
  readonly kind = "Literal";

  equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  get externName(): string {
    return this.inlineName;
  }

  static fromAstType(_astType: ast.LiteralType): LiteralType {
    return new LiteralType();
  }

  get inlineName(): string {
    return "rdfjs.Literal";
  }
}
