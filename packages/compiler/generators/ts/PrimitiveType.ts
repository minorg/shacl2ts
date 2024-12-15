import { Maybe } from "purify-ts";
import { LiteralType } from "./LiteralType.js";
import type { Type } from "./Type.js";

export abstract class PrimitiveType<
  ValueT extends boolean | Date | string | number,
> extends LiteralType {
  abstract override readonly kind:
    | "BooleanType"
    | "DateTimeType"
    | "NumberType"
    | "StringType";
  readonly primitiveDefaultValue: Maybe<ValueT>;
  readonly primitiveIn: Maybe<readonly ValueT[]>;

  constructor({
    primitiveDefaultValue,
    primitiveIn,
    ...superParameters
  }: {
    primitiveDefaultValue: Maybe<ValueT>;
    primitiveIn: Maybe<readonly ValueT[]>;
  } & ConstructorParameters<typeof LiteralType>[0]) {
    super(superParameters);
    this.primitiveDefaultValue = primitiveDefaultValue;
    this.primitiveIn = primitiveIn;
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get useImports(): readonly string[] {
    return [];
  }

  override propertyEqualsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toString());`];
  }
}
