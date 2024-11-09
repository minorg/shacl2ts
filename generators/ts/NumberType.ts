import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { fromRdf } from "rdf-literal";
import { PrimitiveType } from "./PrimitiveType.js";
import type { Type } from "./Type";

export class NumberType extends PrimitiveType {
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
    resourceValueVariable,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${resourceValueVariable}.toNumber()`;
  }

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: Parameters<PrimitiveType["hashStatements"]>[0]): readonly string[] {
    return [`${hasherVariable}.update(${valueVariable}.toString());`];
  }

  override name(): string {
    return "number";
  }
}
