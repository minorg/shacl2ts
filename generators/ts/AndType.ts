import type * as ast from "../../ast";
import { ComposedType } from "./ComposedType.js";
import type { Type } from "./Type.js";
import { createTypeFromAstType } from "./createTypeFromAstType.js";

export class AndType extends ComposedType {
  readonly kind = "And";
  protected readonly separator = "&";

  static fromAstType({
    astType,
    ...parameters
  }: { astType: ast.AndType } & Type.ConstructorParameters): AndType {
    return new AndType({
      types: astType.types.map((astType) =>
        createTypeFromAstType({ astType, ...parameters }),
      ),
      ...parameters,
    });
  }
}
