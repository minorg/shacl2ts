import { Maybe } from "purify-ts";
import type {
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

  get classConstructorParametersPropertySignature(): Maybe<
    OptionalKind<PropertySignatureStructure>
  > {
    return Maybe.empty();
  }

  get classPropertyDeclaration(): OptionalKind<PropertyDeclarationStructure> {
    return {
      hasOverrideKeyword: this.override,
      initializer: `"${this.value}"`,
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    };
  }

  get interfacePropertySignature(): OptionalKind<PropertySignatureStructure> {
    return {
      isReadonly: true,
      name: this.name,
      type: this.type.name,
    };
  }

  classConstructorInitializer(): Maybe<string> {
    return Maybe.empty();
  }

  fromRdfStatement(): Maybe<string> {
    return Maybe.of(`const ${this.name} = "${this.value}" as const`);
  }

  sparqlGraphPatternExpression(): Maybe<string> {
    return Maybe.empty();
  }

  toRdfStatement(): Maybe<string> {
    return Maybe.empty();
  }
}
