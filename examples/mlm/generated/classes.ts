import type * as rdfjs from "@rdfjs/types";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";

export class MachineLearningModel {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: MachineLearningModelFamily;
  readonly localIdentifier: string;
  readonly name: rdfjs.Literal;
  readonly trainingDataCutoff: purify.Maybe<string>;
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModel.Parameters) {
    this.description = purify.Maybe.isMaybe(parameters.description)
      ? parameters.description
      : purify.Maybe.fromNullable(parameters.description);
    this.identifier = parameters.identifier;
    this.isVariantOf = parameters.isVariantOf;
    this.localIdentifier = parameters.localIdentifier;
    this.name = parameters.name;
    this.trainingDataCutoff = purify.Maybe.isMaybe(
      parameters.trainingDataCutoff,
    )
      ? parameters.trainingDataCutoff
      : purify.Maybe.fromNullable(parameters.trainingDataCutoff);
    this.url = purify.Maybe.isMaybe(parameters.url)
      ? parameters.url
      : purify.Maybe.fromNullable(parameters.url);
  }

  equals(other: MachineLearningModel): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      description: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      isVariantOf: purifyHelpers.Equatable.equals,
      localIdentifier: purifyHelpers.Equatable.strictEquals,
      name: purifyHelpers.Equatable.booleanEquals,
      trainingDataCutoff: (left, right) => left.equals(right),
      url: (left, right) => left.equals(right),
    });
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
    this.maxTokenOutput = purify.Maybe.isMaybe(parameters.maxTokenOutput)
      ? parameters.maxTokenOutput
      : purify.Maybe.fromNullable(parameters.maxTokenOutput);
  }

  override equals(other: LanguageModel): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        contextWindow: purifyHelpers.Equatable.strictEquals,
        maxTokenOutput: (left, right) => left.equals(right),
      }),
    );
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
    this.description = purify.Maybe.isMaybe(parameters.description)
      ? parameters.description
      : purify.Maybe.fromNullable(parameters.description);
    this.identifier = parameters.identifier;
    this.manufacturer = parameters.manufacturer;
    this.name = parameters.name;
    this.url = purify.Maybe.isMaybe(parameters.url)
      ? parameters.url
      : purify.Maybe.fromNullable(parameters.url);
  }

  equals(
    other: MachineLearningModelFamily,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      description: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      manufacturer: purifyHelpers.Equatable.equals,
      name: purifyHelpers.Equatable.booleanEquals,
      url: (left, right) => left.equals(right),
    });
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

  equals(other: Organization): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      name: purifyHelpers.Equatable.booleanEquals,
    });
  }
}

export namespace Organization {
  export interface Parameters {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;
  }
}
