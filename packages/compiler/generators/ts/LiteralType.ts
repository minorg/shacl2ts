import type { Literal } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type.js";

export class LiteralType extends RdfjsTermType<Literal, Literal> {
  readonly kind:
    | "BooleanType"
    | "DateTimeType"
    | "LiteralType"
    | "NumberType"
    | "StringType" = "LiteralType";

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [];

    conversions.push({
      conversionExpression: (value) => `rdfLiteral.toRdf(${value})`,
      sourceTypeCheckExpression: (value) => `typeof ${value} === "boolean"`,
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
      sourceTypeCheckExpression: (value) => `typeof ${value} === "number"`,
      sourceTypeName: "number",
    });

    conversions.push({
      conversionExpression: (value) =>
        `${this.dataFactoryVariable}.literal(${value})`,
      sourceTypeCheckExpression: (value) => `typeof ${value} === "string"`,
      sourceTypeName: "string",
    });

    this.defaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () => this.rdfjsTermExpression(defaultValue),
        sourceTypeCheckExpression: (value) => `typeof ${value} === "undefined"`,
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
    RdfjsTermType<Literal, Literal>["fromRdfResourceValueExpression"]
  >[0]): string {
    return `${variables.resourceValue}.toLiteral()`;
  }

  override propertyHashStatements({
    variables,
  }: Parameters<
    RdfjsTermType<Literal, Literal>["propertyHashStatements"]
  >[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.value);`];
  }
}
