import type * as ast from "../../../ast";

export interface Type {
  readonly kind: ast.Type["kind"];
  readonly name: string;

  equalsFunction(leftValue: string, rightValue: string): string;
  sparqlGraphPatterns(
    parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[];
  valueFromRdf(parameters: Type.ValueFromRdfParameters): string;
  valueToRdf(parameters: Type.ValueToRdfParameters): string;
}

export namespace Type {
  export interface SparqlGraphPatternParameters {
    dataFactoryVariable: string;
    subjectVariable: string;
  }

  export interface ValueFromRdfParameters {
    dataFactoryVariable: string;
    resourceValueVariable: string;
  }

  export interface ValueToRdfParameters {
    mutateGraphVariable: string;
    propertyValueVariable: string;
    resourceSetVariable: string;
  }
}
