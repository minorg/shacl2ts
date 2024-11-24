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

  override propertyHashStatements({
    variables,
  }: Parameters<
    PrimitiveType["propertyHashStatements"]
  >[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toString());`];
  }
}
