import type { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import type { Configuration } from "../Configuration.js";
import type { Type } from "../Type.js";

export abstract class Property {
  abstract readonly classConstructorParametersPropertySignature: Maybe<
    OptionalKind<PropertySignatureStructure>
  >;
  abstract readonly classPropertyDeclaration: OptionalKind<PropertyDeclarationStructure>;
  abstract readonly equalsFunction: string;
  abstract readonly interfacePropertySignature: OptionalKind<PropertySignatureStructure>;
  readonly name: string;
  protected readonly configuration: Configuration;

  constructor({
    configuration,
    name,
  }: {
    configuration: Configuration;
    name: string;
  }) {
    this.configuration = configuration;
    this.name = name;
  }

  abstract classConstructorInitializer(parameters: {
    parameter: string;
  }): Maybe<string>;

  abstract fromRdfStatement(parameters: {
    resourceVariable: string;
  }): Maybe<string>;

  abstract hashStatement(parameters: { hasherVariable: string }): string;

  abstract sparqlGraphPatternExpression(): Maybe<string>;

  abstract toRdfStatement(
    parameters: Parameters<Type["toRdfExpression"]>[0],
  ): Maybe<string>;
}
