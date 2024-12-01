import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import { Type } from "./Type.js";
import { rdfjsTermExpression } from "./rdfjsTermExpression.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType<
  RdfjsTermT extends BlankNode | Literal | NamedNode,
> extends Type {
  readonly defaultValue: Maybe<RdfjsTermT>;
  readonly hasValue: Maybe<RdfjsTermT>;
  abstract override readonly kind: "IdentifierType" | "LiteralType";

  constructor({
    defaultValue,
    hasValue,
    ...superParameters
  }: {
    defaultValue: Maybe<RdfjsTermT>;
    hasValue: Maybe<RdfjsTermT>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.defaultValue = defaultValue;
    this.hasValue = hasValue;
  }

  override propertyEqualsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<Type["propertyFromRdfExpression"]>[0]): string {
    const chain: string[] = [`${variables.resourceValues}.head()`];
    this.hasValue.ifJust((hasValue) => {
      chain.push(
        `chain<rdfjsResource.Resource.ValueError, ${this.name}>(_identifier => _identifier.equals(${rdfjsTermExpression(hasValue, this.configuration)}) ? purify.Either.of(_identifier) : purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: _identifier, expectedValueType: "${hasValue.termType}", focusResource: ${variables.resource}, predicate: ${variables.predicate})))`,
      );
    });
    this.defaultValue.ifJust((defaultValue) => {
      chain.push(
        `alt(purify.Either.of(new rdfjsResource.Resource.Value({ subject: ${variables.resource}, predicate: ${variables.predicate}, object: ${rdfjsTermExpression(defaultValue, this.configuration)} })))`,
      );
    });
    chain.push(
      `chain(_value => ${this.fromRdfResourceValueExpression({
        variables: { resourceValue: "_value" },
      })})`,
    );
    return chain.join(".");
  }

  override propertySparqlGraphPatternExpression({
    variables,
  }: Parameters<
    Type["propertySparqlGraphPatternExpression"]
  >[0]): Type.SparqlGraphPatternExpression {
    let expression = super
      .propertySparqlGraphPatternExpression({
        variables,
      })
      .toSparqlGraphPatternExpression()
      .toString();
    if (this.defaultValue.isJust()) {
      expression = `sparqlBuilder.GraphPattern.optional(${expression})`;
    }
    return new Type.SparqlGraphPatternExpression(expression);
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<Type["propertyToRdfExpression"]>[0]): string {
    return this.defaultValue
      .map(
        (defaultValue) =>
          `!${variables.value}.equals(${rdfjsTermExpression(defaultValue, this.configuration)}) ? ${variables.value} : undefined`,
      )
      .orDefault(variables.value);
  }

  protected abstract fromRdfResourceValueExpression({
    variables,
  }: { variables: { resourceValue: string } }): string;
}
