import { PrimitiveType } from "./PrimitiveType.js";

export class NumberType extends PrimitiveType<number> {
  readonly kind = "NumberType";

  override get name(): string {
    return "number";
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
