import type * as ast from "../../ast";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";

export class LiteralType extends RdfjsTermType {
  readonly kind = "Literal";

  get name(): string {
    return "rdfjs.Literal";
  }

  static fromAstType({
    astType,
    ...parameters
  }: { astType: ast.LiteralType } & Type.ConstructorParameters): LiteralType {
    return new LiteralType(parameters);
  }

  valueFromRdf({ resourceValueVariable }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toLiteral()`;
  }
}
