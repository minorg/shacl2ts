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

  fromRdfExpression(): string {
    throw new Error("not implemented");
  }

  sparqlGraphPatternExpression(): Maybe<Type.SparqlGraphPatternExpression> {
    throw new Error("not implemented");
  }

  toRdfExpression(): string {
    throw new Error("not implemented");
  }
}
