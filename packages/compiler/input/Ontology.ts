import { RdfjsOntology } from "@shaclmate/shacl-ast";
import type { Either, Maybe } from "purify-ts";
import type { TsFeature, TsObjectDeclarationType } from "../enums/index.js";
import { tsFeatures } from "./tsFeatures.js";
import { tsObjectDeclarationType } from "./tsObjectDeclarationType.js";

export class Ontology extends RdfjsOntology {
  get tsFeatures(): Maybe<Set<TsFeature>> {
    return tsFeatures(this.resource);
  }

  get tsObjectDeclarationType(): Either<Error, TsObjectDeclarationType> {
    return tsObjectDeclarationType(this.resource);
  }
}
