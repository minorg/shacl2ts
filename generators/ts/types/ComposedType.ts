import type { Type } from "./Type.js";

export abstract class ComposedType implements Type {
  constructor(private readonly types: readonly Type[]) {}

  equalsFunction(_leftValue: string, _rightValue: string): string {
    if (this.inlineName === "rdfjs.Literal") {
      return "purifyHelpers.Equatable.booleanEquals";
    }

    throw new Error("not implemented");
  }

  get externName(): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.externName).join(` ${this.separator} `)})`;
  }

  abstract readonly kind: "And" | "Or";

  get inlineName(): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.inlineName).join(` ${this.separator} `)})`;
  }

  protected abstract readonly separator: string;
}
