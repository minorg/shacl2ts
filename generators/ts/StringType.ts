import { PrimitiveType } from "./PrimitiveType.js";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<PrimitiveType["fromRdfResourceValueExpression"]>[0]): string {
    return `${variables.resourceValue}toString()`;
  }

  override hashStatements({
    variables,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value});`];
  }
}
