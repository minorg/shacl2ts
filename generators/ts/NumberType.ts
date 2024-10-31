import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class NumberType extends PrimitiveType {
  override get name(): string {
    return "number";
  }

  override fromRdfExpression({
    resourceValueVariable,
  }: Type.FromRdfExpressionParameters): string {
    return `${resourceValueVariable}.toNumber()`;
  }
}
