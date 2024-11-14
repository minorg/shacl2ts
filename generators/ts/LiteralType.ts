import type { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";

export class LiteralType extends RdfjsTermType<Literal> {
  readonly kind = "LiteralType";

  override get convertibleFromTypeNames(): readonly string[] {
    return [this.name, "boolean", "Date", "number", "string"];
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.of({
      name: "termType",
      type: "string",
      values: ["Literal" satisfies Literal["termType"]],
    });
  }

  override get importStatements(): readonly string[] {
    return ["// @ts-ignore", 'import * as rdfLiteral from "rdf-literal";'];
  }

  get name(): string {
    return "rdfjs.Literal";
  }

  override convertToExpression({
    variables,
  }: Parameters<Type["convertToExpression"]>[0]): Maybe<string> {
    return Maybe.of(
      `(typeof ${variables.value} === "object" && !(${variables.value} instanceof Date)) ? ${variables.value} : rdfLiteral.toRdf(${variables.value}, ${this.configuration.dataFactoryVariable})`,
    );
  }

  override fromRdfExpression({
    variables,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${variables.resourceValue}.toLiteral()`;
  }

  override hashStatements({
    variables,
  }: Parameters<
    RdfjsTermType<Literal>["hashStatements"]
  >[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.value);`];
  }
}
