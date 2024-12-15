import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import type {
  GetAccessorDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import { PropertyVisibility } from "../../../enums/index.js";
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
    invariant(this.visibility === PropertyVisibility.PUBLIC);
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

  override get classPropertyDeclaration(): Maybe<
    OptionalKind<PropertyDeclarationStructure>
  > {
    return Maybe.of({
      // Work around a ts-morph bug that puts the override keyword before the abstract keyword
      isAbstract: this.abstract && this.override ? undefined : this.abstract,
      hasOverrideKeyword:
        this.abstract && this.override ? undefined : this.override,
      initializer: !this.abstract ? `"${this.value}"` : undefined,
      isReadonly: true,
      leadingTrivia:
        this.abstract && this.override ? "abstract override " : undefined,
      name: this.name,
      type:
        !this.abstract && this.type.name === `"${this.value}"`
          ? undefined
          : this.type.name,
    });
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
