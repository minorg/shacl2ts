import { RdfjsOntology } from "@shaclmate/shacl-ast";
import type { Either } from "purify-ts";
import type { TsObjectDeclarationType } from "../enums/index.js";
import { tsObjectDeclarationType } from "./tsObjectDeclarationType.js";

export class Ontology extends RdfjsOntology {
  get tsObjectDeclarationType(): Either<Error, TsObjectDeclarationType> {
    return tsObjectDeclarationType(this.resource);
  }
}
