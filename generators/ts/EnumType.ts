import { Type } from "./Type.js";

export class EnumType extends Type {
  readonly kind = "Enum";

  get name(): string {
    throw new Error("not implemented");
  }

  equalsFunction(): string {
    throw new Error("not implemented.");
  }

  sparqlGraphPatternExpressions(
    _: Type.SparqlGraphPatternParameters,
  ): readonly string[] {
    throw new Error("not implemented");
  }

  valueFromRdfExpression(_: Type.ValueFromRdfParameters): string {
    throw new Error("not implemented");
  }

  valueToRdfExpression(_: Type.ValueToRdfParameters): string {
    throw new Error("not implemented");
  }
}
