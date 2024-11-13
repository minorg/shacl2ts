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

  @Memoize()
  get name(): string {
    return `purify.Maybe<${this.itemType.name}>`;
  }

  override equalsFunction(): string {
    const itemTypeEqualsFunction = this.itemType.equalsFunction();
    if (itemTypeEqualsFunction === "purifyHelpers.Equatable.equals") {
      return "purifyHelpers.Equatable.maybeEquals";
    }
    if (itemTypeEqualsFunction === "purifyHelpers.Equatable.strictEquals") {
      return "(left, right) => left.equals(right)"; // Use Maybe.equals
    }
    return `(left, right) => purifyHelpers.Maybes.equals(left, right, ${itemTypeEqualsFunction})`;
  }

  override fromRdfExpression(
    parameters: Parameters<Type["fromRdfExpression"]>[0],
  ): string {}

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `${valueVariable}.ifJust((value) => { ${this.itemType
        .hashStatements({
          hasherVariable,
          valueVariable: "value",
        })
        .join("\n")} })`,
    ];
  }

  override sparqlGraphPatternExpression(parameters: {
    subjectVariable: string;
  }): Maybe<Type.SparqlGraphPatternExpression> {
    return this.itemType
      .sparqlGraphPatternExpression(parameters)
      .map((typeSparqlGraphPatternExpression) => {
        let value = typeSparqlGraphPatternExpression.value;
        if (typeSparqlGraphPatternExpression.type === "GraphPatterns") {
          value = `sparqlBuilder.GraphPattern.group(${value})`;
        }
        value = `sparqlBuilder.GraphPattern.optional(${value})`;
        return {
          type: "GraphPattern",
          value,
        };
      });
  }

  override toRdfStatements({
    valueVariable,
    ...otherParameters
  }: Parameters<Type["toRdfStatements"]>[0]): readonly string[] {
    return [
      `${valueVariable}.ifJust((value) => { ${this.itemType.toRdfStatements({ ...otherParameters, valueVariable: "value" }).join("\n")} });`,
    ];
  }
}
