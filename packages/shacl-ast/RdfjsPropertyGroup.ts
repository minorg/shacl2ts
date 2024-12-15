import type { Literal } from "@rdfjs/types";
import { rdfs } from "@tpluscode/rdf-ns-builders";
import type { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import type { PropertyGroup } from "./PropertyGroup.js";

export class RdfjsPropertyGroup implements PropertyGroup {
  constructor(private readonly resource: Resource) {}

  get identifier(): Resource.Identifier {
    return this.resource.identifier;
  }

  get label(): Maybe<Literal> {
    return this.resource
      .value(rdfs.label)
      .chain((value) => value.toLiteral())
      .toMaybe();
  }
}
