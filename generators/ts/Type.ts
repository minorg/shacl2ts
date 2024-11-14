import { Maybe } from "purify-ts";
import type * as ast from "../../ast";
import type { Configuration } from "./Configuration.js";

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
   * Expressions that convert a source type or types to this type.
   */
  get conversions(): readonly Type.Conversion[] {
    return [];
  }

  /**
   * A property that discriminates sub-types of this type e.g., termType on RDF/JS terms.
   */
  get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  /**
   * Imports used by other methods on this type.
   */
  get importStatements(): readonly string[] {
    return [];
  }

  /**
   * A function (reference or declaration) that compares two values of this type, returning a
   * purifyHelpers.Equatable.EqualsResult.
   */
  abstract equalsFunction(): string;

  /**
   * An expression that converts a property value/values from an rdfjsResource.Resource to an Either of
   * value/values of this type.
   */
  fromRdfResourceExpression({
    variables,
  }: {
    variables: {
      predicate: string;
      resource: string;
    };
  }): string {
    return `${variables.resource}.value(${variables.predicate}).chain(resourceValue => ${this.fromRdfResourceValueExpression({ variables: { ...variables, resourceValue: "resourceValue" } })})`;
  }

  /**
   * An expression that converts a property value/values from an rdfjsResource.Resource.Value to a Either of value/values
   * of this type.
   */
  abstract fromRdfResourceValueExpression(parameters: {
    variables: {
      predicate: string;
      resource: string;
      resourceValue: string;
    };
  }): string;

  /**
   * Statements that use hasher.update to hash a value of this type.
   */
  abstract hashStatements(parameters: {
    variables: {
      hasher: string;
      value: string;
    };
  }): readonly string[];

  /**
   * An optional sparqlBuilder.GraphPattern to chain to the basic pattern for a property.
   */
  sparqlGraphPatternExpression({
    variables,
  }: {
    variables: {
      object: string;
      predicate: string;
      subject: string;
    };
  }): Type.SparqlGraphPatternExpression | Type.SparqlGraphPatternsExpression {
    return new Type.SparqlGraphPatternExpression(
      `sparqlBuilder.GraphPattern.basic(${variables.subject}, ${variables.predicate}, ${variables.object})`,
    );
  }

  /**
   * An expression that converts a value of this type to one that that can be .add'd to
   * an rdfjsResource.Resource.
   */
  abstract toRdfExpression(parameters: {
    variables: {
      predicate: string;
      mutateGraph: string;
      resource: string;
      resourceSet: string;
      value: string;
    };
  }): string;
}

export namespace Type {
  export interface Conversion {
    readonly conversionExpression: (value: string) => string;
    readonly sourceTypeCheckExpression?: (value: string) => string;
    readonly sourceTypeName: string;
  }

  export interface DiscriminatorProperty {
    readonly name: string;
    readonly values: readonly string[];
  }

  export class SparqlGraphPatternExpression {
    constructor(private readonly value: string) {}

    toSparqlGraphPatternExpression() {
      return this;
    }

    toSparqlGraphPatternsExpression() {
      return new SparqlGraphPatternExpression(`[${this.value}]`);
    }

    toString() {
      return this.value;
    }
  }

  export class SparqlGraphPatternsExpression {
    constructor(private readonly value: string) {}

    toSparqlGraphPatternExpression() {
      return new SparqlGraphPatternExpression(
        `sparqlBuilder.GraphPattern.group(${this.value})`,
      );
    }

    toSparqlGraphPatternsExpression() {
      return this;
    }

    toString() {
      return this.value;
    }
  }
}
