import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class NumberType extends PrimitiveType {
  override get name(): string {
    return "number";
  }

  override valueFromRdf({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toNumber()`;
  }
}
