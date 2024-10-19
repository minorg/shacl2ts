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
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: MachineLearningModelFamily;
  readonly localIdentifier: string;
  readonly name: rdfjs.Literal;
  readonly trainingDataCutoff: purify.Maybe<string>;
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModel.Parameters) {
    this.description = initZeroOrOneProperty(parameters.description);
    this.identifier = parameters.identifier;
    this.isVariantOf = parameters.isVariantOf;
    this.localIdentifier = parameters.localIdentifier;
    this.name = parameters.name;
    this.trainingDataCutoff = initZeroOrOneProperty(
      parameters.trainingDataCutoff,
    );
    this.url = initZeroOrOneProperty(parameters.url);
  }
}

export namespace MachineLearningModel {
  export interface Parameters {
    readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily;
    readonly localIdentifier: string;
    readonly name: rdfjs.Literal;
    readonly trainingDataCutoff?: purify.Maybe<string> | string;
    readonly url?: purify.Maybe<string> | string;
  }
}

export class LanguageModel extends MachineLearningModel {
  readonly contextWindow: number;
  readonly maxTokenOutput: purify.Maybe<number>;

  constructor(parameters: LanguageModel.Parameters) {
    super(parameters);
    this.contextWindow = parameters.contextWindow;
    this.maxTokenOutput = initZeroOrOneProperty(parameters.maxTokenOutput);
  }
}

export namespace LanguageModel {
  export interface Parameters extends MachineLearningModel.Parameters {
    readonly contextWindow: number;
    readonly maxTokenOutput?: purify.Maybe<number> | number;
  }
}

export class MachineLearningModelFamily {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly manufacturer: Organization;
  readonly name: rdfjs.Literal;
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModelFamily.Parameters) {
    this.description = initZeroOrOneProperty(parameters.description);
    this.identifier = parameters.identifier;
    this.manufacturer = parameters.manufacturer;
    this.name = parameters.name;
    this.url = initZeroOrOneProperty(parameters.url);
  }
}

export namespace MachineLearningModelFamily {
  export interface Parameters {
    readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization;
    readonly name: rdfjs.Literal;
    readonly url?: purify.Maybe<string> | string;
  }
}

export class Organization {
  readonly identifier: rdfjs.NamedNode;
  readonly name: rdfjs.Literal;

  constructor(parameters: Organization.Parameters) {
    this.identifier = parameters.identifier;
    this.name = parameters.name;
  }
}

export namespace Organization {
  export interface Parameters {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;
  }
}
