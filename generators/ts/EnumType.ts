import type { Maybe } from "purify-ts";
import { Type } from "./Type.js";

export class EnumType extends Type {
  readonly kind = "Enum";

  get name(): string {
    throw new Error("not implemented");
  }

  equalsFunction(): string {
    throw new Error("not implemented.");
  }

  fromRdfExpression(_: Type.FromRdfExpressionParameters): string {
    throw new Error("not implemented");
  }

  sparqlGraphPatternExpression(
    _: Type.SparqlGraphPatternParameters,
  ): Maybe<Type.SparqlGraphPatternExpression> {
    throw new Error("not implemented");
  }

  toRdfExpression(_: Type.ToRdfExpressionParameters): string {
    throw new Error("not implemented");
  }
}
