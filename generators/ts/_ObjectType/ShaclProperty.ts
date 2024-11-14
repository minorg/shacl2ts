import type * as rdfjs from "@rdfjs/types";
import { pascalCase } from "change-case";
import { Maybe } from "purify-ts";
import {
  type OptionalKind,
  type PropertyDeclarationStructure,
  type PropertySignatureStructure,
  StructureKind,
} from "ts-morph";
import { Memoize } from "typescript-memoize";
import type { Type } from "../Type.js";
import { Property } from "./Property.js";

export class ShaclProperty extends Property {
  readonly type: Type;
  private readonly path: rdfjs.NamedNode;

  constructor({
    path,
    type,
    ...superParameters
  }: {
    path: rdfjs.NamedNode;
    type: Type;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.path = path;
    this.type = type;
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

  override get classDeclaration(): PropertyDeclarationStructure {
    return {
      isReadonly: true,
      kind: StructureKind.Property,
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
  }: Parameters<Property["classConstructorStatements"]>[0]): readonly string[] {
    const statements: string[] = [];
    for (const conversion of this.type.conversions) {
      statements.push(
        `${statements.length > 0 ? " else " : ""}if (${conversion.sourceTypeCheckExpression ? conversion.sourceTypeCheckExpression(variables.parameter) : `typeof ${variables.parameter} === ${conversion.sourceTypeName}`}) { this.${this.name} = ${conversion.conversionExpression(variables.parameter)}; }`,
      );
    }
    const elseStatement = `this.${this.name} = ${variables.parameter};`;
    if (statements.length > 0) {
      statements.push(` else { ${elseStatement} }`);
    } else {
      statements.push(elseStatement);
    }
    return [statements.join(" ")];
  }

  override fromRdfStatements({
    variables,
  }: Parameters<Property["fromRdfStatements"]>[0]): readonly string[] {
    return [
      `const _${this.name}Either: purify.Either<rdfjsResource.Resource.ValueError, ${this.type.name}> = ${this.type.fromRdfResourceExpression({ variables: { ...variables, predicate: this.pathExpression } })};`,
      `if (_${this.name}Either.isLeft()) { return _${this.name}Either; }`,
      `const ${this.name} = _${this.name}Either.unsafeCoerce();`,
    ];
  }

  override hashStatements(
    parameters: Parameters<Property["hashStatements"]>[0],
  ): readonly string[] {
    return this.type.hashStatements(parameters);
  }

  override sparqlGraphPatternExpression(): Maybe<string> {
    let expression = `sparqlBuilder.GraphPattern.basic(this.subject, ${this.pathExpression}, this.variable("${pascalCase(this.name)}"))`;
    this.type
      .sparqlGraphPatternExpression({
        variables: { subject: this.name },
      })
      .ifJust((typeSparqlGraphPatternExpression) => {
        expression = `sparqlBuilder.GraphPattern.group(${expression}.chainObject(${this.name} => ${typeSparqlGraphPatternExpression.toSparqlGraphPatternsExpression()})`;
      });
    return Maybe.of(expression);
  }

  override toRdfStatements({
    variables,
  }: Parameters<Property["toRdfStatements"]>[0]): readonly string[] {
    return [
      `${variables.resource}.add(${this.pathExpression}, ${this.type.toRdfExpression(
        {
          variables: { ...variables, predicate: this.pathExpression },
        },
      )})`,
    ];
  }
}
