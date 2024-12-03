import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type.js";

export class StringType extends PrimitiveType<string> {
  readonly kind = "StringType";

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeName: this.name,
      },
    ];
    this.defaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () => `"${defaultValue}"`,
        sourceTypeName: "undefined",
      });
    });
    return conversions;
  }

  override get name(): string {
    return "string";
  }

  fromRdfResourceValueExpression({
    variables,
  }: Parameters<
    PrimitiveType<string>["fromRdfResourceValueExpression"]
  >[0]): string {
    return `${variables.resourceValue}.toString()`;
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value});`];
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<PrimitiveType<string>["propertyToRdfExpression"]>[0]): string {
    return this.defaultValue
      .map(
        (defaultValue) =>
          `${variables.value} !== "${defaultValue}" ? ${variables.value} : undefined`,
      )
      .orDefault(variables.value);
  }
}
