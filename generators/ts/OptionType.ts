import type { Maybe } from "purify-ts";
import { Memoize } from "typescript-memoize";
import { Type } from "./Type.js";

export class OptionType extends Type {
  readonly itemType: Type;
  readonly kind = "OptionType";

  constructor({
    itemType,
    ...superParameters
  }: ConstructorParameters<typeof Type>[0] & { itemType: Type }) {
    super(superParameters);
    this.itemType = itemType;
  }

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [];
    conversions.push({
      conversionExpression: (value) => value,
      sourceTypeCheckExpression: (value) => `purify.Maybe.isMaybe(${value})`,
      sourceTypeName: this.name,
    });
    for (const itemTypeConversion of this.itemType.conversions) {
      conversions.push({
        ...itemTypeConversion,
        conversionExpression: (value) =>
          `purify.Maybe.of(${itemTypeConversion.conversionExpression(value)})`,
      });
    }
    if (
      !conversions.some(
        (conversion) => conversion.sourceTypeName === "undefined",
      )
    ) {
      conversions.push({
        conversionExpression: () => "purify.Maybe.empty()",
        sourceTypeName: "undefined",
      });
    }
    return conversions;
  }

  @Memoize()
  get name(): string {
    return `purify.Maybe<${this.itemType.name}>`;
  }

  override chainSparqlGraphPatternExpression(
    parameters: Parameters<Type["chainSparqlGraphPatternExpression"]>[0],
  ): ReturnType<Type["chainSparqlGraphPatternExpression"]> {
    return this.itemType.chainSparqlGraphPatternExpression(parameters);
  }

  override defaultValueExpression(): Maybe<string> {
    return this.itemType
      .defaultValueExpression()
      .map(
        (defaultValueExpression) =>
          `purify.Maybe.of(${defaultValueExpression})`,
      );
  }

  override equalsFunction(): string {
    const itemTypeEqualsFunction = this.itemType.equalsFunction();
    if (itemTypeEqualsFunction === "purifyHelpers.Equatable.equals") {
      return "purifyHelpers.Equatable.maybeEquals";
    }
    if (itemTypeEqualsFunction === "purifyHelpers.Equatable.strictEquals") {
      return "purifyHelpers.Equatable.booleanEquals"; // Use Maybe.equals
    }
    return `(left, right) => purifyHelpers.Maybes.equals(left, right, ${itemTypeEqualsFunction})`;
  }

  override fromRdfResourceExpression(
    parameters: Parameters<Type["fromRdfResourceExpression"]>[0],
  ): string {
    return `purify.Either.of(${this.itemType.fromRdfResourceExpression(parameters)}.toMaybe())`;
  }

  override fromRdfResourceValueExpression(
    _: Parameters<Type["fromRdfResourceValueExpression"]>[0],
  ): string {
    throw new Error("not implemented");
  }

  override hashStatements({
    variables,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `${variables.value}.ifJust((value) => { ${this.itemType
        .hashStatements({
          variables: {
            hasher: variables.hasher,
            value: "value",
          },
        })
        .join("\n")} })`,
    ];
  }

  override propertySparqlGraphPatternExpression(
    parameters: Parameters<Type["propertySparqlGraphPatternExpression"]>[0],
  ): Type.SparqlGraphPatternExpression {
    return new Type.SparqlGraphPatternExpression(
      `sparqlBuilder.GraphPattern.optional(${this.itemType.propertySparqlGraphPatternExpression(parameters).toSparqlGraphPatternExpression()})`,
    );
  }

  override toRdfExpression({
    variables,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    const itemTypeToRdfExpression = this.itemType.toRdfExpression({
      variables: { ...variables, value: "value" },
    });
    if (itemTypeToRdfExpression === "value") {
      return variables.value;
    }
    return `${variables.value}.map((value) => ${itemTypeToRdfExpression})`;
  }
}
