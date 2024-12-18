import { Either, Left } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { TsObjectDeclarationType } from "../enums/index.js";
import { shaclmate } from "../vocabularies/index.js";

export function tsObjectDeclarationType(
  resource: Resource,
): Either<Error, TsObjectDeclarationType> {
  return resource
    .value(shaclmate.tsObjectDeclarationType)
    .chain((value) => value.toIri())
    .chain((iri) => {
      if (iri.equals(shaclmate._TsObjectDeclarationType_Class)) {
        return Either.of("class");
      }
      if (iri.equals(shaclmate._TsObjectDeclarationType_Interface)) {
        return Either.of("interface");
      }
      return Left(
        new Error(`unrecognized tsObjectDeclarationType IRI: ${iri.value}`),
      );
    });
}
