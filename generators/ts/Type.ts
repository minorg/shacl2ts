import type * as ast from "../../ast";
import type { Configuration } from "./Configuration.js";

export abstract class Type {
  abstract readonly kind: ast.Type["kind"];
  abstract readonly name: string;
  protected readonly configuration: Configuration;

  protected constructor({ configuration }: Type.ConstructorParameters) {
    this.configuration = configuration;
  }

  abstract equalsFunction(leftValue: string, rightValue: string): string;

  abstract sparqlGraphPatterns(
    parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[];

  abstract valueFromRdf(parameters: Type.ValueFromRdfParameters): string;

  abstract valueToRdf(parameters: Type.ValueToRdfParameters): string;
}

export namespace Type {
  export interface ConstructorParameters {
    configuration: Configuration;
  }

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
