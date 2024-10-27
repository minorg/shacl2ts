import type * as ast from "../../ast";
import { ComposedType } from "./ComposedType";
import type { Type } from "./Type";
import { createTypeFromAstType } from "./createTypeFromAstType";

export class OrType extends ComposedType {
  readonly kind = "Or";
  protected readonly separator = "|";

  static fromAstType({
    astType,
    ...parameters
  }: { astType: ast.OrType } & Type.ConstructorParameters): OrType {
    return new OrType({
      types: astType.types.map((astType) =>
        createTypeFromAstType({ astType, ...parameters }),
      ),
      ...parameters,
    });
  }
}
