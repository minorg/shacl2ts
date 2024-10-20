import type * as ast from "../../../ast";
import { RdfjsTermType } from "./RdfjsTermType.js";

export class LiteralType extends RdfjsTermType {
  readonly kind = "Literal";

  static fromAstType(_astType: ast.LiteralType): LiteralType {
    return new LiteralType();
  }

  name(): string {
    return "rdfjs.Literal";
  }
}
