import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  override fromRdfExpression({
    resourceValueVariable,
  }: Type.FromRdfExpressionParameters): string {
    return `${resourceValueVariable}.toString()`;
  }
}
