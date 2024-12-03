import type PrefixMap from "@rdfjs/prefix-map/PrefixMap.js";
import TermMap from "@rdfjs/term-map";
import type * as rdfjs from "@rdfjs/types";
import { dash } from "@tpluscode/rdf-ns-builders";
import { Either } from "purify-ts";
import * as _ShapesGraphToAstTransformer from "./_ShapesGraphToAstTransformer/index.js";
import type * as ast from "./ast/index.js";
import type * as input from "./input/index.js";

export class ShapesGraphToAstTransformer {
  // Members are protected so they're accessible to the bound functions
  protected readonly astObjectTypePropertiesByIdentifier: TermMap<
    rdfjs.BlankNode | rdfjs.NamedNode,
    ast.ObjectType.Property
  > = new TermMap();
  protected readonly iriPrefixMap: PrefixMap;
  protected readonly nodeShapeAstTypesByIdentifier: TermMap<
    rdfjs.BlankNode | rdfjs.NamedNode,
    _ShapesGraphToAstTransformer.NodeShapeAstType
  > = new TermMap();
  protected shapeAstName = _ShapesGraphToAstTransformer.shapeAstName;
  protected readonly shapesGraph: input.ShapesGraph;
  protected transformNodeShapeToAstType =
    _ShapesGraphToAstTransformer.transformNodeShapeToAstType;
  protected transformPropertyShapeToAstCompositeType =
    _ShapesGraphToAstTransformer.transformPropertyShapeToAstCompositeType;
  protected transformPropertyShapeToAstIdentifierType =
    _ShapesGraphToAstTransformer.transformPropertyShapeToAstIdentifierType;
  protected transformPropertyShapeToAstLiteralType =
    _ShapesGraphToAstTransformer.transformPropertyShapeToAstLiteralType;
  protected transformPropertyShapeToAstObjectTypeProperty =
    _ShapesGraphToAstTransformer.transformPropertyShapeToAstObjectTypeProperty;
  protected transformPropertyShapeToAstType =
    _ShapesGraphToAstTransformer.transformPropertyShapeToAstType;

  constructor({
    iriPrefixMap,
    shapesGraph,
  }: {
    iriPrefixMap: PrefixMap;
    shapesGraph: input.ShapesGraph;
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
        .map((nodeShape) => this.transformNodeShapeToAstType(nodeShape)),
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
}
