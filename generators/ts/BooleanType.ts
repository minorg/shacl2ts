import type { Maybe } from "purify-ts";
import { fromRdf } from "rdf-literal";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class BooleanType extends PrimitiveType {
  override get name(): string {
    return "boolean";
  }

  override defaultValueExpression(): Maybe<string> {
    return this.defaultValue.map((defaultValue) => {
      try {
        const defaultValueExpression = fromRdf(defaultValue, true);
        if (typeof defaultValueExpression === "boolean") {
          return defaultValueExpression ? "true" : "false";
        }
      } catch {}
      return "false";
    });
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<Type["fromRdfResourceValueExpression"]>[0]): string {
    return `${variables.resourceValue}.toBoolean()`;
  }

  override hashStatements({
    variables,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toString());`];
  }
}
