import type { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";

export class LiteralType extends RdfjsTermType {
  readonly kind = "Literal";

  override get convertibleFromTypeNames(): readonly string[] {
    return [this.name(), "boolean", "Date", "number", "string"];
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.of({
      name: "termType",
      type: "string",
      values: ["Literal" satisfies Literal["termType"]],
    });
  }

  override get importStatements(): readonly string[] {
    return ['import * as rdfLiteral from "rdf-literal";'];
  }

  override convertToExpression({
    valueVariable,
  }: { valueVariable: string }): Maybe<string> {
    return Maybe.of(
      `(typeof ${valueVariable} === "object" && !(${valueVariable} instanceof Date)) ? ${valueVariable} : rdfLiteral.toRdf(${valueVariable}, ${this.configuration.dataFactoryVariable})`,
    );
  }

  override fromRdfExpression({
    resourceValueVariable,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${resourceValueVariable}.toLiteral()`;
  }

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: Parameters<RdfjsTermType["hashStatements"]>[0]): readonly string[] {
    return [`${hasherVariable}.update(${valueVariable}.value);`];
  }

  name(): string {
    return "rdfjs.Literal";
  }
}
