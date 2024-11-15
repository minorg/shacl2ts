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

  override chainSparqlGraphPatternExpression(
    parameters: Parameters<Type["chainSparqlGraphPatternExpression"]>[0],
  ): ReturnType<Type["chainSparqlGraphPatternExpression"]> {
    return this.itemType.chainSparqlGraphPatternExpression(parameters);
  }

  override equalsFunction(): string {
    const itemTypeEqualsFunction = this.itemType.equalsFunction();
    if (itemTypeEqualsFunction === "purifyHelpers.Equatable.equals") {
      return "purifyHelpers.Equatable.arrayEquals";
    }
    return `(left, right) => purifyHelpers.Arrays.equals(left, right, ${itemTypeEqualsFunction})`;
  }

  override fromRdfResourceExpression({
    variables,
  }: Parameters<Type["fromRdfResourceExpression"]>[0]): string {
    return `purify.Either.of([...${variables.resource}.values(${variables.predicate}, { unique: true }).flatMap(resourceValue => (${this.itemType.fromRdfResourceValueExpression({ variables: { ...variables, resourceValue: "resourceValue" } })}).toMaybe().toList())])`;
  }

  override fromRdfResourceValueExpression(): string {
    throw new Error("not implemented");
  }

  override hashStatements({
    variables,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `for (const element of ${variables.value}) { ${this.itemType
        .hashStatements({
          variables: {
            hasher: variables.hasher,
            value: "element",
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
