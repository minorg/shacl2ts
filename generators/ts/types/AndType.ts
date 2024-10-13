import type * as ast from "../../../ast";
import { ComposedType } from "./ComposedType.js";
import { createTypeFromAstType } from "./createTypeFromAstType.js";

export class AndType extends ComposedType {
  static fromAstType(astType: ast.AndType): AndType {
    return new AndType(astType.types.map(createTypeFromAstType));
  }

  protected readonly separator = "&";
}
