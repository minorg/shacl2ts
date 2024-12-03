import { Memoize } from "typescript-memoize";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type.";

export class NumberType extends PrimitiveType<number> {
  readonly kind = "NumberType";

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) => `typeof ${value} === "number"`,
        sourceTypeName: this.name,
      },
    ];
    this.defaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () => defaultValue.toString(),
        sourceTypeCheckExpression: (value) => `typeof ${value} === "undefined"`,
        sourceTypeName: "undefined",
      });
    });
    return conversions;
  }

  @Memoize()
  override get name(): string {
    return this.in_
      .map((values) => values.map((value) => value.toString()).join(" | "))
      .orDefault("number");
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<
    PrimitiveType<number>["fromRdfResourceValueExpression"]
  >[0]): string {
    return `${variables.resourceValue}.toNumber()`;
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<PrimitiveType<string>["propertyToRdfExpression"]>[0]): string {
    return this.defaultValue
      .map(
        (defaultValue) =>
          `${variables.value} !== ${defaultValue} ? ${variables.value} : undefined`,
      )
      .orDefault(variables.value);
  }
}
