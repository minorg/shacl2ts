import { LiteralType } from "./LiteralType.js";

export abstract class PrimitiveType extends LiteralType {
  override equalsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }
}
