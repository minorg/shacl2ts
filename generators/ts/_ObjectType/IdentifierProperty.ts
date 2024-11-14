import { Maybe } from "purify-ts";
import {
  type GetAccessorDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type PropertySignatureStructure,
  StructureKind,
} from "ts-morph";
import { MintingStrategy } from "../../../ast";
import type { IdentifierType } from "../IdentifierType.js";
import { Property } from "./Property.js";

export class IdentifierProperty extends Property {
  readonly equalsFunction = "purifyHelpers.Equatable.booleanEquals";
  readonly type: IdentifierType;
  private readonly mintingStrategy: Maybe<MintingStrategy>;

  constructor({
    mintingStrategy,
    type,
    ...superParameters
  }: {
    mintingStrategy: Maybe<MintingStrategy>;
    type: IdentifierType;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.mintingStrategy = mintingStrategy;
    this.type = type;
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

  override get classDeclaration():
    | GetAccessorDeclarationStructure
    | PropertyDeclarationStructure {
    if (this.mintingStrategy.isNothing()) {
      return {
        kind: StructureKind.Property,
        isReadonly: true,
        name: this.name,
        type: this.type.name,
      };
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

    return {
      kind: StructureKind.GetAccessor,
      name: this.name,
      returnType: this.type.name,
      statements: [
        `if (typeof this._${this.name} === "undefined") { this._${this.name} = ${mintIdentifier}; } return this._${this.name};`,
      ],
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
  }: Parameters<Property["classConstructorStatements"]>[0]): readonly string[] {
    return [
      `this.${this.mintingStrategy.isJust() ? "_" : ""}${this.name} = ${variables.parameter};`,
    ];
  }

  override fromRdfStatements({
    variables,
  }: Parameters<Property["fromRdfStatements"]>[0]): readonly string[] {
    return [`const ${this.name} = ${variables.resource}.identifier`];
  }

  override hashStatements(
    parameters: Parameters<Property["hashStatements"]>[0],
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
