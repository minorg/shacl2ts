import type * as ast from "../../../ast/index";
import { LiteralType } from "./LiteralType.js";

export class StringType extends LiteralType {
  static override fromAstType(_astType: ast.LiteralType): StringType {
    return new StringType();
  }

  override get inlineName(): string {
    return "string";
  }
}
