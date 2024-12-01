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
        conversionExpression: () => {
          let primitiveDefaultValue = fromRdf(defaultValue, true);
          if (typeof primitiveDefaultValue === "string") {
            primitiveDefaultValue = `"${primitiveDefaultValue}"`;
          }
          return primitiveDefaultValue;
        },
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

  override propertyEqualsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<LiteralType["propertyToRdfExpression"]>[0]): string {
    return this.defaultValue
      .map((defaultValue) => {
        let primitiveDefaultValue = fromRdf(defaultValue, true);
        switch (typeof primitiveDefaultValue) {
          case "boolean": {
            if (primitiveDefaultValue) {
              // If the default is true, only serialize the value if it's false
              return `!${variables.value} ? false : undefined`;
            }
            // If the default is false, only serialize the value if it's true
            return `${variables.value} ? true : undefined`;
          }
          case "string":
            primitiveDefaultValue = `"${primitiveDefaultValue}"`;
            break;
        }

        if (typeof primitiveDefaultValue === "string") {
        }
        return `${variables.value} !== ${primitiveDefaultValue} ? ${variables.value} : undefined`;
      })
      .orDefault(variables.value);
  }
}
