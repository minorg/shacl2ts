import type * as rdfjs from "@rdfjs/types";
import * as purify from "purify-ts";

export class MachineLearningModel {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: MachineLearningModelFamily;
  readonly localIdentifier: string;
  readonly name: rdfjs.Literal;
  readonly trainingDataCutoff: purify.Maybe<string>;
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModel.Parameters) {
    this.description =
      typeof parameters.description === "undefined"
        ? purify.Maybe.empty()
        : typeof parameters.description === "object" &&
            purify.Maybe.isMaybe(parameters.description)
          ? parameters.description
          : purify.Maybe.of(parameters.description);
    this.identifier = parameters.identifier;
    this.isVariantOf = parameters.isVariantOf;
    this.localIdentifier = parameters.localIdentifier;
    this.name = parameters.name;
    this.trainingDataCutoff =
      typeof parameters.trainingDataCutoff === "undefined"
        ? purify.Maybe.empty()
        : typeof parameters.trainingDataCutoff === "object" &&
            purify.Maybe.isMaybe(parameters.trainingDataCutoff)
          ? parameters.trainingDataCutoff
          : purify.Maybe.of(parameters.trainingDataCutoff);
    this.url =
      typeof parameters.url === "undefined"
        ? purify.Maybe.empty()
        : typeof parameters.url === "object" &&
            purify.Maybe.isMaybe(parameters.url)
          ? parameters.url
          : purify.Maybe.of(parameters.url);
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
    this.maxTokenOutput =
      typeof parameters.maxTokenOutput === "undefined"
        ? purify.Maybe.empty()
        : typeof parameters.maxTokenOutput === "object" &&
            purify.Maybe.isMaybe(parameters.maxTokenOutput)
          ? parameters.maxTokenOutput
          : purify.Maybe.of(parameters.maxTokenOutput);
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
    this.description =
      typeof parameters.description === "undefined"
        ? purify.Maybe.empty()
        : typeof parameters.description === "object" &&
            purify.Maybe.isMaybe(parameters.description)
          ? parameters.description
          : purify.Maybe.of(parameters.description);
    this.identifier = parameters.identifier;
    this.manufacturer = parameters.manufacturer;
    this.name = parameters.name;
    this.url =
      typeof parameters.url === "undefined"
        ? purify.Maybe.empty()
        : typeof parameters.url === "object" &&
            purify.Maybe.isMaybe(parameters.url)
          ? parameters.url
          : purify.Maybe.of(parameters.url);
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
