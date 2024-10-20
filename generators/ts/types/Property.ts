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

type ContainerType = "Array" | "Maybe" | null;

export class Property {
  readonly inline: boolean;
  readonly name: string;
  readonly type: Type;
  private readonly maxCount: Maybe<number>;
  private readonly minCount: number;

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

  get classConstructorParametersPropertySignature(): OptionalKind<PropertySignatureStructure> {
    // If the interface type name is Maybe<string>
    let hasQuestionToken = false;
    const typeNames: string[] = [this.interfaceTypeName];
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      if (maxCount === 1) {
        typeNames.push(
          this.inline ? this.type.inlineName : this.type.externName,
        ); // Allow Maybe<string> | string | undefined
      }
      hasQuestionToken = true; // Allow Maybe<string> | undefined
    }

    return {
      hasQuestionToken,
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

  // biome-ignore lint/suspicious/useGetterReturn: <explanation>
  get equalsFunction(): string {
    const typeEqualsFunction = this.type.equalsFunction("left", "right");
    // const signature = `(left: ${this.interfaceTypeName}, right: ${this.interfaceTypeName})`;
    const signature = "(left, right)";
    switch (this.containerType) {
      case "Array": {
        if (typeEqualsFunction === "purifyHelpers.Equatable.equals") {
          return "purifyHelpers.Equatable.arrayEquals";
        }
        return `${signature} => purifyHelpers.Arrays.equals(left, right, ${typeEqualsFunction})`;
      }
      case "Maybe": {
        if (typeEqualsFunction === "purifyHelpers.Equatable.equals") {
          return "purifyHelpers.Equatable.maybeEquals";
        }
        if (typeEqualsFunction === "purifyHelpers.Equatable.strictEquals") {
          return `${signature} => left.equals(right)`; // Use Maybe.equals
        }
        return `${signature} => purifyHelpers.Maybes.equals(left, right, ${typeEqualsFunction})`;
      }
      case null:
        return typeEqualsFunction;
    }
  }

  get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.interfaceTypeName,
    };
  }

  // biome-ignore lint/suspicious/useGetterReturn: <explanation>
  @Memoize()
  get interfaceTypeName(): string {
    const type = this.inline ? this.type.inlineName : this.type.externName;
    switch (this.containerType) {
      case "Array":
        return `readonly (${type})[]`;
      case "Maybe":
        return `purify.Maybe<${type}>`;
      case null:
        return type;
    }
  }

  @Memoize()
  private get containerType(): ContainerType {
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0 && maxCount === 1) {
      return "Maybe";
    }
    if (this.minCount === 1 && maxCount === 1) {
      return null;
    }
    return "Array";
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

  classConstructorInitializer(parameter: string): string {
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      if (maxCount === 1) {
        return `purify.Maybe.isMaybe(${parameter}) ? ${parameter} : purify.Maybe.fromNullable(${parameter})`;
      }
      return `(typeof ${parameter} !== "undefined" ? ${parameter} : [])`;
    }
    return parameter;
  }

  toRdf({
    resourceSetVariable,
    value,
  }: { resourceSetVariable: string; value: string }): string {
    switch (this.containerType) {
      case "Array":
        return `${value}.forEach((${this.name}Value) => { ${this.type.toRdf({ resourceSetVariable, value: `${this.name}Value` })} })`;
      case "Maybe":
        return `${value}.ifJust((${this.name}Value) => { ${this.type.toRdf({ resourceSetVariable, value: `${this.name}Value` })} }`;
      case null:
        return this.type.toRdf({ resourceSetVariable, value: value });
    }
  }
}
