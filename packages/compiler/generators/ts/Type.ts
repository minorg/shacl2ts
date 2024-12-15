import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { xsd } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type * as ast from "../../ast/index.js";

/**
 * Abstract base class for generating TypeScript expressions and statemenst in the TypeScript generator.
 *
 * Subclasses are used for both property types (c.f., property* methods) and node/object types.
 */
export abstract class Type {
  /**
   * Expressions that convert a source type or types to this type. It should include the type itself.
   */
  abstract readonly conversions: readonly Type.Conversion[];

  abstract readonly kind:
    | ast.Type["kind"]
    | "BooleanType"
    | "DateTimeType"
    | "ListType"
    | "NumberType"
    | "StringType";

  abstract readonly name: string;

  protected readonly dataFactoryVariable: string;

  constructor({
    dataFactoryVariable,
  }: {
    dataFactoryVariable: string;
  }) {
    this.dataFactoryVariable = dataFactoryVariable;
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
   * An optional sparqlBuilder.GraphPattern expression that's chained to the object of another pattern, such as a list item.
   *
   * If the type is e.g., an RDF/JS term it won't have additional graph patterns beyond the basic (s, p, o), and this
   * method will return nothing.
   */
  propertyChainSparqlGraphPatternExpression(_: {
    variables: {
      subject: string;
    };
  }): Maybe<
    Type.SparqlGraphPatternExpression | Type.SparqlGraphPatternsExpression
  > {
    return Maybe.empty();
  }

  /**
   * A function (reference or declaration) that compares two property values of this type, returning a
   * purifyHelpers.Equatable.EqualsResult.
   */
  abstract propertyEqualsFunction(): string;

  /**
   * An expression that converts a rdfjsResource.Resource.Values to an Either of value/values
   * of this type for a property.
   */
  abstract propertyFromRdfExpression(parameters: {
    variables: {
      context: string;
      predicate: string;
      resource: string;
      resourceValues: string;
    };
  }): string;

  /**
   * Statements that use hasher.update to hash a property value of this type.
   */
  abstract propertyHashStatements(parameters: {
    depth: number;
    variables: {
      hasher: string;
      value: string;
    };
  }): readonly string[];

  /**
   * An sparqlBuilder.GraphPattern expression for a property, typically building a basic graph pattern.
   */
  propertySparqlGraphPatternExpression({
    variables,
  }: {
    variables: {
      object: string;
      predicate: string;
      subject: string;
    };
  }): Type.SparqlGraphPatternExpression | Type.SparqlGraphPatternsExpression {
    let expression = `sparqlBuilder.GraphPattern.basic(${variables.subject}, ${variables.predicate}, ${variables.object})`;
    this.propertyChainSparqlGraphPatternExpression({
      variables: { subject: "_object" },
    }).ifJust((chainSparqlGraphPatternExpression) => {
      expression = `sparqlBuilder.GraphPattern.group(${expression}.chainObject(_object => ${chainSparqlGraphPatternExpression.toSparqlGraphPatternsExpression()}))`;
    });
    return new Type.SparqlGraphPatternExpression(expression);
  }

  /**
   * An expression that converts a property value of this type to one that that can be .add'd to
   * an rdfjsResource.Resource.
   */
  abstract propertyToRdfExpression(parameters: {
    variables: {
      predicate: string;
      mutateGraph: string;
      resource: string;
      resourceSet: string;
      value: string;
    };
  }): string;

  protected rdfjsTermExpression(
    rdfjsTerm: BlankNode | Literal | NamedNode,
  ): string {
    switch (rdfjsTerm.termType) {
      case "BlankNode":
        return `${this.dataFactoryVariable}.blankNode("${rdfjsTerm.value}")`;
      case "Literal":
        if (rdfjsTerm.datatype.equals(xsd.string)) {
          return `${this.dataFactoryVariable}.literal("${rdfjsTerm.value}", "${rdfjsTerm.language}")`;
        }
        return `${this.dataFactoryVariable}.literal("${rdfjsTerm.value}", ${this.dataFactoryVariable}.namedNode("${rdfjsTerm.datatype.value}"))`;
      case "NamedNode":
        return `${this.dataFactoryVariable}.namedNode("${rdfjsTerm.value}")`;
    }
  }
}

export namespace Type {
  export interface Conversion {
    readonly conversionExpression: (value: string) => string;
    readonly sourceTypeCheckExpression: (value: string) => string;
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
