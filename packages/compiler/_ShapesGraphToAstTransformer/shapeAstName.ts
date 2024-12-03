import { Maybe } from "purify-ts";
import type { ShapesGraphToAstTransformer } from "../ShapesGraphToAstTransformer.js";
import type * as ast from "../ast/index.js";
import * as input from "../input/index.js";

export function shapeAstName(
  this: ShapesGraphToAstTransformer,
  shape: input.Shape,
): ast.Name {
  let propertyPath: ast.Name["propertyPath"] = Maybe.empty();
  if (
    shape instanceof input.PropertyShape &&
    shape.path.kind === "PredicatePath"
  ) {
    const pathIri = shape.path.iri;
    propertyPath = Maybe.of({
      curie: Maybe.fromNullable(this.iriPrefixMap.shrink(pathIri)?.value),
      identifier: pathIri,
    });
  }

  return {
    curie:
      shape.resource.identifier.termType === "NamedNode"
        ? Maybe.fromNullable(
            this.iriPrefixMap.shrink(shape.resource.identifier)?.value,
          )
        : Maybe.empty(),
    identifier: shape.resource.identifier,
    propertyPath,
    shName: shape.name.map((name) => name.value),
    shaclmateName: shape.shaclmateName,
  };
}
