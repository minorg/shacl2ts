import type * as rdfjs from "@rdfjs/types";
import type * as purify from "purify-ts";

export interface MachineLearningModel {
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
}

export interface LanguageModel extends MachineLearningModel {}

export interface MachineLearningModelFamily {
  readonly description: purify.Maybe<string>;
  readonly identifier: rdfjs.NamedNode;
  readonly label: readonly rdfjs.Literal[];
  readonly name: string;
  readonly url: purify.Maybe<string>;
}
