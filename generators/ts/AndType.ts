import { ComposedType } from "./ComposedType.js";

export class AndType extends ComposedType {
  readonly kind = "And";
  protected readonly separator = "&";
}
