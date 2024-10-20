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

  valueToRdf(parameters: Type.ValueToRdfParameters): string;
}

export namespace Type {
  export interface ValueToRdfParameters {
    mutateGraphVariable: string;
    resourceSetVariable: string;
    value: string;
  }
}
