export class Configuration {
  readonly dataFactoryImport: string;
  readonly dataFactoryVariable: string;
  readonly objectTypeDiscriminatorPropertyName: string;
  readonly objectTypeIdentifierPropertyName: string;

  constructor(parameters?: {
    dataFactoryImport?: string;
    dataFactoryVariable?: string;
    objectTypeIdentifierPropertyName?: string;
    objectTypeDiscriminatorPropertyName?: string;
  }) {
    this.dataFactoryImport =
      parameters?.dataFactoryImport ?? Configuration.Defaults.dataFactoryImport;
    this.dataFactoryVariable =
      parameters?.dataFactoryVariable ??
      Configuration.Defaults.dataFactoryVariable;
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
    export const objectTypeDiscriminatorPropertyName = "type";
    export const objectTypeIdentifierPropertyName = "identifier";
  }
}
