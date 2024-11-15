import { Maybe } from "purify-ts";
import type {
  GetAccessorDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import { Property } from "./Property.js";

export class TypeDiscriminatorProperty extends Property {
  readonly equalsFunction = "purifyHelpers.Equatable.strictEquals";
  readonly type: {
    readonly name: string;
  };
  readonly value: string;
  private readonly override: boolean;

  constructor({
    override,
    type,
    value,
    ...superParameters
  }: {
    override: boolean;
    type: TypeDiscriminatorProperty["type"];
    value: string;
  } & ConstructorParameters<typeof Property>[0]) {
    super(superParameters);
    this.override = override;
    this.type = type;
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
      hasOverrideKeyword: this.override,
      initializer: `"${this.value}"`,
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
    return this.configuration.objectTypeDeclarationType === "interface"
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
