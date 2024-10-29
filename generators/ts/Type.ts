import type * as ast from "../../ast";
import type { Configuration } from "./Configuration.js";

export abstract class Type {
  abstract readonly kind: ast.Type["kind"];
  abstract readonly name: string;
  protected readonly configuration: Configuration;

  constructor({ configuration }: Type.ConstructorParameters) {
    this.configuration = configuration;
  }

  /**
   * A function (reference or declaration) that conforms to purifyHelpers.Equatable.Equatable.
   */
  abstract equalsFunction(leftValue: string, rightValue: string): string;

  /**
   * Zero or more sparqlBuilder.GraphPattern constructions.
   */
  abstract sparqlGraphPatterns(
    parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[];

  /**
   * An expression that converts a rdfjsResource.Resource.Value to a value of this type.
   */
  abstract valueFromRdf(parameters: Type.ValueFromRdfParameters): string;

  /**
   * An expression that return true if a given value is of this type, otherwise false.
   */
  abstract valueInstanceOf(parameters: Type.ValueInstanceOfParameters): string;

  /**
   * An expression that converts a value of this type to an rdfjs.TermType that can be added to
   * an rdfjsResource.Resource.
   */
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

  export interface ValueInstanceOfParameters {
    propertyValueVariable: string;
  }

  export interface ValueToRdfParameters {
    mutateGraphVariable: string;
    propertyValueVariable: string;
    resourceSetVariable: string;
  }
}
