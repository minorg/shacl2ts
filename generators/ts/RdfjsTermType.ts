import { Maybe } from "purify-ts";
import { Type } from "./Type.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType extends Type {
  abstract override readonly kind: "Identifier" | "Literal";

  equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  sparqlGraphPatternExpression(): Maybe<Type.SparqlGraphPatternExpression> {
    // Don't add any additional graph patterns for terms
    return Maybe.empty();
  }

  toRdfExpression({
    propertyValueVariable,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    return propertyValueVariable;
  }
}
