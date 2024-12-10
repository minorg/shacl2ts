import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type.js";

export class DateTimeType extends PrimitiveType<Date> {
  readonly kind = "DateTimeType";

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) =>
          `typeof ${value} === "object" && ${value} instanceof Date`,
        sourceTypeName: this.name,
      },
    ];

    this.primitiveDefaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () => `new Date("${defaultValue.toISOString()}")`,
        sourceTypeCheckExpression: (value) => `typeof ${value} === "undefined"`,
        sourceTypeName: "undefined",
      });
    });

    return conversions;
  }

  override get name(): string {
    return "Date";
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<
    PrimitiveType<number>["fromRdfResourceValueExpression"]
  >[0]): string {
    let expression = `${variables.resourceValue}.toDate()`;
    this.primitiveIn.ifJust((in_) => {
      expression = `${expression}.chain(value => { ${in_.map((value) => `if (value.getTime() === ${value.getTime()}) { return purify.Either.of(value); }`).join(" ")} return purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: rdfLiteral.toRdf(value), expectedValueType: ${JSON.stringify(this.name)}, focusResource: ${variables.resource}, predicate: ${variables.predicate} })); })`;
    });
    return expression;
  }

  override propertyEqualsFunction(): string {
    return "(left, right) => purifyHelpers.Equatable.EqualsResult.fromBooleanEqualsResult(left, right, left.getTime() === right.getTime())";
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toISOString());`];
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<PrimitiveType<string>["propertyToRdfExpression"]>[0]): string {
    return this.primitiveDefaultValue
      .map(
        (defaultValue) =>
          `${variables.value}.getTime() !== ${defaultValue.getTime()} ? ${variables.value} : undefined`,
      )
      .orDefault(variables.value);
  }
}
