import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { NodeKind } from "@shaclmate/shacl-ast";
import { Either, Left, Maybe } from "purify-ts";
import type { ShapesGraphToAstTransformer } from "../ShapesGraphToAstTransformer.js";
import type * as ast from "../ast/index.js";
import * as input from "../input/index.js";
import { propertyShapeNodeKinds } from "./propertyShapeNodeKinds.js";

/**
 * Try to convert a property shape to an AST LiteralType using some heuristics.
 */
export function transformPropertyShapeToAstLiteralType(
  this: ShapesGraphToAstTransformer,
  shape: input.Shape,
  inherited: {
    defaultValue: Maybe<BlankNode | Literal | NamedNode>;
    inline: Maybe<boolean>;
  } | null,
): Either<Error, ast.LiteralType> {
  const literalDefaultValue = (
    shape instanceof input.PropertyShape ? shape.defaultValue : Maybe.empty()
  )
    .alt(inherited !== null ? inherited.defaultValue : Maybe.empty())
    .filter((term) => term.termType === "Literal");
  const literalHasValue = shape.constraints.hasValue.filter(
    (term) => term.termType === "Literal",
  );
  const literalIn = shape.constraints.in_
    .map((in_) => in_.filter((term) => term.termType === "Literal"))
    .filter((in_) => in_.length > 0);
  const nodeKinds = propertyShapeNodeKinds(shape);

  if (
    [
      // Treat any shape with the constraints in the list as a literal type
      shape.constraints.datatype,
      shape.constraints.maxExclusive,
      shape.constraints.maxInclusive,
      shape.constraints.minExclusive,
      shape.constraints.minInclusive,
    ].some((constraint) => constraint.isJust()) ||
    literalDefaultValue.isJust() ||
    literalHasValue.isJust() ||
    literalIn.isJust() ||
    // Treat any shape with a single sh:nodeKind of sh:Literal as a literal type
    (nodeKinds.size === 1 && nodeKinds.has(NodeKind.LITERAL))
  ) {
    return Either.of<Error, ast.LiteralType>({
      datatype: shape.constraints.datatype,
      defaultValue: literalDefaultValue,
      hasValue: literalHasValue,
      in_: literalIn,
      kind: "LiteralType",
      maxExclusive: shape.constraints.maxExclusive,
      maxInclusive: shape.constraints.maxInclusive,
      minExclusive: shape.constraints.minExclusive,
      minInclusive: shape.constraints.minInclusive,
    });
  }

  return Left(new Error(`unable to transform ${shape} into an AST type`));
}
