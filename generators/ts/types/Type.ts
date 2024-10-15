import type * as ast from "../../../ast";

export interface Type {
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
