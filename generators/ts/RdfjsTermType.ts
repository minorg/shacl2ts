import { Maybe } from "purify-ts";
import { Type } from "./Type.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType extends Type {
  abstract override readonly kind: "Identifier" | "Literal";

  override equalsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  override sparqlGraphPatternExpression(): Maybe<Type.SparqlGraphPatternExpression> {
    // Don't add any additional graph patterns for terms
    return Maybe.empty();
  }

  override toRdfExpression({
    propertyValueVariable,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    return propertyValueVariable;
  }
}
