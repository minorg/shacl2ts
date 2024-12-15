import { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { TsFeature } from "../enums/index.js";
import { logger } from "../logger.js";
import { shaclmate } from "../vocabularies/index.js";

export function tsFeatures(resource: Resource): Maybe<Set<TsFeature>> {
  const tsFeatures = new Set<TsFeature>();
  for (const featureIri of resource
    .values(shaclmate.tsFeature)
    .flatMap((value) => value.toIri().toMaybe().toList())) {
    if (featureIri.equals(shaclmate._TsFeature_Equals)) {
      tsFeatures.add("equals");
    } else if (featureIri.equals(shaclmate._TsFeature_FromRdf)) {
      tsFeatures.add("fromRdf");
    } else if (featureIri.equals(shaclmate._TsFeature_Hash)) {
      tsFeatures.add("hash");
    } else if (featureIri.equals(shaclmate._TsFeature_SparqlGraphPatterns)) {
      tsFeatures.add("sparql-graph-patterns");
    } else if (featureIri.equals(shaclmate._TsFeature_ToRdf)) {
      tsFeatures.add("toRdf");
    } else {
      logger.warn(
        "unrecognized shaclmate:tsFeature value: %s",
        featureIri.value,
      );
    }
  }
  return tsFeatures.size > 0 ? Maybe.of(tsFeatures) : Maybe.empty();
}
