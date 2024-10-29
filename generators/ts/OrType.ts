import { ComposedType } from "./ComposedType";

export class OrType extends ComposedType {
  readonly kind = "Or";
  protected readonly nameSeparator = "|";
}
