import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type";

export abstract class PrimitiveType extends LiteralType {
  override equalsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  abstract override valueInstanceOf(
    parameters: Type.ValueInstanceOfParameters,
  ): string;
}
