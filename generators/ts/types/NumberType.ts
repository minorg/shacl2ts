import type * as ast from "../../../ast/index";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class NumberType extends PrimitiveType {
  static override fromAstType(_astType: ast.LiteralType): NumberType {
    return new NumberType();
  }

  override name(): string {
    return "number";
  }

  override valueFromRdf({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toNumber()`;
  }
}
