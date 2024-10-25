import type * as rdfjs from "@rdfjs/types";
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
  private readonly path: rdfjs.NamedNode;

  constructor({
    inline,
    maxCount,
    minCount,
    name,
    path,
    type,
  }: {
    inline: boolean;
    maxCount: Maybe<number>;
    minCount: number;
    name: string;
    path: rdfjs.NamedNode;
    type: Type;
  }) {
    this.inline = inline;
    this.maxCount = maxCount;
    this.minCount = minCount;
    this.name = name;
    this.path = path;
    this.type = type;
  }

  get classConstructorParametersPropertySignature(): OptionalKind<PropertySignatureStructure> {
    // If the interface type name is Maybe<string>
    let hasQuestionToken = false;
    const typeNames: string[] = [this.interfaceTypeName];
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      if (maxCount === 1) {
        typeNames.push(this.type.name(this.inline ? "inline" : "extern")); // Allow Maybe<string> | string | undefined
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
    const type = this.type.name(this.inline ? "inline" : "extern");
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
      path: astProperty.path.iri,
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

  valueFromRdf({
    dataFactoryVariable,
    resourceVariable,
  }: { dataFactoryVariable: string; resourceVariable: string }): string {
    const path = `${dataFactoryVariable}.namedNode("${this.path.value}")`;
    const resourceValueVariable = "value";
    if (this.containerType === "Array") {
      return `const ${this.name} = ${resourceVariable}.values(${path}).map(${resourceValueVariable}s => ${resourceValueVariable}s.flatMap(${resourceValueVariable} => (${this.type.valueFromRdf({ dataFactoryVariable, inline: this.inline, resourceValueVariable })}).toMaybe().toList())).orDefault([]);`;
    }

    const valueFromRdf = `${resourceVariable}.value(${path}).chain(${resourceValueVariable} => ${this.type.valueFromRdf({ dataFactoryVariable, inline: this.inline, resourceValueVariable })})`;
    switch (this.containerType) {
      case "Maybe":
        return `const ${this.name} = ${valueFromRdf}.toMaybe();`;
      case null:
        return `const _${this.name}Either = ${valueFromRdf}; if (_${this.name}Either.isLeft()) { return _${this.name}Either; } const ${this.name} = _${this.name}Either.unsafeCoerce();`;
    }
  }

  valueToRdf({
    mutateGraphVariable,
    propertyValueVariable,
    resourceSetVariable,
  }: Omit<Type.ValueToRdfParameters, "inline">): string {
    const path = `${resourceSetVariable}.dataFactory.namedNode("${this.path.value}")`;
    switch (this.containerType) {
      case "Array":
        return `${propertyValueVariable}.forEach((${this.name}Value) => { resource.add(${path}, ${this.type.valueToRdf({ inline: this.inline, mutateGraphVariable, resourceSetVariable, propertyValueVariable: `${this.name}Value` })}); });`;
      case "Maybe":
        return `${propertyValueVariable}.ifJust((${this.name}Value) => { resource.add(${path}, ${this.type.valueToRdf({ inline: this.inline, mutateGraphVariable, resourceSetVariable, propertyValueVariable: `${this.name}Value` })}); });`;
      case null:
        return `resource.add(${path}, ${this.type.valueToRdf({
          inline: this.inline,
          mutateGraphVariable,
          resourceSetVariable,
          propertyValueVariable,
        })});`;
    }
  }
}
