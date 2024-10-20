import type * as ast from "../../../ast";
import { RdfjsTermType } from "./RdfjsTermType.js";

export class LiteralType extends RdfjsTermType {
  readonly kind = "Literal";

  get inlineName(): string {
    return "rdfjs.Literal";
  }

  static fromAstType(_astType: ast.LiteralType): LiteralType {
    return new LiteralType();
  }
}
