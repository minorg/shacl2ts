import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { NodeKind } from "@shaclmate/shacl-ast";
import { owl, rdfs } from "@tpluscode/rdf-ns-builders";
import { Either, Left, Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import type { ShapesGraphToAstTransformer } from "../ShapesGraphToAstTransformer.js";
import type * as ast from "../ast/index.js";
import * as input from "../input/index.js";
import { logger } from "../logger.js";

/**
 * Try to convert a property shape to a type using some heuristics.
 *
 * We don't try to handle exotic cases allowed by the SHACL spec, such as combinations of sh:in and sh:node. Instead we assume
 * a shape has one type.
 */
export function transformPropertyShapeToAstType(
  this: ShapesGraphToAstTransformer,
  shape: input.Shape,
  inherited: {
    defaultValue: Maybe<BlankNode | Literal | NamedNode>;
    inline: Maybe<boolean>;
  } | null,
): Either<Error, ast.Type> {
  const defaultValue = (
    shape instanceof input.PropertyShape ? shape.defaultValue : Maybe.empty()
  ).alt(inherited !== null ? inherited.defaultValue : Maybe.empty());

  return ((): Either<Error, ast.Type> => {
    const hasValue = shape.constraints.hasValue;
    const inline = shape.inline.alt(
      inherited !== null ? inherited.inline : Maybe.empty(),
    );

    // Conjunctions/disjunctions of multiple types
    if (
      shape.constraints.and.length > 0 ||
      shape.constraints.classes.length > 0 ||
      shape.constraints.nodes.length > 0 ||
      shape.constraints.or.length > 0
    ) {
      let memberTypeEithers: readonly Either<Error, ast.Type>[];
      let compositeTypeKind: "IntersectionType" | "UnionType";
      if (shape.constraints.and.length > 0) {
        memberTypeEithers = shape.constraints.and.map((memberShape) =>
          this.transformPropertyShapeToAstType(memberShape, {
            defaultValue,
            inline,
          }),
        );
        compositeTypeKind = "IntersectionType";
      } else if (shape.constraints.classes.length > 0) {
        memberTypeEithers = shape.constraints.classes.map((classIri) => {
          if (
            classIri.equals(owl.Class) ||
            classIri.equals(owl.Thing) ||
            classIri.equals(rdfs.Class)
          ) {
            return Left(
              new Error(`class ${classIri.value} is not transformable`),
            );
          }

          const classNodeShape = this.shapesGraph
            .nodeShapeByNode(classIri)
            .extractNullable();
          if (classNodeShape === null) {
            return Left(
              new Error(
                `class ${classIri.value} did not resolve to a node shape`,
              ),
            );
          }
          const classAstTypeEither =
            this.transformNodeShapeToAstType(classNodeShape);
          if (classAstTypeEither.isLeft()) {
            return classAstTypeEither;
          }
          const classAstType = classAstTypeEither.unsafeCoerce();
          if (classAstType.kind !== "ObjectType") {
            return Left(
              new Error(
                `class ${classIri.value} was transformed into a non-ObjectType`,
              ),
            );
          }
          const classObjectType: ast.ObjectType = classAstType;

          if (inline.orDefault(false)) {
            return Either.of(classObjectType);
          }

          return Either.of({
            defaultValue: defaultValue.filter(
              (term) => term.termType !== "Literal",
            ),
            hasValue: Maybe.empty(),
            kind: "IdentifierType",
            nodeKinds: classObjectType.nodeKinds,
          });
        });
        compositeTypeKind = "IntersectionType";
      } else if (shape.constraints.nodes.length > 0) {
        memberTypeEithers = shape.constraints.nodes.map((nodeShape) =>
          this.transformNodeShapeToAstType(nodeShape),
        );
        compositeTypeKind = "IntersectionType";
      } else {
        memberTypeEithers = shape.constraints.or.map((memberShape) =>
          this.transformPropertyShapeToAstType(memberShape, {
            defaultValue,
            inline,
          }),
        );
        compositeTypeKind = "UnionType";
      }
      invariant(memberTypeEithers.length > 0);

      const memberTypes = Either.rights(memberTypeEithers);
      if (memberTypes.length !== memberTypeEithers.length) {
        logger.warn(
          "shape %s composition did not map all member types successfully",
          shape,
        );
        return memberTypeEithers[0];
      }
      invariant(memberTypes.length > 0);

      if (memberTypes.length === 1) {
        return Either.of(memberTypes[0]);
      }

      // Get the type underlying a set or option
      const memberItemTypes = memberTypes.map((memberType) => {
        switch (memberType.kind) {
          case "SetType":
            return memberType.itemType;
          case "OptionType":
            return memberType.itemType;
          default:
            return memberType;
        }
      });

      if (
        hasValue.isNothing() &&
        memberItemTypes.every(
          (memberItemType) =>
            memberItemType.kind === "LiteralType" &&
            memberItemType.maxExclusive.isNothing() &&
            memberItemType.maxInclusive.isNothing() &&
            memberItemType.minExclusive.isNothing() &&
            memberItemType.minInclusive.isNothing(),
        )
      ) {
        // Special case: all the member types are Literals without further constraints,
        // like dash:StringOrLangString
        return Either.of({
          datatype: Maybe.empty(),
          defaultValue: defaultValue.filter(
            (term) => term.termType === "Literal",
          ),
          hasValue: Maybe.empty(),
          kind: "LiteralType",
          maxExclusive: Maybe.empty(),
          maxInclusive: Maybe.empty(),
          minExclusive: Maybe.empty(),
          minInclusive: Maybe.empty(),
        });
      }

      if (
        hasValue.isNothing() &&
        memberItemTypes.every(
          (memberItemType) => memberItemType.kind === "IdentifierType",
        )
      ) {
        // Special case: all member types are blank or named nodes without further constraints
        return Either.of({
          defaultValue: defaultValue.filter(
            (term) => term.termType !== "Literal",
          ),
          hasValue: Maybe.empty(),
          kind: "IdentifierType",
          nodeKinds: new Set<NodeKind.BLANK_NODE | NodeKind.IRI>(
            memberItemTypes
              .filter(
                (memberItemType) => memberItemType.kind === "IdentifierType",
              )
              .flatMap((memberItemType) => [...memberItemType.nodeKinds]),
          ),
        });
      }

      return Either.of({
        kind: compositeTypeKind,
        memberTypes: memberTypes,
      });
    }

    // Infer nodeKind(s) from various sources

    // Literal type
    {
      const literalDefaultValue = defaultValue.filter(
        (term) => term.termType === "Literal",
      );
      const literalHasValue = hasValue.filter(
        (term) => term.termType === "Literal",
      );
      const literalIn = shape.constraints.in_
        .map((in_) => in_.filter((term) => term.termType === "Literal"))
        .filter((in_) => in_.length > 0);

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
        (shape.constraints.nodeKinds.size === 1 &&
          shape.constraints.nodeKinds.has(NodeKind.LITERAL))
      ) {
        return Either.of<Error, ast.LiteralType>({
          datatype: shape.constraints.datatype,
          defaultValue: defaultValue.filter(
            (term) => term.termType === "Literal",
          ),
          hasValue: hasValue.filter((term) => term.termType === "Literal"),
          kind: "LiteralType",
          maxExclusive: shape.constraints.maxExclusive,
          maxInclusive: shape.constraints.maxInclusive,
          minExclusive: shape.constraints.minExclusive,
          minInclusive: shape.constraints.minInclusive,
        });
      }
    }

    // Identifier type
    {
      // Treat any shape with sh:nodeKind blank node or IRI as an identifier type
      const identifierDefaultValue = defaultValue.filter(
        (value) => value.termType !== "Literal",
      );
      const hasIdentifierValue = hasValue.filter(
        (value) => value.termType !== "Literal",
      );
      const identifierIn = shape.constraints.in_
        .map((in_) => in_.filter((term) => term.termType !== "Literal"))
        .filter((in_) => in_.length > 0);

      if (
        hasIdentifierValue.isJust() ||
        identifierDefaultValue.isJust() ||
        identifierIn.isJust() ||
        (shape.constraints.nodeKinds.size > 0 &&
          shape.constraints.nodeKinds.size <= 2 &&
          !shape.constraints.nodeKinds.has(NodeKind.LITERAL))
      ) {
        const nodeKinds = hasIdentifierValue
          .map((value) => {
            const nodeKinds = new Set<NodeKind.BLANK_NODE | NodeKind.IRI>();
            switch (value.termType) {
              case "BlankNode":
                nodeKinds.add(NodeKind.BLANK_NODE);
                break;
              case "NamedNode":
                nodeKinds.add(NodeKind.IRI);
                break;
            }
            return nodeKinds;
          })
          .orDefaultLazy(
            () =>
              shape.constraints.nodeKinds as Set<
                NodeKind.BLANK_NODE | NodeKind.IRI
              >,
          );
        invariant(nodeKinds.size > 0);

        return Either.of({
          defaultValue: identifierDefaultValue,
          hasValue: hasIdentifierValue,
          kind: "IdentifierType",
          nodeKinds,
        });
      }
    }

    return Left(new Error(`unable to transform type on ${shape}`));
  })().map((itemType) => {
    // Handle cardinality constraints

    if (defaultValue.isJust()) {
      // Ignore other cardinality constraints if there's a default value and treat the type as minCount=maxCount=1
      return itemType;
    }

    const maxCount = shape.constraints.maxCount;
    const minCount = shape.constraints.minCount;

    if (maxCount.isNothing() && minCount.isNothing()) {
      // The shape has no cardinality constraints
      if (inherited === null) {
        // The shape is top-level (not an sh:or/sh:and of a top-level shape)
        // Treat it as a Set, the default in RDF.
        // We want Set to be the outermost type unless it's explicitly requested with sh:minCount 0.
        return {
          itemType,
          kind: "SetType",
          minCount: 0,
        };
      }
      // else the shape is not top-level
      // We want Set to be the outermost type, so just return the itemType here
      return itemType;
    }

    if (minCount.orDefault(0) === 0 && maxCount.extractNullable() === 1) {
      return {
        itemType,
        kind: "OptionType",
      };
    }

    if (minCount.orDefault(0) === 1 && maxCount.extractNullable() === 1) {
      return itemType;
    }

    invariant(minCount.isJust() || maxCount.isJust());
    // There are cardinality constraints for a Set. It may be an inner type.
    return {
      itemType,
      kind: "SetType",
      minCount: minCount.orDefault(0),
    };
  });
}
