import TermMap from "@rdfjs/term-map";
import { ObjectType, Property, Type, TypeName } from ".";
import { NodeShape, PropertyShape, Shape, ShapesGraph } from "shacl-ast";
import { BlankNode, NamedNode } from "@rdfjs/types";
import reservedIdentifiers_ from "reserved-identifiers";
import base62 from "@sindresorhus/base62";

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

    transform(): Ast {
      let objectTypes: ObjectType[] = [];
      for (const nodeShape of this.shapesGraph.nodeShapes) {
        if (nodeShape.node.termType !== "NamedNode") {
          continue;
        }
      }
      return {
        objectTypes,
      };
    }

    private shapeTypeName(shape: Shape): TypeName {
      const identifier = shape.node;
      const shName = shape.name?.value ?? null;
      let tsName: string;
      if (shName !== null) {
        tsName = toValidTsIdentifier(shName);
      } else {
        let tsNameIdentifier =
          shape instanceof PropertyShape ? shape.path : identifier;
        switch (tsNameIdentifier.termType) {
          case "BlankNode":
            tsName = toValidTsIdentifier(`_:${tsNameIdentifier.value}`);
            break;
          case "NamedNode":
            tsName = toValidTsIdentifier(`<${tsNameIdentifier.value}>`);
            break;
        }
      }
      return {
        identifier,
        shName,
        tsName,
      };
    }

    private transformNodeShape(nodeShape: NodeShape): ObjectType {
      const objectType = this.objectTypesByIdentifier.get(nodeShape.node);
      if (objectType) {
        return objectType;
      }
    }

    private transformPropertyShape(propertyShape: PropertyShape): Property {
      const property = this.propertiesByIdentifier.get(propertyShape.node);
      if (property) {
        return property;
      }

      let name = this.shapeTypeName(propertyShape);

      let type: Type;
      if (propertyShape.datatype !== null) {
        type = {
          datatype: propertyShape.datatype,
          kind: "Literal",
          name,
        };
      } else if (propertyShape.nodeShapes.length > 0) {
        const nodeShapes = propertyShape.nodeShapes;
        if (nodeShapes.length === 0) {
          type = this.transformNodeShape(nodeShapes[0]);
        } else {
          type = {
            types: nodeShapes.map((nodeShape) =>
              this.transformNodeShape(nodeShape),
            ),
            kind: "Union",
          };
        }
      } else {
      }

      return {
        maxCount: propertyShape.maxCount,
        minCount: propertyShape.minCount,
        name: this.shapeTypeName(propertyShape),
      };
    }
  }

  export function fromShapesGraph(shapesGraph: ShapesGraph): Ast {
    return new ShapesGraphToAstTransformer(shapesGraph).transform();
  }
}
