import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { fromRdf } from "rdf-literal";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class NumberType extends PrimitiveType {
  override get name(): string {
    return "number";
  }

  override defaultValueExpression(
    defaultValue: BlankNode | Literal | NamedNode,
  ): string {
    if (defaultValue.termType === "Literal") {
      try {
        const defaultValueExpression = fromRdf(defaultValue, true);
        if (typeof defaultValueExpression === "number") {
          return defaultValueExpression.toString();
        }
      } catch {}
    }
    return "0";
  }

  override fromRdfExpression({
    variables,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${variables.resourceValue}.toNumber()`;
  }

  override hashStatements({
    variables,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toString());`];
  }
}
