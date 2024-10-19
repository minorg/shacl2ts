import type * as ast from "../../../ast";

export interface Type {
  equalsFunction(leftValue: string, rightValue: string): string;

  /**
   * TypeScript type when the property is externed/not inlined.
   */
  readonly externName: string;

  readonly kind: ast.Type["kind"] | "Identifier";

  /**
   * TypeScript type when the property is inlined.
   */
  readonly inlineName: string;
}
