import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import type * as ast from "../../ast";
import type { Configuration } from "./Configuration.js";
import { rdfjsTermExpression } from "./rdfjsTermExpression.js";

export abstract class Type {
  abstract readonly kind: ast.Type["kind"] | "ListType";
  abstract readonly name: string;
  protected readonly configuration: Configuration;

  constructor({
    configuration,
  }: {
    configuration: Configuration;
  }) {
    this.configuration = configuration;
  }

  /**
   * Array of (additional) type names that can be converted to this type.
   */
  get convertibleFromTypeNames(): readonly string[] {
    return [this.name];
  }

  get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  get importStatements(): readonly string[] {
    return [];
  }

  /**
   * An expression that converts any of the convertible-from type names to this type.
   */
  convertToExpression(_: { variables: { value: string } }): Maybe<string> {
    return Maybe.empty();
  }

  /**
   * Convert a default value from an RDF/JS term into an expression that can be used in an initializer.
   */
  defaultValueExpression(
    defaultValue: BlankNode | Literal | NamedNode,
  ): string {
    return rdfjsTermExpression(defaultValue, this.configuration);
  }

  /**
   * A function (reference or declaration) that conforms to purifyHelpers.Equatable.Equatable.
   */
  abstract equalsFunction(): string;

  /**
   * An expression that converts a rdfjsResource.Resource.Value to a value of this type.
   */
  abstract fromRdfExpression(parameters: {
    variables: {
      predicate: string;
      resource: string;
      resourceValue: string;
    };
  }): string;

  abstract hashStatements(parameters: {
    variables: {
      hasher: string;
      value: string;
    };
  }): readonly string[];

  /**
   * An optional sparqlBuilder.GraphPattern to chain to the basic pattern for a property.
   */
  abstract sparqlGraphPatternExpression(parameters: {
    variables: {
      subject: string;
    };
  }): Maybe<Type.SparqlGraphPatternExpression>;

  /**
   * An expression that converts a value of this type to an rdfjs.TermType that can be added to
   * an rdfjsResource.Resource.
   */
  abstract toRdfStatements(parameters: {
    variables: {
      predicate: string;
      mutateGraph: string;
      resource: string;
      resourceSet: string;
      value: string;
    };
  }): readonly string[];

  /**
   * An expression that evaluates to a boolean if the given value is not the default value.
   */
  valueIsNotDefaultExpression({
    defaultValue,
    variables,
  }: {
    defaultValue: BlankNode | Literal | NamedNode;
    variables: {
      value: string;
    };
  }) {
    return `!${variables.value}.equals(${rdfjsTermExpression(defaultValue, this.configuration)})`;
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
