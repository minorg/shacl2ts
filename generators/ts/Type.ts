import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { xsd } from "@tpluscode/rdf-ns-builders";
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
  abstract equalsFunction(): string;

  /**
   * Zero or more sparqlBuilder.GraphPattern constructions.
   */
  abstract sparqlGraphPatternExpressions(
    parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[];

  /**
   * An expression that converts a rdfjsResource.Resource.Value to a value of this type.
   */
  abstract valueFromRdfExpression(
    parameters: Type.ValueFromRdfParameters,
  ): string;

  /**
   * An expression that return true if a given value is of this type, otherwise false.
   */
  abstract valueInstanceOfExpression(
    parameters: Type.ValueInstanceOfParameters,
  ): string;

  /**
   * An expression that converts a value of this type to an rdfjs.TermType that can be added to
   * an rdfjsResource.Resource.
   */
  abstract valueToRdfExpression(parameters: Type.ValueToRdfParameters): string;

  protected rdfJsTermExpression(
    rdfjsTerm: BlankNode | Literal | NamedNode,
  ): string {
    switch (rdfjsTerm.termType) {
      case "BlankNode":
        return `${this.configuration.dataFactoryVariable}.blankNode("${rdfjsTerm.value}")`;
      case "Literal":
        if (rdfjsTerm.datatype.equals(xsd.string)) {
          return `${this.configuration.dataFactoryVariable}.literal("${rdfjsTerm.value}", "${rdfjsTerm.language}")`;
        }
        return `${this.configuration.dataFactoryVariable}.literal("${rdfjsTerm.value}", ${this.configuration.dataFactoryVariable}.namedNode("${rdfjsTerm.datatype.value}"))`;
      case "NamedNode":
        return `${this.configuration.dataFactoryVariable}.namedNode("${rdfjsTerm.value}")`;
    }
  }
}

export namespace Type {
  export interface ConstructorParameters {
    configuration: Configuration;
  }

  export interface SparqlGraphPatternParameters {
    subjectVariable: string;
  }

  export interface ValueFromRdfParameters {
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
