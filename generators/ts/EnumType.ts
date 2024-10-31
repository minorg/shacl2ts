import type { Maybe } from "purify-ts";
import { Type } from "./Type.js";

export class EnumType extends Type {
  readonly kind = "Enum";

  override get name(): string {
    throw new Error("not implemented");
  }

  override equalsFunction(): string {
    throw new Error("not implemented.");
  }

  override fromRdfExpression(): string {
    throw new Error("not implemented");
  }

  override hashStatements(): readonly string[] {
    throw new Error("Method not implemented.");
  }

  override sparqlGraphPatternExpression(): Maybe<Type.SparqlGraphPatternExpression> {
    throw new Error("not implemented");
  }

  override toRdfExpression(): string {
    throw new Error("not implemented");
  }
}
