import type * as ast from "../../ast";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class NumberType extends PrimitiveType {
  override get name(): string {
    return "number";
  }

  static override fromAstType({
    astType,
    ...parameters
  }: { astType: ast.LiteralType } & Type.ConstructorParameters): NumberType {
    return new NumberType(parameters);
  }

  override valueFromRdf({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toNumber()`;
  }
}
