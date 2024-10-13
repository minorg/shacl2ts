import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type.js";

export abstract class ComposedType implements Type {
  constructor(private readonly types: readonly Type[]) {}

  get externName(): string {
    if (this.types.every((type) => type instanceof LiteralType)) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.externName).join(` ${this.separator} `)})`;
  }

  get inlineName(): string {
    if (this.types.every((type) => type instanceof LiteralType)) {
      return "rdfjs.Literal";
    }

    return `(${this.types.map((type) => type.inlineName).join(` ${this.separator} `)})`;
  }

  protected abstract readonly separator: string;
}
