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

  protected constructor({
    configuration,
    name,
  }: Property.ConstructorParameters) {
    this.configuration = configuration;
    this.name = name;
  }

  abstract classConstructorInitializer(
    parameters: Property.ClassConstructorInitializerParameters,
  ): Maybe<string>;

  abstract sparqlGraphPatternExpression(): Maybe<string>;

  abstract valueFromRdfStatement(
    parameters: Property.ValueFromRdfParameters,
  ): Maybe<string>;

  abstract valueToRdfStatement(
    parameters: Property.ValueToRdfParameters,
  ): Maybe<string>;
}

export namespace Property {
  export interface ConstructorParameters {
    configuration: Configuration;
    name: string;
  }

  export interface ClassConstructorInitializerParameters {
    parameter: string;
  }

  export interface ValueFromRdfParameters {
    resourceVariable: string;
  }

  export type ValueToRdfParameters = Type.ValueToRdfParameters;
}
