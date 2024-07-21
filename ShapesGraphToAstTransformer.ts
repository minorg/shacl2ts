import TermMap from "@rdfjs/term-map";
import { ObjectType, Property, Type, Name } from "./ast";
import { NodeShape, PropertyShape, Shape, ShapesGraph } from "shacl-ast";
import { BlankNode, NamedNode } from "@rdfjs/types";
import reservedIdentifiers_ from "reserved-identifiers";
import base62 from "@sindresorhus/base62";
import { Either, Left } from "purify-ts";
import { Ast } from "./ast/Ast.js";

const reservedIdentifiers = reservedIdentifiers_({
  includeGlobalProperties: true,
});

// Adapted from https://github.com/sindresorhus/to-valid-identifier , MIT license
function toValidTsIdentifier(value: string): string {
  if (reservedIdentifiers.has(value)) {
    // We prefix with underscore to avoid any potential conflicts with the Base62 encoded string.
    return `$_${value}$`;
  }

  return value.replaceAll(
    /\P{ID_Continue}/gu,
    (x) => `$${base62.encodeInteger(x.codePointAt(0)!)}$`,
  );
}

export class ShapesGraphToAstTransformer {
  private readonly objectTypesByIdentifier: TermMap<
    BlankNode | NamedNode,
    ObjectType
  > = new TermMap();
  private readonly propertiesByIdentifier: TermMap<
    BlankNode | NamedNode,
    Property
  > = new TermMap();

  transform(shapesGraph: ShapesGraph): Either<Error, Ast> {
    return Either.sequence(
      shapesGraph.nodeShapes
        .filter((nodeShape) => nodeShape.node.termType === "NamedNode")
        .map((nodeShape) => this.transformNodeShape(nodeShape)),
    ).map((objectTypes) => ({
      objectTypes,
    }));
  }

  private shapeType(shape: Shape): Either<Error, Type> {
    const name = this.shapeName(shape);

    if (
      [
        shape.constraints.datatype,
        shape.constraints.maxExclusive,
        shape.constraints.maxInclusive,
        shape.constraints.minExclusive,
        shape.constraints.minInclusive,
      ].some((constraint) => constraint.isJust())
    ) {
      return Either.of({
        datatype: shape.constraints.datatype,
        kind: "Literal",
        maxExclusive: shape.constraints.maxExclusive,
        maxInclusive: shape.constraints.maxInclusive,
        minExclusive: shape.constraints.minExclusive,
        minInclusive: shape.constraints.minInclusive,
        name,
      });
    } else if (shape.constraints.in_.isJust()) {
      return Either.of({
        kind: "Enum",
        members: shape.constraints.in_.extract(),
      });
    } else if (shape.constraints.nodes.length > 0) {
      const typesEither = Either.sequence(
        shape.constraints.nodes.map((nodeShape) =>
          this.transformNodeShape(nodeShape),
        ),
      );
      if (typesEither.isLeft()) {
        return typesEither;
      }
      const types: readonly ObjectType[] =
        typesEither.extract() as readonly ObjectType[];
      if (types.length === 1) {
        return Either.of(types[0]);
      } else {
        return Either.of({
          kind: "Union",
          types,
        });
      }
    } else if (shape.constraints.or.length > 0) {
      const typesEither = Either.sequence(
        shape.constraints.or.map((shape) => this.shapeType(shape)),
      );
      if (typesEither.isLeft()) {
        return typesEither;
      }
      const types: readonly Type[] = typesEither.extract() as readonly Type[];
      if (types.length === 1) {
        return Either.of(types[0]);
      } else {
        return Either.of({
          kind: "Union",
          types,
        });
      }
    } else {
      return Left(
        new Error(`unable to transform type on shape ${shape.node.value}`),
      );
    }
  }

  private shapeName(shape: Shape): Name {
    const identifier = shape.node;
    const shName = shape.name.map((name) => name.value);
    return {
      identifier,
      shName,
      tsName: shName
        .map((name) => toValidTsIdentifier(name))
        .orDefaultLazy(() => {
          let tsNameIdentifier =
            shape instanceof PropertyShape ? shape.path : identifier;
          switch (tsNameIdentifier.termType) {
            case "BlankNode":
              return toValidTsIdentifier(`_:${tsNameIdentifier.value}`);
            case "NamedNode":
              return toValidTsIdentifier(`<${tsNameIdentifier.value}>`);
          }
        }),
    };
  }

  private transformNodeShape(nodeShape: NodeShape): Either<Error, ObjectType> {
    {
      const objectType = this.objectTypesByIdentifier.get(nodeShape.node);
      if (objectType) {
        return Either.of(objectType);
      }
    }

    const properties: Property[] = [];
    for (const propertyShape of nodeShape.constraints.properties) {
      const property = this.transformPropertyShape(propertyShape);
      if (property.isLeft()) {
        return property;
      }
      properties.push(property.extract() as Property);
    }

    const objectType: ObjectType = {
      name: this.shapeName(nodeShape),
      kind: "Object",
      properties,
    };
    this.objectTypesByIdentifier.set(nodeShape.node, objectType);
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

    const property: Property = {
      maxCount: propertyShape.constraints.maxCount,
      minCount: propertyShape.constraints.minCount,
      name: this.shapeName(propertyShape),
      path: propertyShape.path,
      type: type.extract() as Type,
    };
    this.propertiesByIdentifier.set(propertyShape.node, property);
    return Either.of(property);
  }
}
