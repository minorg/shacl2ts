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
  abstract override readonly kind:
    | "BooleanType"
    | "IdentifierType"
    | "LiteralType"
    | "NumberType"
    | "StringType";

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
    const chain: string[] = [`${variables.resourceValues}`];
    this.hasValue
      .ifJust((hasValue) => {
        chain.push(
          `find(_value => _value.toTerm().equals(${rdfjsTermExpression(hasValue, this.configuration)}))`,
        );
      })
      .ifNothing(() => chain.push("head()"));
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
