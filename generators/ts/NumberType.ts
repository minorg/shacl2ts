import { PrimitiveType } from "./PrimitiveType.js";

export class NumberType extends PrimitiveType {
  override get name(): string {
    return "number";
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<PrimitiveType["fromRdfResourceValueExpression"]>[0]): string {
    return `${variables.resourceValue}.toNumber()`;
  }

  override hashStatements({
    variables,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toString());`];
  }
}
