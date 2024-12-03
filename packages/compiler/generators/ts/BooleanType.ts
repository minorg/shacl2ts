import { PrimitiveType } from "./PrimitiveType.js";

export class BooleanType extends PrimitiveType<boolean> {
  readonly kind = "BooleanType";

  override get name(): string {
    return "boolean";
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
