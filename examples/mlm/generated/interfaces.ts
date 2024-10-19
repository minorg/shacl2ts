import type * as rdfjs from "@rdfjs/types";
import type * as purify from "purify-ts";

export interface MachineLearningModel {
  readonly contextWindow: number;
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: MachineLearningModelFamily;
  readonly localIdentifier: string;
  readonly maxTokenOutput: purify.Maybe<number>;
  readonly name: rdfjs.Literal;
  readonly trainingDataCutoff: purify.Maybe<string>;
  readonly url: purify.Maybe<string>;
}

export interface LanguageModel extends MachineLearningModel {}

export interface MachineLearningModelFamily {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly manufacturer: Organization;
  readonly name: rdfjs.Literal;
  readonly url: purify.Maybe<string>;
}

export interface Organization {
  readonly identifier: rdfjs.NamedNode;
  readonly name: rdfjs.Literal;
}
