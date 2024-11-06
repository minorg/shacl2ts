import type { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import type { Configuration } from "../Configuration.js";
import type { ObjectType } from "../ObjectType.js";
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

  abstract classConstructorInitializerExpression(parameters: {
    parameter: string;
    objectType: ObjectType;
  }): Maybe<string>;

  abstract fromRdfStatements(parameters: {
    resourceVariable: string;
  }): readonly string[];

  abstract hashStatements(
    parameters: Parameters<Type["hashStatements"]>[0],
  ): readonly string[];

  importStatements(): readonly string[] {
    return [];
  }

  abstract sparqlGraphPatternExpression(): Maybe<string>;

  abstract toRdfStatements(
    parameters: Parameters<Type["toRdfExpression"]>[0],
  ): readonly string[];
}
