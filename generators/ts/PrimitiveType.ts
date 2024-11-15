import { Maybe } from "purify-ts";
import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type.js";

export abstract class PrimitiveType extends LiteralType {
  override get conversions(): readonly Type.Conversion[] {
    return this.defaultConversions;
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get importStatements(): readonly string[] {
    return [];
  }

  abstract override defaultValueExpression(): Maybe<string>;

  override equalsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  override toRdfExpression({
    variables,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    return variables.value;
  }
}
