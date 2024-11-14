import type { Maybe } from "purify-ts";
import { Memoize } from "typescript-memoize";
import { Type } from "./Type.js";

export class SetType extends Type {
  readonly itemType: Type;
  readonly kind = "SetType";

  constructor({
    itemType,
    ...superParameters
  }: ConstructorParameters<typeof Type>[0] & { itemType: Type }) {
    super(superParameters);
    this.itemType = itemType;
  }

  override get conversions(): readonly Type.Conversion[] {
    return [
      {
        conversionExpression: () => "[]",
        sourceTypeName: "undefined",
      },
    ];
  }

  @Memoize()
  get name(): string {
    return `readonly (${this.itemType.name})[]`;
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
    return `purify.Either.of([...${variables.resource}.values(${variables.predicate}, { unique: true }).flatMap(resourceValue => (${this.itemType.fromRdfResourceValueExpression({ variables: { ...variables, resourceValue: "resourceValue" } })}}).toMaybe().toList())])`;
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

  override sparqlGraphPatternExpression(
    parameters: Parameters<Type["sparqlGraphPatternExpression"]>[0],
  ): Maybe<
    Type.SparqlGraphPatternExpression | Type.SparqlGraphPatternsExpression
  > {
    return this.itemType.sparqlGraphPatternExpression(parameters);
  }

  override toRdfExpression({
    variables,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    return `${variables.value}.map((value) => ${this.itemType.toRdfExpression({ variables: { ...variables, value: "value" } })}`;
  }
}
