import { Maybe } from "purify-ts";

type Feature =
  | "class"
  | "equals"
  | "fromRdf"
  | "toRdf"
  | "sparql-graph-patterns";

export class Configuration {
  readonly features: Set<Feature>;
  readonly typeDiscriminatorPropertyName: Maybe<string>;

  constructor(parameters?: {
    features?: Set<Feature>;
    typeDiscriminatorPropertyName?: string;
  }) {
    this.features = new Set<Feature>(
      parameters?.features ? [...parameters.features] : [],
    );
    if (this.features.size === 0) {
      this.features.add("class");
      this.features.add("equals");
      this.features.add("fromRdf");
      this.features.add("toRdf");
      this.features.add("sparql-graph-patterns");
    }
    this.typeDiscriminatorPropertyName = Maybe.fromNullable(
      parameters?.typeDiscriminatorPropertyName,
    );
  }
}
