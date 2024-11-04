import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { xsd } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type * as ast from "../../ast";
import type { Configuration } from "./Configuration.js";

export abstract class Type {
  abstract readonly kind: ast.Type["kind"] | "List";
  abstract readonly name: string;
  protected readonly configuration: Configuration;

  constructor({
    configuration,
  }: {
    configuration: Configuration;
  }) {
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
   * An expression that converts a rdfjsResource.Resource.Value to a value of this type.
   */
  abstract fromRdfExpression(parameters: {
    predicate: NamedNode;
    resourceValueVariable: string;
    resourceVariable: string;
  }): string;

  abstract hashStatements(parameters: {
    hasherVariable: string;
    valueVariable: string;
  }): readonly string[];

  /**
   * An optional sparqlBuilder.GraphPattern to chain to the basic pattern for a property.
   */
  abstract sparqlGraphPatternExpression(parameters: {
    subjectVariable: string;
  }): Maybe<Type.SparqlGraphPatternExpression>;

  /**
   * An expression that converts a value of this type to an rdfjs.TermType that can be added to
   * an rdfjsResource.Resource.
   */
  abstract toRdfExpression(parameters: {
    mutateGraphVariable: string;
    resourceSetVariable: string;
    valueVariable: string;
  }): string;

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
  export interface DiscriminatorProperty {
    readonly name: string;
    readonly values: readonly string[];
  }

  export type SparqlGraphPatternExpression =
    | { type: "GraphPattern"; value: string }
    | { type: "GraphPatterns"; value: string };
}
