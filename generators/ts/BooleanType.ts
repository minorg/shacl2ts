import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { fromRdf } from "rdf-literal";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class BooleanType extends PrimitiveType {
  override defaultValueExpression(
    defaultValue: BlankNode | Literal | NamedNode,
  ): string {
    if (defaultValue.termType === "Literal") {
      try {
        const defaultValueExpression = fromRdf(defaultValue, true);
        if (typeof defaultValueExpression === "boolean") {
          return defaultValueExpression ? "true" : "false";
        }
      } catch {}
    }
    return "false";
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

  override name(): string {
    return "boolean";
  }

  override valueIsNotDefaultExpression({
    defaultValue,
    valueVariable,
  }: {
    defaultValue: BlankNode | Literal | NamedNode;
    valueVariable: string;
  }): string {
    return this.defaultValueExpression(defaultValue) === "true"
      ? `!${valueVariable}`
      : `${valueVariable}`;
  }
}
