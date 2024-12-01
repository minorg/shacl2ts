import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { NodeKind } from "@shaclmate/shacl-ast";
import { Either, Left, Maybe } from "purify-ts";
import type { ShapesGraphToAstTransformer } from "../ShapesGraphToAstTransformer.js";
import type * as ast from "../ast/index.js";
import * as input from "../input/index.js";
import { propertyShapeNodeKinds } from "./propertyShapeNodeKinds.js";

/**
 * Try to convert a property shape to an AST IdentifierType using some heuristics.
 */
export function transformPropertyShapeToAstIdentifierType(
  this: ShapesGraphToAstTransformer,
  shape: input.Shape,
  inherited: {
    defaultValue: Maybe<BlankNode | Literal | NamedNode>;
    inline: Maybe<boolean>;
  } | null,
): Either<Error, ast.IdentifierType> {
  // Treat any shape with sh:nodeKind blank node or IRI as an identifier type
  const identifierDefaultValue = (
    shape instanceof input.PropertyShape ? shape.defaultValue : Maybe.empty()
  )
    .alt(inherited !== null ? inherited.defaultValue : Maybe.empty())
    .filter((value) => value.termType !== "Literal");
  const identifierHasValue = shape.constraints.hasValue.filter(
    (value) => value.termType !== "Literal",
  );
  const identifierIn = shape.constraints.in_
    .map((in_) => in_.filter((term) => term.termType !== "Literal"))
    .filter((in_) => in_.length > 0);
  const nodeKinds = propertyShapeNodeKinds(shape);

  if (
    identifierHasValue.isJust() ||
    identifierDefaultValue.isJust() ||
    identifierIn.isJust() ||
    (nodeKinds.size > 0 &&
      nodeKinds.size <= 2 &&
      !nodeKinds.has(NodeKind.LITERAL))
  ) {
    return Either.of({
      defaultValue: identifierDefaultValue,
      hasValue: identifierHasValue,
      kind: "IdentifierType",
      nodeKinds: nodeKinds as Set<NodeKind.BLANK_NODE | NodeKind.IRI>,
    });
  }

  return Left(new Error(`unable to transform ${shape} into an AST type`));
}
