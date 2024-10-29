import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  override valueFromRdf({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toString()`;
  }

  override valueInstanceOf({
    propertyValueVariable,
  }: Type.ValueInstanceOfParameters): string {
    return `(typeof ${propertyValueVariable} === "string")`;
  }
}
