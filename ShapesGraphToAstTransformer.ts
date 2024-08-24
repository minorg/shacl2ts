import type PrefixMap from "@rdfjs/prefix-map/PrefixMap.js";
import TermMap from "@rdfjs/term-map";
import type { BlankNode, NamedNode } from "@rdfjs/types";
import base62 from "@sindresorhus/base62";
import { rdfs } from "@tpluscode/rdf-ns-builders";
import { Either, Left, Maybe } from "purify-ts";
import reservedTsIdentifiers_ from "reserved-identifiers";
import {
  type NodeShape,
  PropertyShape,
  Shape,
  type ShapesGraph,
} from "shacl-ast";
import type { Name, ObjectType, Property, Type } from "./ast";
import type { Ast } from "./ast/Ast.js";
import { logger } from "./logger.js";
import { shacl2ts } from "./vocabularies/";

const reservedTsIdentifiers = reservedTsIdentifiers_({
  includeGlobalProperties: true,
});

function rdfIdentifierToString(identifier: BlankNode | NamedNode): string {
  switch (identifier.termType) {
    case "BlankNode":
      return `_:${identifier.value}`;
    case "NamedNode":
      return `<${identifier.value}>`;
  }
}

class ShapeWrapper extends Shape {
  constructor(private readonly delegate: Shape) {
    super({ node: delegate.node, shapesGraph: delegate.shapesGraph });
  }

  get constraints() {
    return this.delegate.constraints;
  }

  get shacl2tsName(): Maybe<string> {
    return this.findAndMapObject(shacl2ts.name, (term) =>
      term.termType === "Literal" ? Maybe.of(term.value) : Maybe.empty(),
    );
  }
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
  private readonly iriPrefixMap: PrefixMap;
  private readonly objectTypesByIdentifier: TermMap<
    BlankNode | NamedNode,
    ObjectType
  > = new TermMap();
  private readonly propertiesByIdentifier: TermMap<
    BlankNode | NamedNode,
    Property
  > = new TermMap();
  private readonly shapesGraph: ShapesGraph;

  constructor({
    iriPrefixMap,
    shapesGraph,
  }: {
    iriPrefixMap: PrefixMap;
    shapesGraph: ShapesGraph;
  }) {
    this.iriPrefixMap = iriPrefixMap;
    this.shapesGraph = shapesGraph;
  }

  private classNodeShapes(class_: NamedNode): readonly NodeShape[] {
    const classNodeShapes: NodeShape[] = [];

    // Is the class itself a node shape?
    const classNodeShape = this.shapesGraph
      .nodeShapeByNode(class_)
      .extractNullable();
    if (classNodeShape !== null) {
      classNodeShapes.push(classNodeShape);
    }

    // Get the node shapes of any of the class's superclasses
    for (const quad of this.shapesGraph.dataset.match(
      class_,
      rdfs.subClassOf,
      null,
      this.shapesGraph.node,
    )) {
      if (quad.object.termType !== "NamedNode") {
        continue;
      }
      classNodeShapes.push(...this.classNodeShapes(quad.object));
    }

    return classNodeShapes;
  }

  transform(): Either<Error, Ast> {
    return Either.sequence(
      this.shapesGraph.nodeShapes
        .filter((nodeShape) => nodeShape.node.termType === "NamedNode")
        .map((nodeShape) => this.transformNodeShape(nodeShape)),
    ).map((objectTypes) => ({
      objectTypes,
    }));
  }

  /**
   * Try to convert a shape to a type using some heuristics.
   *
   * We don't try to handle exotic cases allowed by the SHACL spec, such as combinations of sh:in and sh:node. Instead we assume
   * a shape has one type.
   */
  private shapeType(shape: Shape): Either<Error, Type> {
    const name = this.shapeName(shape);

    const hasValue = shape.constraints.hasValue;

    if (shape.constraints.and.length > 0) {
      return Either.sequence(
        shape.constraints.and.map((shape) => this.shapeType(shape)),
      ).chain((types) =>
        types.length === 1
          ? Either.of(types[0])
          : Either.of({
              kind: "And",
              types,
            }),
      );
    } else if (
      [
        shape.constraints.datatype,
        shape.constraints.maxExclusive,
        shape.constraints.maxInclusive,
        shape.constraints.minExclusive,
        shape.constraints.minInclusive,
      ].some((constraint) => constraint.isJust()) ||
      hasValue.extractNullable()?.termType === "Literal"
    ) {
      // Treat any shape with the constraints in the list as a literal type
      return Either.of({
        datatype: shape.constraints.datatype,
        hasValue: hasValue.filter(
          (hasValue) => hasValue.termType === "Literal",
        ),
        kind: "Literal",
        maxExclusive: shape.constraints.maxExclusive,
        maxInclusive: shape.constraints.maxInclusive,
        minExclusive: shape.constraints.minExclusive,
        minInclusive: shape.constraints.minInclusive,
        name,
      });
    } else if (shape.constraints.classes.length > 0) {
      const nodeShapes: NodeShape[] = [];
      for (const class_ of shape.constraints.classes) {
        const classNodeShapes = this.classNodeShapes(class_);
        if (classNodeShapes.length === 0) {
          logger.warn(
            "%s sh:class %s does not correspond to any node shapes",
            shape,
            class_.value,
          );
          continue;
        }
        nodeShapes.push(...classNodeShapes);
      }
      if (nodeShapes.length === 0) {
        return Left(
          new Error(
            `${shape} has sh:class(se) but none of them correspond to a node shape`,
          ),
        );
      }
      return Either.sequence(
        nodeShapes.map((nodeShape) => this.transformNodeShape(nodeShape)),
      ).chain((types) =>
        types.length === 1
          ? Either.of(types[0] as Type)
          : Either.of({
              kind: "And",
              types,
            }),
      );
    } else if (shape.constraints.in_.isJust()) {
      // Treat any shape with sh:in as an enum type
      return Either.of({
        kind: "Enum",
        members: shape.constraints.in_.extract(),
      });
    } else if (shape.constraints.nodes.length > 0) {
      // Treat any type with sh:node(s) as the conjunction of those nodes.
      return Either.sequence(
        shape.constraints.nodes.map((nodeShape) =>
          this.transformNodeShape(nodeShape),
        ),
      ).chain((types) =>
        types.length === 1
          ? Either.of(types[0] as Type)
          : Either.of({
              kind: "And",
              types,
            }),
      );
    } else if (shape.constraints.or.length > 0) {
      // Treat any shape with sh:or as the disjunction of the member shapes.
      return Either.sequence(
        shape.constraints.or.map((shape) => this.shapeType(shape)),
      ).chain((types) =>
        types.length === 1
          ? Either.of(types[0])
          : Either.of({
              kind: "Or",
              types,
            }),
      );
    } else {
      return Left(new Error(`unable to transform type on ${shape}`));
    }
  }

  private shapeName(shape: Shape): Name {
    const identifier = shape.node;
    const curie =
      identifier.termType === "NamedNode"
        ? Maybe.fromNullable(this.iriPrefixMap.shrink(identifier)?.value)
        : Maybe.empty();
    const shName = shape.name.map((name) => name.value);
    const shacl2tsName = new ShapeWrapper(shape).shacl2tsName;

    const tsNameAlternatives: (string | null | undefined)[] = [
      shacl2tsName.extract(),
      shName.extract()?.replace(" ", "_"),
      curie.map((curie) => curie.replace(":", "_")).extract(),
    ];
    if (shape instanceof PropertyShape && shape.path.kind === "PredicatePath") {
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
      shacl2tsName,
      tsName: toValidTsIdentifier(
        tsNameAlternatives.find((tsNameAlternative) => !!tsNameAlternative)!,
      ),
    };
  }

  private transformNodeShape(nodeShape: NodeShape): Either<Error, ObjectType> {
    {
      const objectType = this.objectTypesByIdentifier.get(nodeShape.node);
      if (objectType) {
        return Either.of(objectType);
      }
    }

    // Put a placeholder in the cache to deal with cyclic references
    // If this node shape's properties (directly or indirectly) refer to the node shape itself,
    // we'll return this placeholder.
    const objectType: ObjectType = {
      kind: "Object",
      name: this.shapeName(nodeShape),
      properties: [], // This is mutable, we'll populate it below.
    };
    this.objectTypesByIdentifier.set(nodeShape.node, objectType);

    const propertiesByTsName: Record<string, Property> = {};
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
      const property = propertyEither.extract() as Property;
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
    propertyShape: PropertyShape,
  ): Either<Error, Property> {
    {
      const property = this.propertiesByIdentifier.get(propertyShape.node);
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

    const property: Property = {
      maxCount: propertyShape.constraints.maxCount,
      minCount: propertyShape.constraints.minCount,
      name: this.shapeName(propertyShape),
      path,
      type: type.extract() as Type,
    };
    this.propertiesByIdentifier.set(propertyShape.node, property);
    return Either.of(property);
  }
}
