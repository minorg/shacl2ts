import type { Resource } from "rdfjs-resource";
import type { Ontology } from "./Ontology.js";

export class RdfjsOntology implements Ontology {
  readonly resource: Resource;

  constructor(resource: Resource) {
    this.resource = resource;
  }

  toString(): string {
    return `Ontology(node=${this.resource.identifier.value})`;
  }
}
