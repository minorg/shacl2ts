import { Maybe } from "purify-ts";
import type {
  GetAccessorDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import { Property } from "./Property.js";

export class TypeDiscriminatorProperty extends Property<TypeDiscriminatorProperty.Type> {
  readonly equalsFunction = "purifyHelpers.Equatable.strictEquals";
  readonly value: string;
  private readonly abstract: boolean;
  private readonly override: boolean;

  constructor({
    abstract,
    override,
    value,
    ...superParameters
  }: {
    abstract: boolean;
    override: boolean;
    value: string;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.abstract = abstract;
    this.override = override;
    this.value = value;
  }

  override get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    return Maybe.empty();
  }

  override get classGetAccessorDeclaration(): Maybe<
    OptionalKind<GetAccessorDeclarationStructure>
  > {
    return Maybe.empty();
  }

  override get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
    return {
      isAbstract: this.abstract,
      hasOverrideKeyword: this.override,
      initializer: !this.abstract ? `"${this.value}"` : undefined,
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

  override classConstructorStatements(): readonly string[] {
    return [];
  }

  override fromRdfStatements(): readonly string[] {
    return !this.abstract &&
      this.configuration.objectTypeDeclarationType === "interface"
      ? [`const ${this.name} = "${this.value}" as const`]
      : [];
  }

  override hashStatements(): readonly string[] {
    return [];
  }

  override sparqlGraphPatternExpression(): Maybe<string> {
    return Maybe.empty();
  }

  override toRdfStatements(): readonly string[] {
    return [];
  }
}

export namespace TypeDiscriminatorProperty {
  export interface Type {
    readonly name: string;
  }
}