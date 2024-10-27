import type * as ast from "../../ast";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  static override fromAstType({
    astType,
    ...parameters
  }: { astType: ast.LiteralType } & Type.ConstructorParameters): StringType {
    return new StringType(parameters);
  }

  override valueFromRdf({
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toString()`;
  }
}
