import type { Type } from "./Type.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType implements Type {
  abstract readonly kind: "Identifier" | "Literal";

  equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  abstract name(_: Type.NameType): string;

  valueToRdf({ value }: Type.ValueToRdfParameters): string {
    return value;
  }
}
