import type * as ast from "../../../ast/index";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class NumberType extends PrimitiveType {
  override get name(): string {
    return "number";
  }

  static override fromAstType(_astType: ast.LiteralType): NumberType {
    return new NumberType();
  }

  override valueFromRdf({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toNumber()`;
  }
}
