import { Type } from "./Type.js";

export class EnumType extends Type {
  readonly kind = "Enum";

  get name(): string {
    throw new Error("not implemented");
  }

  equalsFunction(_leftValue: string, _rightValue: string): string {
    throw new Error("not implemented.");
  }

  sparqlGraphPatterns(_: Type.SparqlGraphPatternParameters): readonly string[] {
    throw new Error("not implemented");
  }

  valueFromRdf(_: Type.ValueFromRdfParameters): string {
    throw new Error("not implemented");
  }

  valueToRdf(_: Type.ValueToRdfParameters): string {
    throw new Error("not implemented");
  }
}
