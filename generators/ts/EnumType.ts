import { Type } from "./Type.js";

export class EnumType extends Type {
  readonly kind = "Enum";

  get name(): string {
    throw new Error("not implemented");
  }

  equalsFunction(): string {
    throw new Error("not implemented.");
  }

  sparqlGraphPatterns(_: Type.SparqlGraphPatternParameters): readonly string[] {
    throw new Error("not implemented");
  }

  valueFromRdf(_: Type.ValueFromRdfParameters): string {
    throw new Error("not implemented");
  }

  override valueInstanceOf(_: Type.ValueInstanceOfParameters): string {
    throw new Error("not implemented");
  }

  valueToRdf(_: Type.ValueToRdfParameters): string {
    throw new Error("not implemented");
  }
}
