import { RdfjsPropertyShape } from "@shaclmate/shacl-ast";
import { Either, Left, type Maybe } from "purify-ts";
import { PropertyVisibility } from "../PropertyVisibility.js";
import { shaclmate } from "../vocabularies/index.js";
import type { NodeShape } from "./NodeShape.js";
import type { Shape } from "./Shape.js";
import { inline } from "./inline.js";
import { shaclmateName } from "./shaclmateName.js";

export class PropertyShape
  extends RdfjsPropertyShape<NodeShape, any, Shape>
  implements Shape
{
  get inline(): Maybe<boolean> {
    return inline.bind(this)();
  }

  get shaclmateName(): Maybe<string> {
    return shaclmateName.bind(this)();
  }

  get visibility(): PropertyVisibility {
    return this.resource
      .value(shaclmate.visibility)
      .chain((value) => value.toIri())
      .chain((iri) => {
        if (iri.equals(shaclmate.Private)) {
          return Either.of(PropertyVisibility.PRIVATE);
        }
        if (iri.equals(shaclmate.Protected)) {
          return Either.of(PropertyVisibility.PROTECTED);
        }
        if (iri.equals(shaclmate.Public)) {
          return Either.of(PropertyVisibility.PUBLIC);
        }
        return Left(new Error(`unknown visibility: ${iri.value}`));
      })
      .orDefault(PropertyVisibility.PUBLIC);
  }
}
