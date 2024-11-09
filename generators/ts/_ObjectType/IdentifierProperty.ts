import { camelCase } from "change-case";
import { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import { MintingStrategy } from "../../../ast";
import type { IdentifierType } from "../IdentifierType.js";
import type { ObjectType } from "../ObjectType.js";
import { Property } from "./Property.js";
import { TypeDiscriminatorProperty } from "./TypeDiscriminatorProperty.js";

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
      type: this.type.name(),
    });
  }

  override get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.type.name(),
    };
  }

  override get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.type.name(),
    };
  }

  static classConstructorMintExpression({
    mintingStrategy,
    objectType,
  }: {
    mintingStrategy: Maybe<MintingStrategy>;
    objectType: ObjectType;
  }): Maybe<string> {
    return mintingStrategy.map((mintingStrategy) => {
      switch (mintingStrategy) {
        case MintingStrategy.SHA256: {
          // Mint an IRI by hashing the non-identifier, non-type discriminator properties.
          const hashProperties: string[] = [];
          // If none of the parameters need to be converted to the interface type we can just use the parameters object
          // Otherwise we have to construct an anonymous object with converted values.
          let hashParameters = true;
          for (const property of objectType.properties) {
            if (
              property instanceof IdentifierProperty ||
              property instanceof TypeDiscriminatorProperty
            ) {
              continue;
            }
            const parameter = `parameters.${property.name}`;
            const classConstructorInitializerExpression = property
              .classConstructorInitializerExpression({
                objectType,
                parameter,
              })
              .orDefault("");
            if (classConstructorInitializerExpression.length === 0) {
              continue;
            }
            hashProperties.push(
              `${property.name}: ${classConstructorInitializerExpression}`,
            );
            if (classConstructorInitializerExpression !== parameter) {
              hashParameters = false;
            }
          }

          return `dataFactory.namedNode(\`urn:shaclmate:object:${camelCase(objectType.astName)}:\${${objectType.moduleQualifiedName}.hash(${hashParameters ? "parameters" : `{ ${hashProperties.join(", ")} }`}, sha256.create())}\`)`;
        }
        case MintingStrategy.UUIDv4:
          return `dataFactory.namedNode(\`urn:shaclmate:object:${camelCase(objectType.astName)}:\${uuid.v4()}\`)`;
      }
    });
  }

  override classConstructorInitializerExpression({
    objectType,
    parameter,
  }: Parameters<
    Property["classConstructorInitializerExpression"]
  >[0]): Maybe<string> {
    return IdentifierProperty.classConstructorMintExpression({
      mintingStrategy: this.mintingStrategy,
      objectType,
    })
      .map((mintExpression) => `${parameter} ?? ${mintExpression}`)
      .altLazy(() => Maybe.of(parameter));
  }

  override fromRdfStatements({
    resourceVariable,
  }: Parameters<Property["fromRdfStatements"]>[0]): readonly string[] {
    return [`const ${this.name} = ${resourceVariable}.identifier`];
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
