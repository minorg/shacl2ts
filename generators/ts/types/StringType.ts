import type * as ast from "../../../ast/index";
import { PrimitiveType } from "./PrimitiveType.js";

export class StringType extends PrimitiveType {
  static override fromAstType(_astType: ast.LiteralType): StringType {
    return new StringType();
  }

  override get inlineName(): string {
    return "string";
  }
}
