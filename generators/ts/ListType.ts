import { Maybe } from "purify-ts";
import type { RdfjsTermType } from "./RdfjsTermType.js";
import { Type } from "./Type.js";

export class ListType extends Type {
  readonly itemType: Type;
  readonly kind = "List";

  constructor({
    itemType,
    ...superParameters
  }: {
    itemType: Type;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.itemType = itemType;
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get name(): string {
    return `readonly ${this.itemType.name}[]`;
  }

  override equalsFunction(): string {
    return `(left, right) => purifyHelpers.Arrays.equals(left, right, ${this.itemType.equalsFunction()})`;
  }

  override fromRdfExpression({
    resourceValueVariable,
    ...otherParameters
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${resourceValueVariable}.toList().map(values => values.flatMap(value => ${this.itemType.fromRdfExpression({ resourceValueVariable: "value", ...otherParameters })}.toMaybe().toList()))`;
  }

  override hashStatements({
    hasherVariable,
    propertyValueVariable,
  }: Parameters<RdfjsTermType["hashStatements"]>[0]): readonly string[] {
    return [
      `for (const _element of ${propertyValueVariable}) { ${this.itemType.hashStatements({ hasherVariable, propertyValueVariable: "_element" }).join("\n")} }`,
    ];
  }

  override sparqlGraphPatternExpression(_: {
    subjectVariable: string;
  }): Maybe<Type.SparqlGraphPatternExpression> {
    return Maybe.empty();
  }

  override toRdfExpression(_: {
    mutateGraphVariable: string;
    propertyValueVariable: string;
    resourceSetVariable: string;
  }): string {
    return "";
  }
}
