import { RdfjsOntology } from "@shaclmate/shacl-ast";
import type { Either, Maybe } from "purify-ts";
import type { TsFeature, TsObjectDeclarationType } from "../enums/index.js";
import { shaclmate } from "../vocabularies/index.js";
import { tsFeatures } from "./tsFeatures.js";
import { tsObjectDeclarationType } from "./tsObjectDeclarationType.js";

export class Ontology extends RdfjsOntology {
  get tsDataFactoryVariable(): Maybe<string> {
    return this.resource
      .value(shaclmate.tsDataFactoryVariable)
      .chain((value) => value.toString())
      .toMaybe();
  }

  get tsFeatures(): Maybe<Set<TsFeature>> {
    return tsFeatures(this.resource);
  }

  get tsImports(): readonly string[] {
    return this.resource
      .values(shaclmate.tsImport)
      .flatMap((value) => value.toString().toMaybe().toList());
  }

  get tsObjectDeclarationType(): Either<Error, TsObjectDeclarationType> {
    return tsObjectDeclarationType(this.resource);
  }
}
