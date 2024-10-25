import type * as ast from "../../../ast";

export interface Type {
  readonly kind: ast.Type["kind"];

  equalsFunction(leftValue: string, rightValue: string): string;
  name(type: Type.NameType): string;
  sparqlGraphPatterns(
    parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[];
  valueFromRdf(parameters: Type.ValueFromRdfParameters): string;
  valueToRdf(parameters: Type.ValueToRdfParameters): string;
}

export namespace Type {
  export type NameType = "extern" | "inline";

  export interface SparqlGraphPatternParameters {
    dataFactoryVariable: string;
    inline: boolean;
    subjectVariable: string;
  }

  export interface ValueFromRdfParameters {
    dataFactoryVariable: string;
    inline: boolean;
    resourceValueVariable: string;
  }

  export interface ValueToRdfParameters {
    inline: boolean;
    mutateGraphVariable: string;
    propertyValueVariable: string;
    resourceSetVariable: string;
  }
}
