import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type.js";

export abstract class PrimitiveType extends LiteralType {
  override get convertibleFromTypeNames(): readonly string[] {
    return [this.name()];
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get importStatements(): readonly string[] {
    return [];
  }

  override convertToExpression(_: { valueVariable: string }): Maybe<string> {
    return Maybe.empty();
  }

  override equalsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  override valueIsNotDefaultExpression({
    defaultValue,
    valueVariable,
  }: {
    defaultValue: BlankNode | Literal | NamedNode;
    valueVariable: string;
  }): string {
    return `${valueVariable} !== ${this.defaultValueExpression(defaultValue)}`;
  }
}
