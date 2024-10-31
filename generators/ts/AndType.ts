import type { Maybe } from "purify-ts";
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

  override fromRdfExpression(_parameters: Type.FromRdfExpressionParameters): string {
    throw new Error("Method not implemented.");
  }

  override sparqlGraphPatternExpression(
    _parameters: Type.SparqlGraphPatternParameters,
  ): Maybe<Type.SparqlGraphPatternExpression> {
    throw new Error("Method not implemented.");
  }

  override toRdfExpression(_parameters: Type.ToRdfExpressionParameters): string {
    throw new Error("Method not implemented.");
  }
}
