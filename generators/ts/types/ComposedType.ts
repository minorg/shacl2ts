import type { Type } from "./Type.js";

/**
 * Abstract base class for AndType and OrType.
 */
export abstract class ComposedType implements Type {
  abstract readonly kind: "And" | "Or";
  protected abstract readonly separator: string;

  constructor(private readonly types: readonly Type[]) {}

  equalsFunction(_leftValue: string, _rightValue: string): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "purifyHelpers.Equatable.booleanEquals";
    }

    throw new Error("not implemented");
  }

  name(nameType: Type.NameType): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.name(nameType)).join(` ${this.separator} `)})`;
  }

  valueToRdf({ value }: Type.ValueToRdfParameters): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return value;
    }

    throw new Error("not implemented");
  }
}
