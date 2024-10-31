import { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import type { IdentifierType } from "../IdentifierType.js";
import { Property } from "./Property.js";

export class IdentifierProperty extends Property {
  readonly equalsFunction = "purifyHelpers.Equatable.booleanEquals";
  readonly type: IdentifierType;

  constructor({
    type,
    ...superParameters
  }: {
    type: IdentifierType;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.type = type;
  }

  override get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    return Maybe.of({
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    });
  }

  override get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
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

  override classConstructorInitializer({
    parameter,
  }: Parameters<Property["classConstructorInitializer"]>[0]): Maybe<string> {
    return Maybe.of(parameter);
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
