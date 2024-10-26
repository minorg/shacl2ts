import type { Type } from "./Type.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType implements Type {
  abstract readonly kind: "Identifier" | "Literal";
  abstract readonly name: string;

  equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  sparqlGraphPatterns(
    _parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[] {
    // Don't add any additional graph patterns for terms
    return [];
  }

  abstract valueFromRdf(parameters: Type.ValueFromRdfParameters): string;

  valueToRdf({ propertyValueVariable }: Type.ValueToRdfParameters): string {
    return propertyValueVariable;
  }
}
