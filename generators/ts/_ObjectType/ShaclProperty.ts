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
import { Property } from "./Property.js";

type ContainerType = "Array" | "Maybe" | null;

export class ShaclProperty extends Property {
  readonly type: Type;
  private readonly defaultValue: Maybe<BlankNode | Literal | NamedNode>;
  private readonly maxCount: Maybe<number>;
  private readonly minCount: number;
  private readonly path: rdfjs.NamedNode;

  constructor({
    defaultValue,
    maxCount,
    minCount,
    path,
    type,
    ...superParameters
  }: {
    defaultValue: Maybe<BlankNode | Literal | NamedNode>;
    maxCount: Maybe<number>;
    minCount: number;
    path: rdfjs.NamedNode;
    type: Type;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.defaultValue = defaultValue;
    this.maxCount = maxCount;
    this.minCount = minCount;
    this.path = path;
    this.type = type;
  }

  override get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    let hasQuestionToken = false;
    const typeNames = new Set<string>(); // Remove duplicates with a set

    switch (this.containerType) {
      case "Array": {
        hasQuestionToken = true; // Allow undefined
        typeNames.add(this.typeName);
        break;
      }
      case "Maybe": {
        hasQuestionToken = true; // Allow undefined

        // Allow Maybe<string> | string
        typeNames.add(
          `purify.Maybe<${this.type.convertibleFromTypeNames.join("|")}>`,
        );
        for (const typeName of this.type.convertibleFromTypeNames) {
          typeNames.add(typeName);
        }
        break;
      }
      case null: {
        if (this.defaultValue.isJust()) {
          // Required property with default value
          // Allow undefined
          // Could also support Maybe here but why bother?
          hasQuestionToken = true;
        }
        typeNames.add(this.typeName);
        for (const typeName of this.type.convertibleFromTypeNames) {
          typeNames.add(typeName);
        }
        break;
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
      type: this.typeName,
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

  override get importStatements(): readonly string[] {
    return this.type.importStatements;
  }

  override get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.typeName,
    };
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

  private get typeName(): string {
    switch (this.containerType) {
      case "Array":
        return `readonly (${this.type.name})[]`;
      case "Maybe":
        return `purify.Maybe<${this.type.name}>`;
      case null:
        return this.type.name;
      default:
        throw new Error("should never reach this");
    }
  }

  override classConstructorInitializerExpression({
    parameter,
  }: Parameters<
    Property["classConstructorInitializerExpression"]
  >[0]): Maybe<string> {
    switch (this.containerType) {
      case "Array": {
        // Don't try to do conversions or default value here
        return Maybe.of(
          `(typeof ${parameter} !== "undefined" ? ${parameter} : [])`,
        );
      }
      case "Maybe": {
        let expression = `purify.Maybe.isMaybe(${parameter}) ? ${parameter} : purify.Maybe.fromNullable(${parameter})`;
        this.type
          .convertToExpression({ valueVariable: "value" })
          .ifJust((convertToExpression) => {
            expression = `(${expression}).map(value => ${convertToExpression})`;
          });
        this.defaultValue.ifJust((defaultValue) => {
          expression = `(${expression}).orDefault(${this.type.defaultValueExpression(defaultValue)})`;
        });
        return Maybe.of(expression);
      }
      case null: {
        let expression = this.type
          .convertToExpression({ valueVariable: parameter })
          .orDefault(parameter);
        this.defaultValue.ifJust((defaultValue) => {
          expression = `typeof ${parameter} !== "undefined" ? (${expression}) : ${this.type.defaultValueExpression(defaultValue)}`;
        });
        return Maybe.of(expression);
      }
    }
  }

  override fromRdfStatements({
    resourceVariable,
  }: Parameters<Property["fromRdfStatements"]>[0]): readonly string[] {
    const resourceValueVariable = "value";
    let valueFromRdfExpression = this.type.fromRdfExpression({
      propertyPath: this.path,
      resourceVariable,
      resourceValueVariable,
    });

    if (this.containerType === "Array") {
      return [
        `const ${this.name} = [...${resourceVariable}.values(${this.pathExpression}, { unique: true }).flatMap(${resourceValueVariable} => (${valueFromRdfExpression}).toMaybe().toList())];`,
      ];
    }

    valueFromRdfExpression = `${resourceVariable}.value(${this.pathExpression}).chain(${resourceValueVariable} => ${valueFromRdfExpression})`;

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
          `const _${this.name}Either = ${valueFromRdfExpression};`,
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
    resourceSetVariable,
    valueVariable,
  }: Parameters<Property["toRdfStatements"]>[0]): readonly string[] {
    const resourceAddValueVariable =
      this.containerType === null ? valueVariable : `${this.name}Value`;
    let resourceAddStatement = `resource.add(${this.pathExpression}, ${this.type.toRdfExpression({ mutateGraphVariable, resourceSetVariable, valueVariable: resourceAddValueVariable })});`;
    if (this.containerType !== "Array") {
      this.defaultValue.ifJust((defaultValue) => {
        resourceAddStatement = `if (${this.type.valueIsNotDefaultExpression({ defaultValue, valueVariable: resourceAddValueVariable })}) { ${resourceAddStatement} }`;
      });
    }

    switch (this.containerType) {
      case "Array":
        return [
          `for (const ${this.name}Value of ${valueVariable}) { ${resourceAddStatement} }`,
        ];
      case "Maybe":
        return [
          `${valueVariable}.ifJust((${this.name}Value) => { ${resourceAddStatement} } )`,
        ];
      case null:
        return [resourceAddStatement];
    }
  }
}
