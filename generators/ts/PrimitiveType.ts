import type { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type.js";

export abstract class PrimitiveType extends LiteralType {
  override get convertibleFromTypeNames(): Set<string> {
    const typeNames = new Set<string>();
    if (this.defaultValue.isJust()) {
      typeNames.add("undefined");
    }
    return typeNames;
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get importStatements(): readonly string[] {
    return [];
  }

  override convertToExpression({
    variables,
  }: Parameters<Type["convertToExpression"]>[0]): Maybe<string> {
    return this.defaultValue
      .map(
        (defaultValue) =>
          `typeof ${variables.value} !== "undefined" ? ${variables.value} : ${this.defaultValueExpression(defaultValue)}`,
      )
      .alt(Maybe.of(variables.value));
  }

  override equalsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  override toRdfStatements({
    variables,
  }: Parameters<Type["toRdfStatements"]>[0]): readonly string[] {
    const statement = `${variables.resource}.add(${variables.predicate}, ${variables.value});`;
    return this.defaultValue
      .map((defaultValue) => [
        `if (${variables.value} !== ${this.defaultValueExpression(defaultValue)}) { ${statement} }`,
      ])
      .orDefault([statement]);
  }

  protected abstract defaultValueExpression(defaultValue: Literal): string;
}
