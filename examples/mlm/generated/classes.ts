import type * as rdfjs from "@rdfjs/types";
import * as purify from "purify-ts";
function initZeroOrOneProperty<T>(
  value: purify.Maybe<T> | T | undefined,
): purify.Maybe<T> {
  if (typeof value === "undefined") {
    return purify.Maybe.empty();
  }
  if (typeof value === "object" && purify.Maybe.isMaybe(value)) {
    return value;
  }
  return purify.Maybe.of(value);
}

export class MachineLearningModel {
  readonly contextWindow: number;
  readonly description: purify.Maybe<string>;
  readonly has_identifier: readonly string[];
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: readonly MachineLearningModelFamily[];
  readonly label: readonly rdfjs.Literal[];
  readonly maxTokenOutput: purify.Maybe<string>;
  readonly name: string;
  readonly trainingDataCutoff: readonly string[];
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModel.Parameters) {
    this.contextWindow = parameters.contextWindow;
    this.description = initZeroOrOneProperty(parameters.description);
    this.has_identifier =
      typeof parameters.has_identifier !== "undefined"
        ? parameters.has_identifier
        : [];
    this.identifier = parameters.identifier;
    this.isVariantOf =
      typeof parameters.isVariantOf !== "undefined"
        ? parameters.isVariantOf
        : [];
    this.label =
      typeof parameters.label !== "undefined" ? parameters.label : [];
    this.maxTokenOutput = initZeroOrOneProperty(parameters.maxTokenOutput);
    this.name = parameters.name;
    this.trainingDataCutoff =
      typeof parameters.trainingDataCutoff !== "undefined"
        ? parameters.trainingDataCutoff
        : [];
    this.url = initZeroOrOneProperty(parameters.url);
  }
}

export namespace MachineLearningModel {
  export interface Parameters {
    readonly contextWindow: number;
    readonly description?: purify.Maybe<string> | string;
    readonly has_identifier?: readonly string[];
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf?: readonly MachineLearningModelFamily[];
    readonly label?: readonly rdfjs.Literal[];
    readonly maxTokenOutput?: purify.Maybe<string> | string;
    readonly name: string;
    readonly trainingDataCutoff?: readonly string[];
    readonly url?: purify.Maybe<string> | string;
  }
}

export class LanguageModel extends MachineLearningModel {}

export namespace LanguageModel {
  export interface Parameters extends MachineLearningModel.Parameters {}
}

export class MachineLearningModelFamily {
  readonly description: purify.Maybe<string>;
  readonly identifier: rdfjs.NamedNode;
  readonly label: readonly rdfjs.Literal[];
  readonly name: string;
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModelFamily.Parameters) {
    this.description = initZeroOrOneProperty(parameters.description);
    this.identifier = parameters.identifier;
    this.label =
      typeof parameters.label !== "undefined" ? parameters.label : [];
    this.name = parameters.name;
    this.url = initZeroOrOneProperty(parameters.url);
  }
}

export namespace MachineLearningModelFamily {
  export interface Parameters {
    readonly description?: purify.Maybe<string> | string;
    readonly identifier: rdfjs.NamedNode;
    readonly label?: readonly rdfjs.Literal[];
    readonly name: string;
    readonly url?: purify.Maybe<string> | string;
  }
}
