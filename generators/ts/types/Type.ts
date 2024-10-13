export interface Type {
  /**
   * TypeScript type when the property is externed/not inlined.
   */
  readonly externName: string;

  /**
   * TypeScript type when the property is inlined.
   */
  readonly inlineName: string;
}
