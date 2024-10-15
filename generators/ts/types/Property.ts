import type { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
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

  // classConstructorInitializer(parameter: string): string {
  //   // Do assignment or call initMaybe or initArray generic functions
  //   // Caller should emit those functions if they're called
  // }

  get classConstructorParametersPropertySignature(): OptionalKind<PropertySignatureStructure> {
    // If the interface type name is Maybe<string>
    const typeNames: string[] = [this.interfaceTypeName];
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      if (maxCount === 1) {
        typeNames.push(
          this.inline ? this.type.inlineName : this.type.externName,
        ); // Allow Maybe<string> | string | undefined
      }
      typeNames.push("undefined"); // Allow Maybe<string> | undefined
    }

    return {
      isReadonly: true,
      name: this.name,
      type: typeNames.join(" | "),
    };
  }

  get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.interfaceTypeName,
    };
  }

  get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.interfaceTypeName,
    };
  }

  @Memoize()
  get interfaceTypeName(): string {
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
