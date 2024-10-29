import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  override valueFromRdfExpression({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toString()`;
  }

  override valueInstanceOfExpression({
    propertyValueVariable,
  }: Type.ValueInstanceOfParameters): string {
    return `(typeof ${propertyValueVariable} === "string")`;
  }
}
