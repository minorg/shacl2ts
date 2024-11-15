import type { Maybe } from "purify-ts";
import { fromRdf } from "rdf-literal";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class StringType extends PrimitiveType {
  override get name(): string {
    return "string";
  }

  override defaultValueExpression(): Maybe<string> {
    return this.defaultValue.map((defaultValue) => {
      try {
        const defaultValueExpression = fromRdf(defaultValue, true);
        if (typeof defaultValueExpression === "string") {
          return JSON.stringify(defaultValueExpression);
        }
      } catch {}
      return '""';
    });
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<Type["fromRdfResourceValueExpression"]>[0]): string {
    return `${variables.resourceValue}.toString()`;
  }

  override hashStatements({
    variables,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value});`];
  }
}
