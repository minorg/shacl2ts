import type PrefixMap from "@rdfjs/prefix-map/PrefixMap.js";
import TermMap from "@rdfjs/term-map";
import TermSet from "@rdfjs/term-set";
import type * as rdfjs from "@rdfjs/types";
import base62 from "@sindresorhus/base62";
import { dash, owl, rdfs } from "@tpluscode/rdf-ns-builders";
import { Either, Left, Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import reservedTsIdentifiers_ from "reserved-identifiers";
import * as shaclAst from "shacl-ast";
import { invariant } from "ts-invariant";
import type * as ast from "./ast";
import { logger } from "./logger.js";
import { shacl2ts } from "./vocabularies/";

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

function rdfIdentifierToString(
  identifier: rdfjs.BlankNode | rdfjs.NamedNode,
): string {
  switch (identifier.termType) {
    case "BlankNode":
      return `_:${identifier.value}`;
    case "NamedNode":
      return `<${identifier.value}>`;
  }
}

const reservedTsIdentifiers = reservedTsIdentifiers_({
  includeGlobalProperties: true,
});

function shacl2tsName(shape: shaclAst.Shape): Maybe<string> {
  return shape.resource
    .value(shacl2ts.name)
    .chain((value) => value.toString())
    .toMaybe();
}

// Adapted from https://github.com/sindresorhus/to-valid-identifier , MIT license
function toValidTsIdentifier(value: string): string {
  if (reservedTsIdentifiers.has(value)) {
    // We prefix with underscore to avoid any potential conflicts with the Base62 encoded string.
    return `$_${value}$`;
  }

  return value.replaceAll(
    /\P{ID_Continue}/gu,
    (x) => `$${base62.encodeInteger(x.codePointAt(0)!)}$`,
  );
}

export class ShapesGraphToAstTransformer {
  private readonly astObjectTypePropertiesByIdentifier: TermMap<
    rdfjs.BlankNode | rdfjs.NamedNode,
    ast.ObjectType.Property
  > = new TermMap();
  private readonly astObjectTypesByIdentifier: TermMap<
    rdfjs.BlankNode | rdfjs.NamedNode,
    ast.ObjectType
  > = new TermMap();
  private readonly iriPrefixMap: PrefixMap;
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
        .map((nodeShape) => this.transformNodeShape(nodeShape)),
    ).map((objectTypes) => ({
      objectTypes,
    }));
  }

  private resolveClassObjectType(
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
      .chain((nodeShape) => this.transformNodeShape(nodeShape))
      .ifLeft((error) => {
        logger.debug(
          "class %s did not resolve to an object type: %s",
          classIri.value,
          error.message,
        );
      });
  }

  private shapeName(shape: shaclAst.Shape): ast.Name {
    const identifier = shape.resource.identifier;
    const curie =
      identifier.termType === "NamedNode"
        ? Maybe.fromNullable(this.iriPrefixMap.shrink(identifier)?.value)
        : Maybe.empty();
    const shName = shape.name.map((name) => name.value);
    const shacl2tsName_ = shacl2tsName(shape);

    const tsNameAlternatives: (string | null | undefined)[] = [
      shacl2tsName_.extract(),
      shName.extract()?.replace(" ", "_"),
      curie.map((curie) => curie.replace(":", "_")).extract(),
    ];
    if (
      shape instanceof shaclAst.PropertyShape &&
      shape.path.kind === "PredicatePath"
    ) {
      const pathIri = shape.path.iri;
      const pathCurie = this.iriPrefixMap.shrink(pathIri)?.value;
      if (pathCurie) {
        tsNameAlternatives.push(pathCurie.replace(":", "_"));
      }
      tsNameAlternatives.push(rdfIdentifierToString(pathIri));
    }
    tsNameAlternatives.push(rdfIdentifierToString(identifier));

    return {
      curie,
      identifier,
      shName,
      shacl2tsName: shacl2tsName_,
      tsName: toValidTsIdentifier(
        tsNameAlternatives.find((tsNameAlternative) => !!tsNameAlternative)!,
      ),
    };
  }

  /**
   * Try to convert a shape to a type using some heuristics.
   *
   * We don't try to handle exotic cases allowed by the SHACL spec, such as combinations of sh:in and sh:node. Instead we assume
   * a shape has one type.
   */
  private shapeType(shape: shaclAst.Shape): Either<Error, ast.Type> {
    // if (shape.resource.identifier.value.endsWith("Collection-member")) {
    //   console.info("Debug");
    // }

    const hasValue = shape.constraints.hasValue;

    // Treat any type with sh:node(s) as an sh:and of those node shapes
    if (
      shape.constraints.and.length > 0 ||
      shape.constraints.nodes.length > 0
    ) {
      const typeEithers =
        shape.constraints.and.length > 0
          ? shape.constraints.and.map((shape) => this.shapeType(shape))
          : shape.constraints.nodes.map((shape) => this.shapeType(shape));
      const types = Either.rights(typeEithers);
      switch (types.length) {
        case 0:
          logger.warn(
            "shape %s conjunction did not map to any types successfully",
            shape,
          );
          return typeEithers[0];
        case 1:
          return Either.of(types[0]);
        default:
          return Either.of({
            kind: "And",
            types,
          });
      }
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
        hasValue: hasValue.filter(
          (hasValue) => hasValue.termType === "Literal",
        ),
        kind: "Literal",
        maxExclusive: shape.constraints.maxExclusive,
        maxInclusive: shape.constraints.maxInclusive,
        minExclusive: shape.constraints.minExclusive,
        minInclusive: shape.constraints.minInclusive,
      });
    }

    // Treat any shape with sh:class as an object type
    if (shape.constraints.classes.length > 0) {
      const classObjectTypeEithers = shape.constraints.classes.map((classIri) =>
        this.resolveClassObjectType(classIri),
      );
      const classObjectTypes = Either.rights(classObjectTypeEithers);
      switch (classObjectTypes.length) {
        case 0:
          return classObjectTypeEithers[0];
        case 1:
          return Either.of(classObjectTypes[0]);
        default:
          return Either.of({
            kind: "And",
            types: classObjectTypes,
          });
      }
    }

    // Treat any shape with sh:in as an enum type
    if (shape.constraints.in_.isJust()) {
      return Either.of({
        kind: "Enum",
        members: shape.constraints.in_.extract(),
      });
    }

    // Treat any shape with sh:or as the disjunction of the member shapes.
    if (shape.constraints.or.length > 0) {
      const typeEithers = shape.constraints.or.map((shape) =>
        this.shapeType(shape),
      );
      const types = Either.rights(typeEithers);
      switch (types.length) {
        case 0:
          logger.warn(
            "shape %s disjunction did not map to any types successfully",
            shape,
          );
          return typeEithers[0];
        case 1:
          return Either.of(types[0]);
        default:
          return Either.of({
            kind: "Or",
            types,
          });
      }
    }

    // Treat any shape with sh:nodeKind blank node or IRI as an identifier type
    const hasIdentifierValue = hasValue.filter(
      (value) => value.termType !== "Literal",
    );
    if (
      hasIdentifierValue.isJust() ||
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
        hasValue: hasIdentifierValue,
        kind: "Identifier",
        nodeKinds,
      });
    }

    return Left(new Error(`unable to transform type on ${shape}`));
  }

  private transformNodeShape(
    nodeShape: shaclAst.NodeShape,
  ): Either<Error, ast.ObjectType> {
    {
      const objectType = this.astObjectTypesByIdentifier.get(
        nodeShape.resource.identifier,
      );
      if (objectType) {
        return Either.of(objectType);
      }
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
      ancestorObjectTypes: [],
      childObjectTypes: [],
      descendantObjectTypes: [],
      kind: "Object",
      name: this.shapeName(nodeShape),
      nodeKinds,
      properties: [], // This is mutable, we'll populate it below.
      rdfType,
      parentObjectTypes: [], // This is mutable, we'll populate it below
    };
    this.astObjectTypesByIdentifier.set(
      nodeShape.resource.identifier,
      objectType,
    );

    // Populate ancestor and descendant object types
    // Ancestors
    for (const classIri of ancestorClassIris(
      nodeShape.resource,
      Number.MAX_SAFE_INTEGER,
    )) {
      this.resolveClassObjectType(classIri).ifRight((ancestorObjectType) =>
        objectType.ancestorObjectTypes.push(ancestorObjectType),
      );
    }

    // Parents
    for (const classIri of ancestorClassIris(nodeShape.resource, 1)) {
      this.resolveClassObjectType(classIri).ifRight((parentObjectType) =>
        objectType.parentObjectTypes.push(parentObjectType),
      );
    }

    // Descendants
    for (const classIri of descendantClassIris(
      nodeShape.resource,
      Number.MAX_SAFE_INTEGER,
    )) {
      this.resolveClassObjectType(classIri).ifRight((descendantObjectType) =>
        objectType.descendantObjectTypes.push(descendantObjectType),
      );
    }

    // Children
    for (const classIri of descendantClassIris(nodeShape.resource, 1)) {
      this.resolveClassObjectType(classIri).ifRight((childObjectType) =>
        objectType.childObjectTypes.push(childObjectType),
      );
    }

    // Populate properties
    const propertiesByTsName: Record<string, ast.ObjectType.Property> = {};
    for (const propertyShape of nodeShape.constraints.properties) {
      const propertyEither = this.transformPropertyShape(propertyShape);
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
      const property = propertyEither.unsafeCoerce();
      if (propertiesByTsName[property.name.tsName]) {
        logger.warn(
          "error transforming %s %s: duplicate property TypeScript name %s",
          nodeShape,
          propertyShape,
          property.name.tsName,
        );
      }
      objectType.properties.push(property);
      propertiesByTsName[property.name.tsName] = property;
    }

    return Either.of(objectType);
  }

  private transformPropertyShape(
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

    const type = this.shapeType(propertyShape);
    if (type.isLeft()) {
      return type;
    }

    const path = propertyShape.path;
    if (path.kind !== "PredicatePath") {
      return Left(
        new Error(`${propertyShape} has non-predicate path, unsupported`),
      );
    }

    const minCount = propertyShape.constraints.minCount
      .filter((minCount) => minCount >= 0)
      .orDefault(0);

    const property: ast.ObjectType.Property = {
      inline: propertyShape.resource
        .value(shacl2ts.inline)
        .chain((value) => value.toBoolean())
        .orDefaultLazy(() => {
          switch ((type.extract() as ast.Type).kind) {
            case "And":
            case "Object":
            case "Or":
              return false;
            case "Enum":
            case "Identifier":
            case "Literal":
              return true;
          }
        }),
      maxCount: propertyShape.constraints.maxCount.filter(
        (maxCount) => maxCount >= minCount,
      ),
      minCount,
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
}
