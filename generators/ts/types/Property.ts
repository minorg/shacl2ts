import type { Maybe } from "purify-ts";
import { Memoize } from "typescript-memoize";
import type * as ast from "../../../ast";
import type { Type } from "./Type.js";
import { createTypeFromAstType } from "./createTypeFromAstType";

export class Property {
  readonly inline: boolean;
  private readonly maxCount: Maybe<number>;
  private readonly minCount: number;
  readonly name: string;
  readonly type: Type;

  constructor({
    inline,
    maxCount,
    minCount,
    name,
    type,
  }: {
    inline: boolean;
    maxCount: Maybe<number>;
    minCount: number;
    name: string;
    type: Type;
  }) {
    this.inline = inline;
    this.maxCount = maxCount;
    this.minCount = minCount;
    this.name = name;
    this.type = type;
  }

  static fromAstProperty(astProperty: ast.Property): Property {
    return new Property({
      inline: astProperty.inline,
      maxCount: astProperty.maxCount,
      minCount: astProperty.minCount,
      name: astProperty.name.tsName,
      type: createTypeFromAstType(astProperty.type),
    });
  }

  @Memoize()
  get typeName(): string {
    const maxCount = this.maxCount.extractNullable();
    let type = this.inline ? this.type.inlineName : this.type.externName;
    if (this.minCount === 0 && maxCount === 1) {
      type = `purify.Maybe<${type}>`;
    } else if (this.minCount === 1 && maxCount === 1) {
    } else {
      type = `readonly (${type})[]`;
    }
    return type;
  }
}
