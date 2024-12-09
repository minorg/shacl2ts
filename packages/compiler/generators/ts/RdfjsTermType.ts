import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import { Type } from "./Type.js";
import { rdfjsTermExpression } from "./rdfjsTermExpression.js";

/**
 * Abstract base class for IdentifierType and LiteralType.
 */
export abstract class RdfjsTermType<
  _RdfjsTermT extends BlankNode | Literal | NamedNode,
  ValueRdfjsTermT extends Literal | NamedNode,
> extends Type {
  readonly defaultValue: Maybe<ValueRdfjsTermT>;
  readonly hasValue: Maybe<ValueRdfjsTermT>;
  readonly in_: Maybe<readonly ValueRdfjsTermT[]>;
  abstract override readonly kind: "IdentifierType" | "LiteralType";

  constructor({
    defaultValue,
    hasValue,
    in_,
    ...superParameters
  }: {
    defaultValue: Maybe<ValueRdfjsTermT>;
    hasValue: Maybe<ValueRdfjsTermT>;
    in_: Maybe<readonly ValueRdfjsTermT[]>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.defaultValue = defaultValue;
    this.hasValue = hasValue;
    this.in_ = in_;
  }

  override propertyEqualsFunction(): string {
    return "purifyHelpers.Equatable.booleanEquals";
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<Type["propertyFromRdfExpression"]>[0]): string {
    const chain: string[] = [`${variables.resourceValues}.head()`];
    this.hasValue.ifJust((hasValue) => {
      const nestedChain = `chain(_term => _term.equals(${rdfjsTermExpression(hasValue, this.configuration)}) ? purify.Either.of(_value) : purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: _term, expectedValueType: "${hasValue.termType}", focusResource: ${variables.resource}, predicate: ${variables.predicate} })))`;
      switch (hasValue.termType) {
        case "Literal":
          chain.push(
            `chain<rdfjsResource.Resource.ValueError, rdfjsResource.Resource.Value>(_value => _value.toLiteral().${nestedChain})`,
          );
          break;
        case "NamedNode":
          chain.push(
            `chain<rdfjsResource.Resource.ValueError, rdfjsResource.Resource.Value>(_value => _value.toIri().${nestedChain})`,
          );
          break;
      }
    });
    this.defaultValue.ifJust((defaultValue) => {
      chain.push(
        `alt(purify.Either.of(new rdfjsResource.Resource.Value({ subject: ${variables.resource}, predicate: ${variables.predicate}, object: ${rdfjsTermExpression(defaultValue, this.configuration)} })))`,
      );
    });
    chain.push(
      `chain(_value => ${this.fromRdfResourceValueExpression({
        variables: {
          predicate: variables.predicate,
          resource: variables.resource,
          resourceValue: "_value",
        },
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
  }: {
    variables: { predicate: string; resource: string; resourceValue: string };
  }): string;
}
