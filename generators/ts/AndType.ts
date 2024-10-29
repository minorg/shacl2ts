import { ComposedType } from "./ComposedType.js";
import type { Type } from "./Type.js";

export class AndType extends ComposedType {
  readonly kind = "And";

  get name(): string {
    return `(${this.types.map((type) => type.name).join(" & ")})`;
  }

  override equalsFunction(): string {
    throw new Error("Method not implemented.");
  }

  override sparqlGraphPatternExpressions(
    _parameters: Type.SparqlGraphPatternParameters,
  ): readonly string[] {
    throw new Error("Method not implemented.");
  }

  override valueFromRdfExpression(
    _parameters: Type.ValueFromRdfParameters,
  ): string {
    throw new Error("Method not implemented.");
  }

  override valueToRdfExpression(
    _parameters: Type.ValueToRdfParameters,
  ): string {
    throw new Error("Method not implemented.");
  }
}
