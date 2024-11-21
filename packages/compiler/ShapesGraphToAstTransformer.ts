import type PrefixMap from "@rdfjs/prefix-map/PrefixMap.js";
import TermMap from "@rdfjs/term-map";
import TermSet from "@rdfjs/term-set";
import type * as rdfjs from "@rdfjs/types";
import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import * as shaclAst from "@shaclmate/shacl-ast";
import { type NodeKind, NodeShape, type Shape } from "@shaclmate/shacl-ast";
import { dash, owl, rdf, rdfs } from "@tpluscode/rdf-ns-builders";
import { Either, Left, Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import { invariant } from "ts-invariant";
import type * as ast from "./ast";
import type { ObjectType } from "./ast";
import { MintingStrategy } from "./ast/MintingStrategy";
import { logger } from "./logger.js";
import { shaclmate } from "./vocabularies/";

function ancestorClassIris(
  classResource: Resource,
  maxDepth: number,
): readonly rdfjs.NamedNode[] {
  const ancestorClassIris = new TermSet<rdfjs.NamedNode>();

  function ancestorClassIrisRecursive(
    classResource: Resource,
    depth: number,
  ): void {
    for (const parentClassValue of classResource.values(rdfs.subClassOf)) {
      parentClassValue.toNamedResource().ifRight((parentClassResource) => {
        if (ancestorClassIris.has(parentClassResource.identifier)) {
          return;
        }
        ancestorClassIris.add(parentClassResource.identifier);
        if (depth < maxDepth) {
          ancestorClassIrisRecursive(parentClassResource, depth + 1);
        }
      });
    }
  }

  ancestorClassIrisRecursive(classResource, 1);

  return [...ancestorClassIris];
}

function descendantClassIris(
  classResource: Resource,
  maxDepth: number,
): readonly rdfjs.NamedNode[] {
  const descendantClassIris = new TermSet<rdfjs.NamedNode>();

  function descendantClassIrisRecursive(
    classResource: Resource,
    depth: number,
  ): void {
    for (const childClassValue of classResource.valuesOf(rdfs.subClassOf)) {
      childClassValue.toNamedResource().ifRight((childClassResource) => {
        if (descendantClassIris.has(childClassResource.identifier)) {
          return;
        }
        descendantClassIris.add(childClassResource.identifier);
        if (depth < maxDepth) {
          descendantClassIrisRecursive(childClassResource, depth + 1);
        }
      });
    }
  }

  descendantClassIrisRecursive(classResource, 1);

  return [...descendantClassIris];
}

type NodeShapeAstType =
  | ast.ObjectIntersectionType
  | ast.ObjectType
  | ast.ObjectUnionType;

function shaclmateInline(shape: shaclAst.Shape): Maybe<boolean> {
  return shape.resource
    .value(shaclmate.inline)
    .chain((value) => value.toBoolean())
    .toMaybe();
}

function shaclmateName(shape: shaclAst.Shape): Maybe<string> {
  return shape.resource
    .value(shaclmate.name)
    .chain((value) => value.toString())
    .toMaybe();
}

export class ShapesGraphToAstTransformer {
  private readonly astObjectTypePropertiesByIdentifier: TermMap<
    rdfjs.BlankNode | rdfjs.NamedNode,
    ast.ObjectType.Property
  > = new TermMap();
  private readonly iriPrefixMap: PrefixMap;
  private readonly nodeShapeAstTypesByIdentifier: TermMap<
    rdfjs.BlankNode | rdfjs.NamedNode,
    NodeShapeAstType
  > = new TermMap();
  private readonly shapesGraph: shaclAst.ShapesGraph;

  constructor({
    iriPrefixMap,
    shapesGraph,
  }: {
    iriPrefixMap: PrefixMap;
    shapesGraph: shaclAst.ShapesGraph;
  }) {
    this.iriPrefixMap = iriPrefixMap;
    this.shapesGraph = shapesGraph;
  }

  transform(): Either<Error, ast.Ast> {
    return Either.sequence(
      this.shapesGraph.nodeShapes
        .filter(
          (nodeShape) =>
            nodeShape.resource.identifier.termType === "NamedNode" &&
            !nodeShape.resource.identifier.value.startsWith(dash[""].value),
        )
        .map((nodeShape) => this.nodeShapeAstType(nodeShape)),
    ).map((nodeShapeAstTypes) => ({
      objectIntersectionTypes: nodeShapeAstTypes.filter(
        (nodeShapeAstType) =>
          nodeShapeAstType.kind === "ObjectIntersectionType",
      ),
      objectTypes: nodeShapeAstTypes.filter(
        (nodeShapeAstType) => nodeShapeAstType.kind === "ObjectType",
      ),
      objectUnionTypes: nodeShapeAstTypes.filter(
        (nodeShapeAstType) => nodeShapeAstType.kind === "ObjectUnionType",
      ),
    }));
  }

  /**
   * Is an ast.ObjectType actually the shape of an RDF list?
   * If so, return the type of its rdf:first.
   */
  private astObjectTypeListItemType(
    astObjectType: ast.ObjectType,
    nodeShape: shaclAst.NodeShape,
  ): Either<Error, ast.Type> {
    if (!nodeShape.resource.isSubClassOf(rdf.List)) {
      return Left(new Error(`${nodeShape} is not an rdfs:subClassOf rdf:List`));
    }

    if (astObjectType.properties.length !== 2) {
      return Left(
        new Error(`${nodeShape} does not have exactly two properties`),
      );
    }

    // rdf:first can have any type
    // The type of the rdf:first property is the list item type.
    const firstProperty = astObjectType.properties.find((property) =>
      property.path.iri.equals(rdf.first),
    );
    if (!firstProperty) {
      return Left(
        new Error(`${nodeShape} does not have an rdf:first property`),
      );
    }

    const restProperty = astObjectType.properties.find((property) =>
      property.path.iri.equals(rdf.rest),
    );
    if (!restProperty) {
      return Left(new Error(`${nodeShape} does not have an rdf:rest property`));
    }
    if (restProperty.type.kind !== "UnionType") {
      return Left(new Error(`${nodeShape} rdf:rest property is not sh:or`));
    }
    if (restProperty.type.memberTypes.length !== 2) {
      return Left(
        new Error(
          `${nodeShape} rdf:rest property sh:or does not have exactly two member types`,
        ),
      );
    }
    // rdf:rest should be sh:or ( [ sh:class nodeShape ] [ sh:hasValue rdf:nil ] )
    if (
      !restProperty.type.memberTypes.find(
        (type) =>
          type.kind === "ObjectType" &&
          type.name.identifier.equals(nodeShape.resource.identifier),
      )
    ) {
      return Left(
        new Error(
          `${nodeShape} rdf:rest property sh:or is not recursive into the node shape`,
        ),
      );
    }
    if (
      !restProperty.type.memberTypes.find(
        (type) => type.kind === "IdentifierType",
      )
    ) {
      return Left(
        new Error(
          `${nodeShape} rdf:rest property sh:or does not include sh:hasValue rdf:nil`,
        ),
      );
    }

    return Either.of(firstProperty.type);
  }

  private classAstType(
    classIri: rdfjs.NamedNode,
  ): Either<Error, ast.ObjectType> {
    let nodeShape: Maybe<shaclAst.NodeShape>;
    if (
      classIri.equals(owl.Class) ||
      classIri.equals(owl.Thing) ||
      classIri.equals(rdfs.Class)
    ) {
      nodeShape = Maybe.empty();
    } else {
      nodeShape = this.shapesGraph.nodeShapeByNode(classIri);
    }

    return nodeShape
      .toEither(
        new Error(`${classIri.value} does not correspond to a node shape`),
      )
      .chain((nodeShape) => this.nodeShapeAstType(nodeShape))
      .chain((nodeShapeAstType) =>
        nodeShapeAstType.kind === "ObjectType"
          ? Either.of<Error, ast.ObjectType>(nodeShapeAstType)
          : Left(
              new Error(
                `${classIri.value} corresponds to an intersection or union node shape`,
              ),
            ),
      )
      .ifLeft((error) => {
        logger.debug(
          "class %s did not resolve to an object type: %s",
          classIri.value,
          error.message,
        );
      });
  }

  private nodeShapeAstType(
    nodeShape: shaclAst.NodeShape,
  ): Either<Error, NodeShapeAstType> {
    {
      const type = this.nodeShapeAstTypesByIdentifier.get(
        nodeShape.resource.identifier,
      );
      if (type) {
        return Either.of(type);
      }
    }

    if (
      nodeShape.constraints.and.length > 0 ||
      nodeShape.constraints.or.length > 0
    ) {
      let compositeTypeShapes: readonly Shape[];
      let compositeTypeKind:
        | ast.ObjectIntersectionType["kind"]
        | ast.ObjectUnionType["kind"];
      if (nodeShape.constraints.and.length > 0) {
        compositeTypeShapes = nodeShape.constraints.and;
        compositeTypeKind = "ObjectIntersectionType";
      } else {
        compositeTypeShapes = nodeShape.constraints.or;
        compositeTypeKind = "ObjectUnionType";
      }

      const compositeTypeNodeShapes = compositeTypeShapes.filter(
        (shape) => shape instanceof NodeShape,
      );
      if (compositeTypeNodeShapes.length < 2) {
        return Left(
          new Error(
            `${nodeShape} only has one node shape in its logical constraint`,
          ),
        );
      }

      // Put a placeholder in the cache to deal with cyclic references
      const compositeType = {
        kind: compositeTypeKind,
        memberTypes: [] as ObjectType[],
        name: this.shapeName(nodeShape),
      };

      this.nodeShapeAstTypesByIdentifier.set(
        nodeShape.resource.identifier,
        compositeType,
      );

      compositeType.memberTypes.push(
        ...Either.rights(
          compositeTypeNodeShapes.map((nodeShape) =>
            this.nodeShapeAstType(nodeShape),
          ),
        ).filter((nodeShapeAstType) => nodeShapeAstType.kind === "ObjectType"),
      );
      if (compositeType.memberTypes.length < compositeTypeNodeShapes.length) {
        return Left(
          new Error(
            `${nodeShape} has one or more non-ObjectType node shapes in its logical constraint`,
          ),
        );
      }
      return Either.of(compositeType);
    }

    // https://www.w3.org/TR/shacl/#implicit-targetClass
    // If the node shape is an owl:class or rdfs:Class, make the ObjectType have an rdf:type of the NodeShape.
    const rdfType: Maybe<rdfjs.NamedNode> =
      nodeShape.resource.isInstanceOf(owl.Class) ||
      nodeShape.resource.isInstanceOf(rdfs.Class)
        ? Maybe.of(nodeShape.resource.identifier as rdfjs.NamedNode)
        : Maybe.empty();

    const nodeKinds = new Set<
      shaclAst.NodeKind.BLANK_NODE | shaclAst.NodeKind.IRI
    >(
      [...nodeShape.constraints.nodeKinds].filter(
        (nodeKind) => nodeKind !== shaclAst.NodeKind.LITERAL,
      ),
    );
    if (nodeKinds.size === 0) {
      return Left(new Error(`${nodeShape} has no non-Literal node kinds`));
    }

    // Put a placeholder in the cache to deal with cyclic references
    // If this node shape's properties (directly or indirectly) refer to the node shape itself,
    // we'll return this placeholder.
    const objectType: ast.ObjectType = {
      abstract: nodeShape.resource
        .value(shaclmate.abstract)
        .chain((value) => value.toBoolean())
        .orDefault(false),
      ancestorObjectTypes: [],
      childObjectTypes: [],
      descendantObjectTypes: [],
      export: nodeShape.resource
        .value(shaclmate.export)
        .chain((value) => value.toBoolean())
        .orDefault(true),
      kind: "ObjectType",
      listItemType: Maybe.empty(),
      mintingStrategy: nodeShape.resource
        .value(shaclmate.mintingStrategy)
        .chain((value) => value.toIri())
        .chain((iri) => {
          if (iri.equals(shaclmate.SHA256)) {
            return Either.of(MintingStrategy.SHA256);
          }
          if (iri.equals(shaclmate.UUIDv4)) {
            return Either.of(MintingStrategy.UUIDv4);
          }
          return Left(
            new Error(`unrecognizing minting strategy: ${iri.value}`),
          );
        })
        .toMaybe(),
      name: this.shapeName(nodeShape),
      nodeKinds,
      properties: [], // This is mutable, we'll populate it below.
      rdfType,
      parentObjectTypes: [], // This is mutable, we'll populate it below
    };
    this.nodeShapeAstTypesByIdentifier.set(
      nodeShape.resource.identifier,
      objectType,
    );

    // Populate ancestor and descendant object types
    // Ancestors
    for (const classIri of ancestorClassIris(
      nodeShape.resource,
      Number.MAX_SAFE_INTEGER,
    )) {
      this.classAstType(classIri).ifRight((ancestorObjectType) =>
        objectType.ancestorObjectTypes.push(ancestorObjectType),
      );
    }

    // Parents
    for (const classIri of ancestorClassIris(nodeShape.resource, 1)) {
      this.classAstType(classIri).ifRight((parentObjectType) =>
        objectType.parentObjectTypes.push(parentObjectType),
      );
    }

    // Descendants
    for (const classIri of descendantClassIris(
      nodeShape.resource,
      Number.MAX_SAFE_INTEGER,
    )) {
      this.classAstType(classIri).ifRight((descendantObjectType) =>
        objectType.descendantObjectTypes.push(descendantObjectType),
      );
    }

    // Children
    for (const classIri of descendantClassIris(nodeShape.resource, 1)) {
      this.classAstType(classIri).ifRight((childObjectType) =>
        objectType.childObjectTypes.push(childObjectType),
      );
    }

    // Populate properties
    for (const propertyShape of nodeShape.constraints.properties) {
      const propertyEither =
        this.propertyShapeAstObjectTypeProperty(propertyShape);
      if (propertyEither.isLeft()) {
        logger.warn(
          "error transforming %s %s: %s",
          nodeShape,
          propertyShape,
          (propertyEither.extract() as Error).message,
        );
        continue;
        // return property;
      }
      objectType.properties.push(propertyEither.unsafeCoerce());
    }

    // Is the object type an RDF list?
    objectType.listItemType = this.astObjectTypeListItemType(
      objectType,
      nodeShape,
    ).toMaybe();

    return Either.of(objectType);
  }

  private propertyShapeAstObjectTypeProperty(
    propertyShape: shaclAst.PropertyShape,
  ): Either<Error, ast.ObjectType.Property> {
    {
      const property = this.astObjectTypePropertiesByIdentifier.get(
        propertyShape.resource.identifier,
      );
      if (property) {
        return Either.of(property);
      }
    }

    const type = this.propertyShapeAstType(propertyShape, null);
    if (type.isLeft()) {
      return type;
    }

    const path = propertyShape.path;
    if (path.kind !== "PredicatePath") {
      return Left(
        new Error(`${propertyShape} has non-predicate path, unsupported`),
      );
    }

    const property: ast.ObjectType.Property = {
      inline: shaclmateInline(propertyShape).orDefault(false),
      name: this.shapeName(propertyShape),
      path,
      type: type.extract() as ast.Type,
    };
    this.astObjectTypePropertiesByIdentifier.set(
      propertyShape.resource.identifier,
      property,
    );
    return Either.of(property);
  }

  /**
   * Try to convert a property shape to a type using some heuristics.
   *
   * We don't try to handle exotic cases allowed by the SHACL spec, such as combinations of sh:in and sh:node. Instead we assume
   * a shape has one type.
   */
  private propertyShapeAstType(
    shape: shaclAst.Shape,
    inherited: {
      defaultValue: Maybe<BlankNode | Literal | NamedNode>;
      inline: Maybe<boolean>;
    } | null,
  ): Either<Error, ast.Type> {
    const defaultValue = (
      shape instanceof shaclAst.PropertyShape
        ? shape.defaultValue
        : Maybe.empty()
    ).alt(inherited !== null ? inherited.defaultValue : Maybe.empty());
    const hasValue = shape.constraints.hasValue;
    const inline = shaclmateInline(shape).alt(
      inherited !== null ? inherited.inline : Maybe.empty(),
    );

    return ((): Either<Error, ast.Type> => {
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
            this.propertyShapeAstType(memberShape, {
              defaultValue,
              inline,
            }),
          );
          compositeTypeKind = "IntersectionType";
        } else if (shape.constraints.classes.length > 0) {
          memberTypeEithers = shape.constraints.classes.map((classIri) =>
            this.classAstType(classIri).map((classObjectType) =>
              inline.orDefault(false)
                ? classObjectType
                : {
                    defaultValue: defaultValue.filter(
                      (term) => term.termType !== "Literal",
                    ),
                    hasValue: Maybe.empty(),
                    kind: "IdentifierType",
                    nodeKinds: classObjectType.nodeKinds,
                  },
            ),
          );
          compositeTypeKind = "IntersectionType";
        } else if (shape.constraints.nodes.length > 0) {
          memberTypeEithers = shape.constraints.nodes.map((nodeShape) =>
            this.nodeShapeAstType(nodeShape),
          );
          compositeTypeKind = "IntersectionType";
        } else {
          memberTypeEithers = shape.constraints.or.map((memberShape) =>
            this.propertyShapeAstType(memberShape, {
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

      if (
        // Treat any shape with the constraints in the list as a literal type
        [
          shape.constraints.datatype,
          shape.constraints.maxExclusive,
          shape.constraints.maxInclusive,
          shape.constraints.minExclusive,
          shape.constraints.minInclusive,
        ].some((constraint) => constraint.isJust()) ||
        // Treat any shape with a literal value as a literal type
        hasValue.extractNullable()?.termType === "Literal" ||
        // Treat any shape with a single sh:nodeKind of sh:Literal as a literal type
        (shape.constraints.nodeKinds.size === 1 &&
          shape.constraints.nodeKinds.has(shaclAst.NodeKind.LITERAL))
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

      // Treat any shape with sh:nodeKind blank node or IRI as an identifier type
      const identifierDefaultValue = defaultValue.filter(
        (value) => value.termType !== "Literal",
      );
      const hasIdentifierValue = hasValue.filter(
        (value) => value.termType !== "Literal",
      );
      if (
        hasIdentifierValue.isJust() ||
        identifierDefaultValue.isJust() ||
        (shape.constraints.nodeKinds.size > 0 &&
          shape.constraints.nodeKinds.size <= 2 &&
          !shape.constraints.nodeKinds.has(shaclAst.NodeKind.LITERAL))
      ) {
        const nodeKinds = hasIdentifierValue
          .map((value) => {
            const nodeKinds = new Set<
              shaclAst.NodeKind.BLANK_NODE | shaclAst.NodeKind.IRI
            >();
            switch (value.termType) {
              case "BlankNode":
                nodeKinds.add(shaclAst.NodeKind.BLANK_NODE);
                break;
              case "NamedNode":
                nodeKinds.add(shaclAst.NodeKind.IRI);
                break;
            }
            return nodeKinds;
          })
          .orDefaultLazy(
            () =>
              shape.constraints.nodeKinds as Set<
                shaclAst.NodeKind.BLANK_NODE | shaclAst.NodeKind.IRI
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

  private shapeName(shape: shaclAst.Shape): ast.Name {
    let propertyPath: ast.Name["propertyPath"] = Maybe.empty();
    if (
      shape instanceof shaclAst.PropertyShape &&
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
      shaclmateName: shaclmateName(shape),
    };
  }
}
