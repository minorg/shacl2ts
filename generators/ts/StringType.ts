import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  override fromRdfExpression({
    resourceValueVariable,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${resourceValueVariable}.toString()`;
  }
}
