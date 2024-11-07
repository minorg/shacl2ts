import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class BooleanType extends PrimitiveType {
  override get name(): string {
    return "boolean";
  }

  override fromRdfExpression({
    resourceValueVariable,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${resourceValueVariable}.toBoolean()`;
  }

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${hasherVariable}.update(${valueVariable}.toString());`];
  }
}
