import { Memoize } from "typescript-memoize";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type.js";

export class StringType extends PrimitiveType<string> {
  readonly kind = "StringType";

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) => `typeof ${value} === "string"`,
        sourceTypeName: this.name,
      },
    ];
    this.defaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () => `"${defaultValue}"`,
        sourceTypeCheckExpression: (value) => `typeof ${value} === "undefined"`,
        sourceTypeName: "undefined",
      });
    });
    return conversions;
  }

  @Memoize()
  override get name(): string {
    return this.in_
      .map((values) => values.map((value) => `"${value}"`).join(" | "))
      .orDefault("string");
  }

  fromRdfResourceValueExpression({
    variables,
  }: Parameters<
    PrimitiveType<string>["fromRdfResourceValueExpression"]
  >[0]): string {
    let expression = `${variables.resourceValue}.toString()`;
    this.in_.ifJust((in_) => {
      expression = `${expression}.chain(value => { switch (value) { ${in_.map((value) => `case "${value}":`).join(" ")} return purify.Either.of(value); default: return purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: rdfLiteral.toRdf(value), expectedValueType: ${JSON.stringify(this.name)}, focusResource: ${variables.resource}, predicate: ${variables.predicate} })); } })`;
    });
    return expression;
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
