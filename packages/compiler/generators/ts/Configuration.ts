type Feature =
  | "equals"
  | "fromRdf"
  | "hash"
  | "toRdf"
  | "sparql-graph-patterns";

export class Configuration {
  readonly dataFactoryImport: string;
  readonly dataFactoryVariable: string;
  readonly features: Set<Feature>;
  readonly objectTypeDiscriminatorPropertyName: string;
  readonly objectTypeIdentifierPropertyName: string;

  constructor(parameters?: {
    dataFactoryImport?: string;
    dataFactoryVariable?: string;
    features?: Set<Feature>;
    objectTypeIdentifierPropertyName?: string;
    objectTypeDiscriminatorPropertyName?: string;
  }) {
    this.features = new Set<Feature>(
      parameters?.features ? [...parameters.features] : [],
    );
    this.dataFactoryImport =
      parameters?.dataFactoryImport ?? Configuration.Defaults.dataFactoryImport;
    this.dataFactoryVariable =
      parameters?.dataFactoryVariable ??
      Configuration.Defaults.dataFactoryVariable;
    if (this.features.size === 0) {
      this.features = Configuration.Defaults.features;
    }
    this.objectTypeIdentifierPropertyName =
      parameters?.objectTypeIdentifierPropertyName ??
      Configuration.Defaults.objectTypeIdentifierPropertyName;
    this.objectTypeDiscriminatorPropertyName =
      parameters?.objectTypeDiscriminatorPropertyName ??
      Configuration.Defaults.objectTypeDiscriminatorPropertyName;
  }
}

export namespace Configuration {
  export namespace Defaults {
    export const dataFactoryImport =
      'import { DataFactory as dataFactory } from "n3"';
    export const dataFactoryVariable = "dataFactory";
    export const features: Set<Feature> = new Set([
      "equals",
      "fromRdf",
      "hash",
      "toRdf",
      "sparql-graph-patterns",
    ]);
    export const objectTypeDiscriminatorPropertyName = "type";
    export const objectTypeIdentifierPropertyName = "identifier";
  }
}
