import type { Maybe } from "purify-ts";
import type {
  GetAccessorDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import type { Configuration } from "../Configuration.js";
import type { Type } from "../Type.js";

export abstract class Property<TypeT extends { readonly name: string }> {
  abstract readonly classConstructorParametersPropertySignature: Maybe<
    OptionalKind<PropertySignatureStructure>
  >;
  abstract readonly classGetAccessorDeclaration: Maybe<
    OptionalKind<GetAccessorDeclarationStructure>
  >;
  abstract readonly classPropertyDeclaration: OptionalKind<PropertyDeclarationStructure>;
  abstract readonly equalsFunction: string;
  abstract readonly interfacePropertySignature: OptionalKind<PropertySignatureStructure>;
  readonly name: string;
  readonly type: TypeT;
  protected readonly configuration: Configuration;

  constructor({
    configuration,
    name,
    type,
  }: {
    configuration: Configuration;
    name: string;
    type: TypeT;
  }) {
    this.configuration = configuration;
    this.name = name;
    this.type = type;
  }

  get importStatements(): readonly string[] {
    return [];
  }

  abstract classConstructorStatements(parameters: {
    variables: {
      parameter: string;
    };
  }): readonly string[];

  abstract fromRdfStatements(parameters: {
    variables: {
      resource: string;
    };
  }): readonly string[];

  abstract hashStatements(
    parameters: Parameters<Type["hashStatements"]>[0],
  ): readonly string[];

  abstract sparqlGraphPatternExpression(): Maybe<string>;

  abstract toRdfStatements(parameters: {
    variables: Omit<
      Parameters<Type["toRdfExpression"]>[0]["variables"],
      "predicate"
    >;
  }): readonly string[];
}
