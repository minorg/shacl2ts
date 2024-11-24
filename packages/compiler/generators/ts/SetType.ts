import { Memoize } from "typescript-memoize";
import { Type } from "./Type.js";

export class SetType extends Type {
  readonly itemType: Type;
  readonly kind = "SetType";
  private readonly minCount: number;

  constructor({
    itemType,
    minCount,
    ...superParameters
  }: ConstructorParameters<typeof Type>[0] & {
    itemType: Type;
    minCount: number;
  }) {
    super(superParameters);
    this.itemType = itemType;
    this.minCount = minCount;
  }

  override get conversions(): readonly Type.Conversion[] {
    return [
      {
        conversionExpression: () => "[]",
        sourceTypeName: "undefined",
      },
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) => `Array.isArray(${value})`,
        sourceTypeName: this.name,
      },
    ];
  }

  @Memoize()
  get name(): string {
    return `readonly (${this.itemType.name})[]`;
  }

  override propertyChainSparqlGraphPatternExpression(
    parameters: Parameters<
      Type["propertyChainSparqlGraphPatternExpression"]
    >[0],
  ): ReturnType<Type["propertyChainSparqlGraphPatternExpression"]> {
    return this.itemType.propertyChainSparqlGraphPatternExpression(parameters);
  }

  override propertyEqualsFunction(): string {
    const itemTypeEqualsFunction = this.itemType.propertyEqualsFunction();
    if (itemTypeEqualsFunction === "purifyHelpers.Equatable.equals") {
      return "purifyHelpers.Equatable.arrayEquals";
    }
    return `(left, right) => purifyHelpers.Arrays.equals(left, right, ${itemTypeEqualsFunction})`;
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<Type["propertyFromRdfExpression"]>[0]): string {
    return `purify.Either.of([...${variables.resourceValues}.flatMap(_value => ${this.itemType.propertyFromRdfExpression({ variables: { ...variables, resourceValues: "_value.toValues()" } })}.toMaybe().toList())])`;
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [
      `for (const _element of ${variables.value}) { ${this.itemType
        .propertyHashStatements({
          variables: {
            hasher: variables.hasher,
            value: "_element",
          },
        })
        .join("\n")} }`,
    ];
  }

  override propertySparqlGraphPatternExpression(
    parameters: Parameters<Type["propertySparqlGraphPatternExpression"]>[0],
  ): Type.SparqlGraphPatternExpression | Type.SparqlGraphPatternsExpression {
    if (this.minCount === 0) {
      return new Type.SparqlGraphPatternExpression(
        `sparqlBuilder.GraphPattern.optional(${this.itemType.propertySparqlGraphPatternExpression(parameters).toSparqlGraphPatternExpression()})`,
      );
    }
    return this.itemType.propertySparqlGraphPatternExpression(parameters);
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<Type["propertyToRdfExpression"]>[0]): string {
    const itemTypeToRdfExpression = this.itemType.propertyToRdfExpression({
      variables: { ...variables, value: "_value" },
    });
    if (itemTypeToRdfExpression === "_value") {
      return variables.value;
    }
    return `${variables.value}.map((_value) => ${itemTypeToRdfExpression})`;
  }
}
