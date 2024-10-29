import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";

export class LiteralType extends RdfjsTermType {
  readonly kind = "Literal";

  get name(): string {
    return "rdfjs.Literal";
  }

  valueFromRdf({ resourceValueVariable }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.toLiteral()`;
  }

  override valueInstanceOf({
    propertyValueVariable,
  }: Type.ValueInstanceOfParameters): string {
    return `(typeof ${propertyValueVariable} === "object" && ${propertyValueVariable}.hasOwnProperty("termType") && ${propertyValueVariable}["termType"] === "Literal")`;
  }
}
