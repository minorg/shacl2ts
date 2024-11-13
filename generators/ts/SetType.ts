import type { NamedNode } from "@rdfjs/types";
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

  override fromRdfExpression(parameters: {
    propertyPath: NamedNode;
    resourceValueVariable: string;
    resourceVariable: string;
  }): string {
    throw new Error("Method not implemented.");
  }

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: {
    hasherVariable: string;
    valueVariable: string;
  }): readonly string[] {
    return [
      `for (const element of ${valueVariable}) { ${this.itemType
        .hashStatements({
          hasherVariable,
          valueVariable: "element",
        })
        .join("\n")} }`,
    ];
  }

  override sparqlGraphPatternExpression(parameters: {
    subjectVariable: string;
  }): Maybe<Type.SparqlGraphPatternExpression> {
    return this.itemType.sparqlGraphPatternExpression(parameters);
  }

  override toRdfStatements({
    valueVariable,
    ...otherParameters
  }: Parameters<Type["toRdfStatements"]>[0]): readonly string[] {
    return [
      `${valueVariable}.forEach((value) => { ${this.itemType.toRdfStatements({ ...otherParameters, valueVariable: "value" }).join("\n")} });`,
    ];
  }
}
