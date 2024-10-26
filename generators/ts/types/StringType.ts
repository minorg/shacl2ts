import type * as ast from "../../../ast/index";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  static override fromAstType(_astType: ast.LiteralType): StringType {
    return new StringType();
  }

  override valueFromRdf({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toString()`;
  }
}
