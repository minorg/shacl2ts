import { Type } from "./Type.js";

/**
 * Abstract base class for AndType and OrType.
 */
export abstract class ComposedType extends Type {
  abstract override readonly kind: "And" | "Or";
  protected abstract readonly nameSeparator: string;
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

    return `(${this.types.map((type) => type.name).join(` ${this.nameSeparator} `)})`;
  }
}
