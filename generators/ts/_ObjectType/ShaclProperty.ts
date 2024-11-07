import type * as rdfjs from "@rdfjs/types";
import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { pascalCase } from "change-case";
import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import { Memoize } from "typescript-memoize";
import type { Type } from "../Type.js";
import { rdfjsTermExpression } from "../rdfjsTermExpression";
import { Property } from "./Property.js";

type ContainerType = "Array" | "Maybe" | null;

export class ShaclProperty extends Property {
  readonly type: Type;
  private readonly defaultValue: Maybe<BlankNode | Literal | NamedNode>;
  private readonly hasValue: Maybe<BlankNode | Literal | NamedNode>;
  private readonly maxCount: Maybe<number>;
  private readonly minCount: number;
  private readonly path: rdfjs.NamedNode;

  constructor({
    defaultValue,
    hasValue,
    maxCount,
    minCount,
    path,
    type,
    ...superParameters
  }: {
    defaultValue: Maybe<BlankNode | Literal | NamedNode>;
    hasValue: Maybe<BlankNode | Literal | NamedNode>;
    maxCount: Maybe<number>;
    minCount: number;
    path: rdfjs.NamedNode;
    type: Type;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.defaultValue = defaultValue;
    this.hasValue = hasValue;
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
    const typeNames = new Set<string>();
    typeNames.add(this.interfaceTypeName);
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      hasQuestionToken = true; // Allow undefined

      if (maxCount === 1) {
        // Allow Maybe<string> | string
        typeNames.add(`purify.Maybe<${this.type.name}>`);
        typeNames.add(this.type.name);
      }
    }

    return Maybe.of({
      hasQuestionToken,
      isReadonly: true,
      name: this.name,
      type: [...typeNames].sort().join(" | "),
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
      return this.defaultValue.isJust() ? null : "Maybe";
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

  override classConstructorInitializerExpression({
    parameter,
  }: Parameters<
    Property["classConstructorInitializerExpression"]
  >[0]): Maybe<string> {
    const maxCount = this.maxCount.extractNullable();
    if (this.minCount === 0) {
      if (maxCount === 1) {
        let expression = `purify.Maybe.isMaybe(${parameter}) ? ${parameter} : purify.Maybe.fromNullable(${parameter})`;
        this.defaultValue.ifJust((defaultValue) => {
          expression = `(${expression}).orDefault(${this.type.defaultValueExpression(defaultValue)})`;
        });
        return Maybe.of(expression);
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
    let valueFromRdfExpression = this.type.fromRdfExpression({
      resourceVariable,
      resourceValueVariable,
    });

    if (this.containerType === "Array") {
      return [
        `const ${this.name} = [...${resourceVariable}.values(${this.pathExpression}, { unique: true }).flatMap(${resourceValueVariable} => (${valueFromRdfExpression}).toMaybe().toList())];`,
      ];
    }

    valueFromRdfExpression = `${resourceVariable}.value(${this.pathExpression}).chain(${resourceValueVariable} => ${valueFromRdfExpression})`;
    this.hasValue.ifJust((hasValue) => {
      valueFromRdfExpression = `${valueFromRdfExpression}.chain<rdfjsResource.Resource.ValueError, ${this.type.name}>(_identifier => _identifier.equals(${rdfjsTermExpression(hasValue, this.configuration)}) ? purify.Either.of(_identifier) : purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: _identifier, expectedValueType: "${hasValue.termType}", focusResource: ${resourceVariable}, predicate: ${rdfjsTermExpression(this.path, this.configuration)} })))`;
    });

    switch (this.containerType) {
      case "Maybe":
        invariant(!this.defaultValue.isJust());
        valueFromRdfExpression = `${valueFromRdfExpression}.toMaybe()`;
        return [`const ${this.name} = ${valueFromRdfExpression};`];
      case null:
        if (this.defaultValue.isJust()) {
          const defaultValueExpression = this.type.defaultValueExpression(
            this.defaultValue.unsafeCoerce(),
          );
          return [
            `const ${this.name} = ${valueFromRdfExpression}.orDefault(${defaultValueExpression});`,
          ];
        }

        return [
          `const _${this.name}Either: purify.Either<rdfjsResource.Resource.ValueError, ${this.type.name}> = ${valueFromRdfExpression};`,
          `if (_${this.name}Either.isLeft()) { return _${this.name}Either; }`,
          `const ${this.name} = _${this.name}Either.unsafeCoerce();`,
        ];
    }
  }

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: Parameters<Property["hashStatements"]>[0]): readonly string[] {
    switch (this.containerType) {
      case "Array":
        return [
          `for (const _element of ${valueVariable}) { ${this.type
            .hashStatements({
              hasherVariable,
              valueVariable: "_element",
            })
            .join("\n")} }`,
        ];
      case "Maybe": {
        return [
          `${valueVariable}.ifJust((_${this.name}) => { ${this.type
            .hashStatements({
              hasherVariable,
              valueVariable: `_${this.name}`,
            })
            .join("\n")} })`,
        ];
      }
      case null:
        return this.type.hashStatements({
          hasherVariable,
          valueVariable: valueVariable,
        });
    }
  }

  override importStatements(): readonly string[] {
    return this.type.importStatements();
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
    if (this.minCount === 0) {
      sparqlGraphPattern = `sparqlBuilder.GraphPattern.optional(${sparqlGraphPattern})`;
    }
    return Maybe.of(sparqlGraphPattern);
  }

  override toRdfStatements({
    mutateGraphVariable,
    valueVariable,
    resourceSetVariable,
  }: Parameters<Property["toRdfStatements"]>[0]): readonly string[] {
    switch (this.containerType) {
      case "Array":
        return [
          `for (const ${this.name}Value of ${valueVariable}) { resource.add(${this.pathExpression}, ${this.type.toRdfExpression({ mutateGraphVariable, resourceSetVariable, valueVariable: `${this.name}Value` })}); }`,
        ];
      case "Maybe":
        return [
          `${valueVariable}.ifJust((${this.name}Value) => { resource.add(${this.pathExpression}, ${this.type.toRdfExpression({ mutateGraphVariable, resourceSetVariable, valueVariable: `${this.name}Value` })}); });`,
        ];
      case null:
        return [
          `resource.add(${this.pathExpression}, ${this.type.toRdfExpression({
            mutateGraphVariable,
            resourceSetVariable,
            valueVariable: valueVariable,
          })});`,
        ];
    }
  }
}
