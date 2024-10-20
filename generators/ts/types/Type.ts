import type * as ast from "../../../ast";

export interface Type {
  /**
   * TypeScript type when the property is externed/not inlined.
   */
  readonly externName: string;
  /**
   * TypeScript type when the property is inlined.
   */
  readonly inlineName: string;
  readonly kind: ast.Type["kind"];

  equalsFunction(leftValue: string, rightValue: string): string;

  toRdf(kwds: { resourceSetVariable: string; value: string }): string;
}
