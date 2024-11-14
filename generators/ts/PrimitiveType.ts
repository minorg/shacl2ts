import type { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type.js";

export abstract class PrimitiveType extends LiteralType {
  override get conversions(): readonly Type.Conversion[] {
    return this.defaultValue
      .map((defaultValue) => [
        {
          conversionExpression: () => this.defaultValueExpression(defaultValue),
          sourceTypeName: "undefined",
        },
      ])
      .orDefault([]);
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get importStatements(): readonly string[] {
    return [];
  }

  override equalsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  override toRdfExpression({
    variables,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    return this.defaultValue
      .map(
        (defaultValue) =>
          `(${variables.value} !== ${this.defaultValueExpression(defaultValue)}) ? ${variables.value} : undefined`,
      )
      .orDefault(variables.value);
  }

  protected abstract defaultValueExpression(defaultValue: Literal): string;
}
