import type * as ast from "../../../ast/index";
import { PrimitiveType } from "./PrimitiveType.js";

export class NumberType extends PrimitiveType {
  static override fromAstType(_astType: ast.LiteralType): NumberType {
    return new NumberType();
  }

  override get inlineName(): string {
    return "number";
  }
}
