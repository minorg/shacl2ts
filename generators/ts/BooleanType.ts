import { PrimitiveType } from "./PrimitiveType.js";

export class BooleanType extends PrimitiveType {
  override get name(): string {
    return "boolean";
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<PrimitiveType["fromRdfResourceValueExpression"]>[0]): string {
    return `${variables.resourceValue}.toBoolean()`;
  }

  override hashStatements({
    variables,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toString());`];
  }
}
