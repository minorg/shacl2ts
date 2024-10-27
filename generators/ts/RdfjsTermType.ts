import { Type } from "./Type.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType extends Type {
  abstract override readonly kind: "Identifier" | "Literal";

  equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  sparqlGraphPatterns(
    _parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[] {
    // Don't add any additional graph patterns for terms
    return [];
  }

  valueToRdf({ propertyValueVariable }: Type.ValueToRdfParameters): string {
    return propertyValueVariable;
  }
}
