import type * as ast from "../../../ast";
import { ComposedType } from "./ComposedType";
import { createTypeFromAstType } from "./createTypeFromAstType";

export class OrType extends ComposedType {
  readonly kind = "Or";

  static fromAstType(astType: ast.OrType): OrType {
    return new OrType(astType.types.map(createTypeFromAstType));
  }

  protected readonly separator = "|";
}
