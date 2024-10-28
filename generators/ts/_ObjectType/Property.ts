import type {
  OptionalKind,
  PropertyDeclarationStructure,
  PropertySignatureStructure,
} from "ts-morph";
import type { Type } from "../Type.js";

export abstract class Property {
  abstract readonly classConstructorParametersPropertySignature: OptionalKind<PropertySignatureStructure>;
  abstract readonly classPropertyDeclaration: OptionalKind<PropertyDeclarationStructure>;
  abstract readonly equalsFunction: string;
  abstract readonly interfacePropertySignature: OptionalKind<PropertySignatureStructure>;
  abstract readonly interfaceTypeName: string;
  readonly name: string;
  abstract readonly type: Type;

  protected constructor({
    name,
  }: {
    name: string;
  }) {
    this.name = name;
  }

  abstract classConstructorInitializer(
    parameters: Property.ClassConstructorInitializerParameters,
  ): string;

  abstract sparqlGraphPattern(
    parameters: Property.SparqlGraphPatternParameters,
  ): string;

  abstract valueFromRdf(parameters: Property.ValueFromRdfParameters): string;

  abstract valueToRdf(parameters: Property.ValueToRdfParameters): string;
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
