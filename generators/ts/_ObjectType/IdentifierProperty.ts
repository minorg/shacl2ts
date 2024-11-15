import { Maybe } from "purify-ts";
import {
  type GetAccessorDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type PropertySignatureStructure,
  Scope,
} from "ts-morph";
import { MintingStrategy } from "../../../ast";
import type { IdentifierType } from "../IdentifierType.js";
import { Property } from "./Property.js";

export class IdentifierProperty extends Property<IdentifierType> {
  readonly equalsFunction = "purifyHelpers.Equatable.booleanEquals";
  private readonly mintingStrategy: Maybe<MintingStrategy>;

  constructor({
    mintingStrategy,
    ...superParameters
  }: {
    mintingStrategy: Maybe<MintingStrategy>;
    type: IdentifierType;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.mintingStrategy = mintingStrategy;
  }

  override get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    return Maybe.of({
      hasQuestionToken: this.mintingStrategy.isJust(),
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    });
  }

  override get classGetAccessorDeclaration(): Maybe<
    OptionalKind<GetAccessorDeclarationStructure>
  > {
    if (!this.mintingStrategy.isJust()) {
      return Maybe.empty();
    }

    let mintIdentifier: string;
    switch (this.mintingStrategy.unsafeCoerce()) {
      case MintingStrategy.SHA256:
        mintIdentifier =
          "dataFactory.namedNode(`urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`)";
        break;
      case MintingStrategy.UUIDv4:
        mintIdentifier =
          "dataFactory.namedNode(`urn:shaclmate:object:${this.type}:${uuid.v4()}`)";
        break;
    }

    return Maybe.of({
      name: this.name,
      returnType: this.type.name,
      statements: [
        `if (typeof this._${this.name} === "undefined") { this._${this.name} = ${mintIdentifier}; } return this._${this.name};`,
      ],
    });
  }

  override get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
    if (this.mintingStrategy.isJust()) {
      // Mutable _identifier that will be lazily initialized by the getter
      return {
        name: `_${this.name}`,
        scope: Scope.Private,
        type: `${this.type.name} | undefined`,
      } satisfies OptionalKind<PropertyDeclarationStructure>;
    }
    return {
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    };
  }

  override get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    };
  }

  override classConstructorStatements({
    variables,
  }: Parameters<
    Property<IdentifierType>["classConstructorStatements"]
  >[0]): readonly string[] {
    return [
      `this.${this.mintingStrategy.isJust() ? "_" : ""}${this.name} = ${variables.parameter};`,
    ];
  }

  override fromRdfStatements({
    variables,
  }: Parameters<
    Property<IdentifierType>["fromRdfStatements"]
  >[0]): readonly string[] {
    return [`const ${this.name} = ${variables.resource}.identifier`];
  }

  override hashStatements(
    parameters: Parameters<Property<IdentifierType>["hashStatements"]>[0],
  ): readonly string[] {
    return this.type.hashStatements(parameters);
  }

  override sparqlGraphPatternExpression(): Maybe<string> {
    return Maybe.empty();
  }

  override toRdfStatements(): readonly string[] {
    return [];
  }
}
