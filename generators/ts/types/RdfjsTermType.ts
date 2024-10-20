import type { Type } from "./Type.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType implements Type {
  abstract readonly inlineName: string;
  abstract readonly kind: "Identifier" | "Literal";

  get externName(): string {
    return this.inlineName;
  }

  equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  toRdf({ value }: { value: string }): string {
    return value;
  }
}
