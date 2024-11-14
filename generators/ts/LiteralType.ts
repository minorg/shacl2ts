import type { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";
import { rdfjsTermExpression } from "./rdfjsTermExpression";

export class LiteralType extends RdfjsTermType<Literal> {
  readonly kind = "LiteralType";

  override get convertibleFromTypeNames(): Set<string> {
    const typeNames = new Set([
      this.name,
      "boolean",
      "Date",
      "number",
      "string",
    ]);
    if (this.defaultValue.isJust()) {
      typeNames.add("undefined");
    }
    return typeNames;
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
    let expression = `(typeof ${variables.value} === "object" && !(${variables.value} instanceof Date)) ? ${variables.value} : rdfLiteral.toRdf(${variables.value}, ${this.configuration.dataFactoryVariable})`;
    this.defaultValue.ifJust((defaultValue) => {
      expression = `typeof ${variables.value} !== "undefined" ? (${expression}) : ${rdfjsTermExpression(defaultValue, this.configuration)}`;
    });
    return Maybe.of(expression);
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
