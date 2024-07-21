import TermMap from "@rdfjs/term-map";
import { ObjectType, Property, Type, TypeName } from ".";
import { NodeShape, PropertyShape, Shape, ShapesGraph } from "shacl-ast";
import { BlankNode, NamedNode } from "@rdfjs/types";
import reservedIdentifiers_ from "reserved-identifiers";
import base62 from "@sindresorhus/base62";
import { Either, Left } from "purify-ts";

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

export interface Ast {
  readonly objectTypes: readonly ObjectType[];
}

export namespace Ast {
  class ShapesGraphToAstTransformer {
    private readonly objectTypesByIdentifier: TermMap<
      BlankNode | NamedNode,
      ObjectType
    > = new TermMap();
    private readonly propertiesByIdentifier: TermMap<
      BlankNode | NamedNode,
      Property
    > = new TermMap();

    constructor(private readonly shapesGraph: ShapesGraph) {}

    transform(): Either<Error, Ast> {
      let objectTypes: ObjectType[] = [];
      for (const nodeShape of this.shapesGraph.nodeShapes) {
        if (nodeShape.node.termType !== "NamedNode") {
          continue;
        }
        const objectType = this.transformNodeShape(nodeShape);
        if (objectType.isLeft()) {
          return objectType;
        }
        objectTypes.push(objectType.extract() as ObjectType);
      }
      return Either.of({
        objectTypes,
      });
    }

    private shapeTypeName(shape: Shape): TypeName {
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

    private transformNodeShape(
      nodeShape: NodeShape,
    ): Either<Error, ObjectType> {
      {
        const objectType = this.objectTypesByIdentifier.get(nodeShape.node);
        if (objectType) {
          return Either.of(objectType);
        }
      }

      const properties: Property[] = [];
      for (const propertyShape of nodeShape.properties) {
        const property = this.transformPropertyShape(propertyShape);
        if (property.isLeft()) {
          return property;
        }
        properties.push(property.extract() as Property);
      }

      const objectType: ObjectType = {
        name: this.shapeTypeName(nodeShape),
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

      let name = this.shapeTypeName(propertyShape);

      let type: Type;
      if (propertyShape.datatype.isJust()) {
        type = {
          datatype: propertyShape.datatype.extract(),
          kind: "Literal",
          name,
        };
      } else if (propertyShape.in_.isJust()) {
        type = {
          kind: "Enum",
          members: propertyShape.in_.extract(),
        };
      } else if (propertyShape.nodeShapes.length > 0) {
        const types: Type[] = [];
        for (const nodeShape of propertyShape.nodeShapes) {
          const typeEither = this.transformNodeShape(nodeShape);
          if (typeEither.isLeft()) {
            return typeEither;
          }
          types.push(typeEither.unsafeCoerce() as Type);
        }
        if (types.length === 1) {
          type = types[0];
        } else {
          type = {
            types,
            kind: "Union",
          };
        }
      } else {
        return Left(
          new Error(
            `unable to transform property shape on ${propertyShape.path.value}`,
          ),
        );
      }

      const property: Property = {
        maxCount: propertyShape.maxCount,
        minCount: propertyShape.minCount,
        name: this.shapeTypeName(propertyShape),
        type,
      };
      this.propertiesByIdentifier.set(propertyShape.node, property);
      return Either.of(property);
    }
  }

  export function fromShapesGraph(
    shapesGraph: ShapesGraph,
  ): Either<Error, Ast> {
    return new ShapesGraphToAstTransformer(shapesGraph).transform();
  }
}
