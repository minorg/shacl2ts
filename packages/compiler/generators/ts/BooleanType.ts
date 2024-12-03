import { Memoize } from "typescript-memoize";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type.js";

export class BooleanType extends PrimitiveType<boolean> {
  readonly kind = "BooleanType";

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) => `typeof ${value} === "boolean"`,
        sourceTypeName: this.name,
      },
    ];
    this.defaultValue
      .ifJust((defaultValue) => {
        conversions.push({
          conversionExpression: () => defaultValue.toString(),
          sourceTypeCheckExpression: (value) =>
            `typeof ${value} === "undefined"`,
          sourceTypeName: "undefined",
        });
      })
      .ifNothing(() => {
        conversions.push({
          conversionExpression: () => "false",
          sourceTypeCheckExpression: (value) =>
            `typeof ${value} === "undefined"`,
          sourceTypeName: "undefined",
        });
      });
    return conversions;
  }

  @Memoize()
  override get name(): string {
    return this.in_
      .map((values) => values.map((value) => value.toString()).join(" | "))
      .orDefault("boolean");
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<
    PrimitiveType<boolean>["fromRdfResourceValueExpression"]
  >[0]): string {
    return `${variables.resourceValue}.toBoolean()`;
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<PrimitiveType<string>["propertyToRdfExpression"]>[0]): string {
    return this.defaultValue
      .map((defaultValue) => {
        if (defaultValue) {
          // If the default is true, only serialize the value if it's false
          return `!${variables.value} ? false : undefined`;
        }
        // If the default is false, only serialize the value if it's true
        return `${variables.value} ? true : undefined`;
      })
      .orDefault(variables.value);
  }
}
