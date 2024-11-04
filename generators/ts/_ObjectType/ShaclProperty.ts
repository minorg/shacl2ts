import type * as rdfjs from "@rdfjs/types";
import { pascalCase } from "change-case";
import { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import { Memoize } from "typescript-memoize";
import type { Type } from "../Type.js";
import { Property } from "./Property.js";

type ContainerType = "Array" | "Maybe" | null;

export class ShaclProperty extends Property {
  readonly type: Type;
  private readonly maxCount: Maybe<number>;
  private readonly minCount: number;
  private readonly path: rdfjs.NamedNode;

  constructor({
    maxCount,
    minCount,
    path,
    type,
    ...superParameters
  }: {
    maxCount: Maybe<number>;
    minCount: number;
    path: rdfjs.NamedNode;
    type: Type;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.maxCount = maxCount;
    this.minCount = minCount;
    this.path = path;
    this.type = type;
  }

  override get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    // If the interface type name is Maybe<string>
    let hasQuestionToken = false;
    const typeNames: string[] = [this.interfaceTypeName];
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      if (maxCount === 1) {
        typeNames.push(this.type.name); // Allow Maybe<string> | string | undefined
      }
      hasQuestionToken = true; // Allow Maybe<string> | undefined
    }

    return Maybe.of({
      hasQuestionToken,
      isReadonly: true,
      name: this.name,
      type: typeNames.join(" | "),
    });
  }

  override get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.interfaceTypeName,
    };
  }

  // biome-ignore lint/suspicious/useGetterReturn: <explanation>
  override get equalsFunction(): string {
    const typeEqualsFunction = this.type.equalsFunction();
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

  override get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.interfaceTypeName,
    };
  }

  // biome-ignore lint/suspicious/useGetterReturn: <explanation>
  @Memoize()
  get interfaceTypeName(): string {
    switch (this.containerType) {
      case "Array":
        return `readonly (${this.type.name})[]`;
      case "Maybe":
        return `purify.Maybe<${this.type.name}>`;
      case null:
        return this.type.name;
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

  @Memoize()
  private get pathExpression(): string {
    return `${this.configuration.dataFactoryVariable}.namedNode("${this.path.value}")`;
  }

  override classConstructorInitializer({
    parameter,
  }: Parameters<Property["classConstructorInitializer"]>[0]): Maybe<string> {
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      if (maxCount === 1) {
        return Maybe.of(
          `purify.Maybe.isMaybe(${parameter}) ? ${parameter} : purify.Maybe.fromNullable(${parameter})`,
        );
      }
      return Maybe.of(
        `(typeof ${parameter} !== "undefined" ? ${parameter} : [])`,
      );
    }
    return Maybe.of(parameter);
  }

  override fromRdfStatements({
    resourceVariable,
  }: Parameters<Property["fromRdfStatements"]>[0]): readonly string[] {
    const resourceValueVariable = "value";
    if (this.containerType === "Array") {
      return [
        `const ${this.name} = [...${resourceVariable}.values(${this.pathExpression}).flatMap(${resourceValueVariable} => (${this.type.fromRdfExpression({ predicate: this.path, resourceVariable, resourceValueVariable })}).toMaybe().toList())];`,
      ];
    }

    const valueFromRdf = `${resourceVariable}.value(${this.pathExpression}).chain(${resourceValueVariable} => ${this.type.fromRdfExpression({ predicate: this.path, resourceVariable, resourceValueVariable })})`;
    switch (this.containerType) {
      case "Maybe":
        return [`const ${this.name} = ${valueFromRdf}.toMaybe();`];
      case null:
        return [
          `const _${this.name}Either: purify.Either<rdfjsResource.Resource.ValueError, ${this.type.name}> = ${valueFromRdf};`,
          `if (_${this.name}Either.isLeft()) { return _${this.name}Either; }`,
          `const ${this.name} = _${this.name}Either.unsafeCoerce();`,
        ];
    }
  }

  override hashStatements({
    hasherVariable,
    propertyValueVariable,
  }: Parameters<Property["hashStatements"]>[0]): readonly string[] {
    switch (this.containerType) {
      case "Array":
        return [
          `for (const _element of ${propertyValueVariable}) { ${this.type
            .hashStatements({
              hasherVariable,
              propertyValueVariable: "_element",
            })
            .join("\n")} }`,
        ];
      case "Maybe": {
        return [
          `${propertyValueVariable}.ifJust((_${this.name}) => { ${this.type
            .hashStatements({
              hasherVariable,
              propertyValueVariable: `_${this.name}`,
            })
            .join("\n")} })`,
        ];
      }
      case null:
        return this.type.hashStatements({
          hasherVariable,
          propertyValueVariable,
        });
    }
  }

  override sparqlGraphPatternExpression(): Maybe<string> {
    let sparqlGraphPattern = `sparqlBuilder.GraphPattern.basic(this.subject, ${this.pathExpression}, this.variable("${pascalCase(this.name)}"))`;
    this.type
      .sparqlGraphPatternExpression({
        subjectVariable: this.name,
      })
      .ifJust((typeSparqlGraphPatternExpression) => {
        switch (typeSparqlGraphPatternExpression.type) {
          case "GraphPattern":
            sparqlGraphPattern = `sparqlBuilder.GraphPattern.group(${sparqlGraphPattern}.chainObject(${this.name} => [${typeSparqlGraphPatternExpression.value}]))`;
            break;
          case "GraphPatterns":
            sparqlGraphPattern = `sparqlBuilder.GraphPattern.group(${sparqlGraphPattern}.chainObject(${this.name} => ${typeSparqlGraphPatternExpression.value}))`;
            break;
        }
      });
    if (this.containerType === "Maybe") {
      sparqlGraphPattern = `sparqlBuilder.GraphPattern.optional(${sparqlGraphPattern})`;
    }
    return Maybe.of(sparqlGraphPattern);
  }

  override toRdfStatements({
    mutateGraphVariable,
    propertyValueVariable,
    resourceSetVariable,
  }: Parameters<Property["toRdfStatements"]>[0]): readonly string[] {
    switch (this.containerType) {
      case "Array":
        return [
          `for (const ${this.name}Value of ${propertyValueVariable}) { resource.add(${this.pathExpression}, ${this.type.toRdfExpression({ mutateGraphVariable, resourceSetVariable, propertyValueVariable: `${this.name}Value` })}); }`,
        ];
      case "Maybe":
        return [
          `${propertyValueVariable}.ifJust((${this.name}Value) => { resource.add(${this.pathExpression}, ${this.type.toRdfExpression({ mutateGraphVariable, resourceSetVariable, propertyValueVariable: `${this.name}Value` })}); });`,
        ];
      case null:
        return [
          `resource.add(${this.pathExpression}, ${this.type.toRdfExpression({
            mutateGraphVariable,
            resourceSetVariable,
            propertyValueVariable,
          })});`,
        ];
    }
  }
}
