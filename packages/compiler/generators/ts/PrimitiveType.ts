import { Maybe } from "purify-ts";
import { fromRdf } from "rdf-literal";
import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type.js";

export abstract class PrimitiveType extends LiteralType {
  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeName: this.name,
      },
    ];
    this.defaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () => fromRdf(defaultValue, true),
        sourceTypeName: "undefined",
      });
    });
    return conversions;
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
  }: Parameters<LiteralType["toRdfExpression"]>[0]): string {
    return this.defaultValue
      .map((defaultValue) => {
        let primitiveDefaultValue = fromRdf(defaultValue, true);
        if (typeof primitiveDefaultValue === "string") {
          primitiveDefaultValue = `"${primitiveDefaultValue}"`;
        }
        return `${variables.value} !== ${primitiveDefaultValue} ? ${variables.value} : undefined`;
      })
      .orDefault(variables.value);
  }
}
