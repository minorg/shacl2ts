import type * as ast from "../../../ast";
import type { Type } from "./Type.js";

export class EnumType implements Type {
  readonly kind = "Enum";

  static fromAstType(_astType: ast.EnumType): EnumType {
    throw new Error("not implemented");
  }

  equalsFunction(_leftValue: string, _rightValue: string): string {
    throw new Error("not implemented.");
  }

  name(_: Type.NameType): string {
    throw new Error("not implemented");
  }

  valueToRdf(_: Type.ValueToRdfParameters): string {
    throw new Error("not implemented");
  }
}
