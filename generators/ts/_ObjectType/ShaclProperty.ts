import type * as rdfjs from "@rdfjs/types";
import { pascalCase } from "change-case";
import { Maybe } from "purify-ts";
import type {
  GetAccessorDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import { Memoize } from "typescript-memoize";
import type { Type } from "../Type.js";
import { Property } from "./Property.js";

export class ShaclProperty extends Property<Type> {
  private readonly path: rdfjs.NamedNode;

  constructor({
    path,
    ...superParameters
  }: {
    path: rdfjs.NamedNode;
    type: Type;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.path = path;
  }

  override get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    let hasQuestionToken = false;
    const typeNames = new Set<string>(); // Remove duplicates with a set
    for (const conversion of this.type.conversions) {
      if (conversion.sourceTypeName === "undefined") {
        hasQuestionToken = true;
      } else {
        typeNames.add(conversion.sourceTypeName);
      }
    }

    return Maybe.of({
      hasQuestionToken,
      isReadonly: true,
      name: this.name,
      type: [...typeNames].sort().join(" | "),
    });
  }

  override get classGetAccessorDeclaration(): Maybe<
    OptionalKind<GetAccessorDeclarationStructure>
  > {
    return Maybe.empty();
  }

  override get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    };
  }

  override get equalsFunction(): string {
    return this.type.equalsFunction();
  }

  override get importStatements(): readonly string[] {
    return this.type.importStatements;
  }

  override get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    };
  }

  @Memoize()
  private get pathExpression(): string {
    return `${this.configuration.dataFactoryVariable}.namedNode("${this.path.value}")`;
  }

  override classConstructorStatements({
    variables,
  }: Parameters<
    Property<Type>["classConstructorStatements"]
  >[0]): readonly string[] {
    const typeConversions = this.type.conversions;
    if (typeConversions.length === 1) {
      return [`this.${this.name} = ${variables.parameter};`];
    }
    const statements: string[] = [];
    for (const conversion of this.type.conversions) {
      statements.push(
        `if (${conversion.sourceTypeCheckExpression ? conversion.sourceTypeCheckExpression(variables.parameter) : `typeof ${variables.parameter} === "${conversion.sourceTypeName}"`}) { this.${this.name} = ${conversion.conversionExpression(variables.parameter)}; }`,
      );
    }
    // We shouldn't need this else, since the parameter now has the never type, but have to add it to appease the TypeScript compiler
    statements.push(
      `{ this.${this.name} = ${variables.parameter}; // never\n }`,
    );
    return [statements.join(" else ")];
  }

  override fromRdfStatements({
    variables,
  }: Parameters<Property<Type>["fromRdfStatements"]>[0]): readonly string[] {
    return [
      `const _${this.name}Either: purify.Either<rdfjsResource.Resource.ValueError, ${this.type.name}> = ${this.type.fromRdfExpression({ variables: { ...variables, predicate: this.pathExpression, resourceValues: `${variables.resource}.values(${this.pathExpression})` } })};`,
      `if (_${this.name}Either.isLeft()) { return _${this.name}Either; }`,
      `const ${this.name} = _${this.name}Either.unsafeCoerce();`,
    ];
  }

  override hashStatements(
    parameters: Parameters<Property<Type>["hashStatements"]>[0],
  ): readonly string[] {
    return this.type.hashStatements(parameters);
  }

  override sparqlGraphPatternExpression(): Maybe<string> {
    return Maybe.of(
      this.type
        .propertySparqlGraphPatternExpression({
          variables: {
            object: `this.variable("${pascalCase(this.name)}")`,
            predicate: this.pathExpression,
            subject: "this.subject",
          },
        })
        .toSparqlGraphPatternExpression()
        .toString(),
    );
  }

  override toRdfStatements({
    variables,
  }: Parameters<Property<Type>["toRdfStatements"]>[0]): readonly string[] {
    return [
      `${variables.resource}.add(${this.pathExpression}, ${this.type.toRdfExpression(
        {
          variables: { ...variables, predicate: this.pathExpression },
        },
      )});`,
    ];
  }
}
