import { Maybe } from "purify-ts";
import {
  type GetAccessorDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type PropertySignatureStructure,
  Scope,
} from "ts-morph";
import { IriMintingStrategy } from "../../../IriMintingStrategy.js";
import type { IdentifierType } from "../IdentifierType.js";
import { Property } from "./Property.js";

export class IdentifierProperty extends Property<IdentifierType> {
  readonly equalsFunction = "purifyHelpers.Equatable.booleanEquals";
  private readonly iriMintingStrategy: Maybe<IriMintingStrategy>;

  constructor({
    iriMintingStrategy,
    ...superParameters
  }: {
    iriMintingStrategy: Maybe<IriMintingStrategy>;
    type: IdentifierType;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.iriMintingStrategy = iriMintingStrategy;
  }

  override get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    return Maybe.of({
      hasQuestionToken: this.iriMintingStrategy.isJust(),
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    });
  }

  override get classGetAccessorDeclaration(): Maybe<
    OptionalKind<GetAccessorDeclarationStructure>
  > {
    if (!this.iriMintingStrategy.isJust()) {
      return Maybe.empty();
    }

    let mintIdentifier: string;
    switch (this.iriMintingStrategy.unsafeCoerce()) {
      case IriMintingStrategy.SHA256:
        mintIdentifier =
          "dataFactory.namedNode(`urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`)";
        break;
      case IriMintingStrategy.UUIDv4:
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
    if (this.iriMintingStrategy.isJust()) {
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
      `this.${this.iriMintingStrategy.isJust() ? "_" : ""}${this.name} = ${variables.parameter};`,
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
    return this.type.propertyHashStatements(parameters);
  }

  override sparqlGraphPatternExpression(): Maybe<string> {
    return Maybe.empty();
  }

  override toRdfStatements(): readonly string[] {
    return [];
  }
}
