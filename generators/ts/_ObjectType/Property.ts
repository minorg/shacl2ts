import type { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import type { Type } from "../Type.js";

export abstract class Property {
  abstract readonly classConstructorParametersPropertySignature: Maybe<
    OptionalKind<PropertySignatureStructure>
  >;
  abstract readonly classPropertyDeclaration: OptionalKind<PropertyDeclarationStructure>;
  abstract readonly equalsFunction: string;
  abstract readonly interfacePropertySignature: OptionalKind<PropertySignatureStructure>;
  readonly name: string;

  protected constructor({
    name,
  }: {
    name: string;
  }) {
    this.name = name;
  }

  abstract classConstructorInitializer(
    parameters: Property.ClassConstructorInitializerParameters,
  ): Maybe<string>;

  abstract sparqlGraphPattern(
    parameters: Property.SparqlGraphPatternParameters,
  ): Maybe<string>;

  abstract valueFromRdf(
    parameters: Property.ValueFromRdfParameters,
  ): Maybe<string>;

  abstract valueToRdf(parameters: Property.ValueToRdfParameters): Maybe<string>;
}

export namespace Property {
  export interface ClassConstructorInitializerParameters {
    parameter: string;
  }

  export interface SparqlGraphPatternParameters {
    dataFactoryVariable: string;
  }

  export interface ValueFromRdfParameters {
    dataFactoryVariable: string;
    resourceVariable: string;
  }

  export type ValueToRdfParameters = Type.ValueToRdfParameters;
}
