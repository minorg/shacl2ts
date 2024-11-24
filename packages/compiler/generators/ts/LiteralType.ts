import type { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";
import { rdfjsTermExpression } from "./rdfjsTermExpression";

export class LiteralType extends RdfjsTermType<Literal> {
  readonly kind = "LiteralType";

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [];

    conversions.push({
      conversionExpression: (value) => `rdfLiteral.toRdf(${value})`,
      sourceTypeName: "boolean",
    });

    conversions.push({
      conversionExpression: (value) => `rdfLiteral.toRdf(${value})`,
      sourceTypeCheckExpression: (value) =>
        `typeof ${value} === "object" && ${value} instanceof Date`,
      sourceTypeName: "Date",
    });

    conversions.push({
      conversionExpression: (value) => `rdfLiteral.toRdf(${value})`,
      sourceTypeName: "number",
    });

    conversions.push({
      conversionExpression: (value) =>
        `${this.configuration.dataFactoryVariable}.literal(${value})`,
      sourceTypeName: "string",
    });

    this.defaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () =>
          rdfjsTermExpression(defaultValue, this.configuration),
        sourceTypeName: "undefined",
      });
    });

    conversions.push({
      conversionExpression: (value) => value,
      sourceTypeCheckExpression: (value) => `typeof ${value} === "object"`,
      sourceTypeName: this.name,
    });

    return conversions;
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

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<
    RdfjsTermType<Literal>["fromRdfResourceValueExpression"]
  >[0]): string {
    return `${variables.resourceValue}.toLiteral()`;
  }

  override propertyHashStatements({
    variables,
  }: Parameters<
    RdfjsTermType<Literal>["propertyHashStatements"]
  >[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.value);`];
  }
}
