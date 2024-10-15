import type * as ast from "../../../ast/index";
import { LiteralType } from "./LiteralType.js";

export class NumberType extends LiteralType {
  static override fromAstType(_astType: ast.LiteralType): NumberType {
    return new NumberType();
  }

  override get inlineName(): string {
    return "number";
  }
}
