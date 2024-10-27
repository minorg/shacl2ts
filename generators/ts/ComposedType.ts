import { Type } from "./Type.js";

/**
 * Abstract base class for AndType and OrType.
 */
export abstract class ComposedType extends Type {
  abstract override readonly kind: "And" | "Or";
  protected abstract readonly separator: string;
  protected readonly types: readonly Type[];

  constructor({
    types,
    ...superParameters
  }: { types: readonly Type[] } & Type.ConstructorParameters) {
    super(superParameters);
    this.types = types;
  }

  get name(): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.name).join(` ${this.separator} `)})`;
  }

  equalsFunction(_leftValue: string, _rightValue: string): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "purifyHelpers.Equatable.booleanEquals";
    }

    throw new Error("not implemented");
  }

  sparqlGraphPatterns(
    _parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[] {
    if (this.types.every((type) => type.kind === "Literal")) {
      return [];
    }

    throw new Error("not implemented");
  }

  valueFromRdf({ resourceValueVariable }: Type.ValueFromRdfParameters): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return `${resourceValueVariable}.toLiteral()`;
    }

    throw new Error("not implemented");
  }

  valueToRdf({ propertyValueVariable }: Type.ValueToRdfParameters): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return propertyValueVariable;
    }

    throw new Error("not implemented");
  }
}
