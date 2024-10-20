import type { Type } from "./Type.js";

export abstract class ComposedType implements Type {
  abstract readonly kind: "And" | "Or";
  protected abstract readonly separator: string;

  constructor(private readonly types: readonly Type[]) {}

  get externName(): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.externName).join(` ${this.separator} `)})`;
  }

  get inlineName(): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.inlineName).join(` ${this.separator} `)})`;
  }

  equalsFunction(_leftValue: string, _rightValue: string): string {
    if (this.inlineName === "rdfjs.Literal") {
      return "purifyHelpers.Equatable.booleanEquals";
    }

    throw new Error("not implemented");
  }

  toRdf({ value }: { resourceSetVariable: string; value: string }): string {
    if (this.types.every((type) => type.kind === "Literal")) {
      return value;
    }

    throw new Error("not implemented");
  }
}
