import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { xsd } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type * as ast from "../../ast";
import type { Configuration } from "./Configuration.js";

export abstract class Type {
  abstract readonly kind: ast.Type["kind"];
  abstract readonly name: string;
  protected readonly configuration: Configuration;

  constructor({ configuration }: Type.ConstructorParameters) {
    this.configuration = configuration;
  }

  get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  /**
   * A function (reference or declaration) that conforms to purifyHelpers.Equatable.Equatable.
   */
  abstract equalsFunction(): string;

  /**
   * An optional sparqlBuilder.GraphPattern to chain to the basic pattern for a property.
   */
  abstract sparqlGraphPatternExpression(
    parameters: Type.SparqlGraphPatternParameters,
  ): Maybe<string>;

  /**
   * An expression that converts a rdfjsResource.Resource.Value to a value of this type.
   */
  abstract valueFromRdfExpression(
    parameters: Type.ValueFromRdfParameters,
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

  export interface DiscriminatorProperty {
    readonly name: string;
    readonly values: readonly string[];
  }

  export interface SparqlGraphPatternParameters {
    subjectVariable: string;
  }

  export interface ValueFromRdfParameters {
    predicate: NamedNode;
    resourceValueVariable: string;
    resourceVariable: string;
  }

  export interface ValueToRdfParameters {
    mutateGraphVariable: string;
    propertyValueVariable: string;
    resourceSetVariable: string;
  }
}
