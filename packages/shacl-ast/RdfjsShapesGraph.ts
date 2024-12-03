import TermMap from "@rdfjs/term-map";
import TermSet from "@rdfjs/term-set";
import type {
  BlankNode,
  DatasetCore,
  DefaultGraph,
  NamedNode,
  Term,
} from "@rdfjs/types";
import { rdf, sh } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { Resource, ResourceSet } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { RdfjsShapeFactory } from "./RdfjsShapeFactory.js";
import type { Shape } from "./Shape.js";

export class RdfjsShapesGraph<
  NodeShapeT extends NodeShape<any, PropertyShapeT, ShapeT> & ShapeT,
  PropertyShapeT extends PropertyShape<NodeShapeT, any, ShapeT> & ShapeT,
  ShapeT extends Shape<NodeShapeT, PropertyShapeT, any>,
> {
  readonly dataset: DatasetCore;
  readonly node: BlankNode | DefaultGraph | NamedNode | null;
  readonly nodeShapes: readonly NodeShapeT[];
  readonly propertyGroups: readonly PropertyGroup[];
  readonly propertyShapes: readonly PropertyShapeT[];
  private readonly nodeShapesByNode: TermMap<BlankNode | NamedNode, NodeShapeT>;
  private readonly propertyGroupsByNode: TermMap<
    BlankNode | NamedNode,
    PropertyGroup
  >;
  private readonly propertyShapesByNode: TermMap<
    BlankNode | NamedNode,
    PropertyShapeT
  >;

  constructor({
    dataset,
    shapeFactory,
  }: {
    dataset: DatasetCore;
    shapeFactory: RdfjsShapeFactory<NodeShapeT, PropertyShapeT, ShapeT>;
  }) {
    this.dataset = dataset;
    this.node = this.readGraph();

    const {
      nodeShapes,
      nodeShapesByNode,
      propertyShapes,
      propertyShapesByNode,
    } = this.readShapes(shapeFactory);
    this.nodeShapes = nodeShapes;
    this.nodeShapesByNode = nodeShapesByNode;
    this.propertyShapes = propertyShapes;
    this.propertyShapesByNode = propertyShapesByNode;

    const { propertyGroups, propertyGroupsByNode } = this.readPropertyGroups();
    this.propertyGroups = propertyGroups;
    this.propertyGroupsByNode = propertyGroupsByNode;
  }

  nodeShapeByNode(nodeShapeNode: BlankNode | NamedNode): Maybe<NodeShapeT> {
    return Maybe.fromNullable(this.nodeShapesByNode.get(nodeShapeNode));
  }

  propertyGroupByNode(propertyGroupNode: NamedNode): Maybe<PropertyGroup> {
    return Maybe.fromNullable(this.propertyGroupsByNode.get(propertyGroupNode));
  }

  propertyShapeByNode(
    propertyShapeNode: BlankNode | NamedNode,
  ): Maybe<PropertyShapeT> {
    return Maybe.fromNullable(this.propertyShapesByNode.get(propertyShapeNode));
  }

  shapeByNode(node: BlankNode | NamedNode): Maybe<ShapeT> {
    const nodeShape = this.nodeShapeByNode(node);
    if (nodeShape.isJust()) {
      return nodeShape;
    }
    return this.propertyShapeByNode(node);
  }

  private readGraph(): BlankNode | DefaultGraph | NamedNode | null {
    const graphs = new TermSet();
    for (const quad of this.dataset) {
      graphs.add(quad.graph);
    }
    if (graphs.size !== 1) {
      return null;
    }
    const graph = [...graphs.values()][0];
    switch (graph.termType) {
      case "BlankNode":
      case "DefaultGraph":
      case "NamedNode":
        return graph;
      default:
        throw new RangeError(
          `expected NamedNode or default graph, actual ${graph.termType}`,
        );
    }
  }

  private readPropertyGroups(): {
    propertyGroups: PropertyGroup[];
    propertyGroupsByNode: TermMap<BlankNode | NamedNode, PropertyGroup>;
  } {
    const propertyGroups: PropertyGroup[] = [];
    const propertyGroupsByNode: TermMap<BlankNode | NamedNode, PropertyGroup> =
      new TermMap();
    for (const quad of this.dataset.match(
      null,
      rdf.type,
      sh.PropertyGroup,
      this.node,
    )) {
      const subject = quad.subject;
      if (subject.termType !== "NamedNode") {
        continue;
      }
      if (propertyGroupsByNode.has(subject)) {
        continue;
      }
      const propertyGroup = new PropertyGroup(
        new Resource({ dataset: this.dataset, identifier: subject }),
      );
      propertyGroups.push(propertyGroup);
      propertyGroupsByNode.set(subject, propertyGroup);
    }
    return { propertyGroups, propertyGroupsByNode };
  }

  private readShapes(
    shapeFactory: RdfjsShapeFactory<NodeShapeT, PropertyShapeT, ShapeT>,
  ): {
    nodeShapes: readonly NodeShapeT[];
    nodeShapesByNode: TermMap<BlankNode | NamedNode, NodeShapeT>;
    propertyShapes: readonly PropertyShapeT[];
    propertyShapesByNode: TermMap<BlankNode | NamedNode, PropertyShapeT>;
  } {
    const resourceSet = new ResourceSet({ dataset: this.dataset });

    // Collect the shape identifiers in sets
    const shapeNodeSet = new TermSet<BlankNode | NamedNode>();

    // Utility function for doing the collection
    const addShapeNode = (shapeNode: Term) => {
      switch (shapeNode.termType) {
        case "BlankNode":
        case "NamedNode":
          shapeNodeSet.add(shapeNode);
          break;
      }
    };

    // Test each shape condition
    // https://www.w3.org/TR/shacl/#shapes

    // Subject is a SHACL instance of sh:NodeShape or sh:PropertyShape
    for (const rdfType of [sh.NodeShape, sh.PropertyShape]) {
      for (const resource of resourceSet.instancesOf(rdfType, {
        graph: this.node,
      })) {
        addShapeNode(resource.identifier);
      }
    }

    // Subject of a triple with sh:targetClass, sh:targetNode, sh:targetObjectsOf, or sh:targetSubjectsOf predicate
    for (const predicate of [
      sh.targetClass,
      sh.targetNode,
      sh.targetObjectsOf,
      sh.targetSubjectsOf,
    ]) {
      for (const quad of this.dataset.match(null, predicate, null, this.node)) {
        addShapeNode(quad.subject);
      }
    }

    // Subject of a triple that has a parameter as predicate
    // https://www.w3.org/TR/shacl/#constraints
    // https://www.w3.org/TR/shacl/#core-components
    for (const predicate of [
      sh.class,
      sh.datatype,
      sh.nodeKind,
      sh.minCount,
      sh.maxCount,
      sh.minExclusive,
      sh.minInclusive,
      sh.maxExclusive,
      sh.maxInclusive,
      sh.minLength,
      sh.maxLength,
      sh.pattern,
      sh.languageIn,
      sh.uniqueLang,
      sh.equals,
      sh.disjoint,
      sh.lessThan,
      sh.lessThanOrEquals,
      sh.not,
      sh.and,
      sh.or,
      sh.xone,
      sh.node,
      sh.property,
      sh.qualifiedValueShape,
      sh.qualifiedMinCount,
      sh.qualifiedMaxCount,
      sh.closed,
      sh.ignoredProperties,
      sh.hasValue,
      sh.in,
    ]) {
      for (const quad of this.dataset.match(null, predicate, null, this.node)) {
        addShapeNode(quad.subject);
      }
    }

    // Object of a shape-expecting, non-list-taking parameter such as sh:node
    for (const predicate of [sh.node, sh.property]) {
      for (const quad of this.dataset.match(null, predicate, null, this.node)) {
        addShapeNode(quad.object);
      }
    }

    // Member of a SHACL list that is a value of a shape-expecting and list-taking parameter such as sh:or
    for (const predicate of [sh.and, sh.or, sh.xone]) {
      for (const quad of this.dataset.match(null, predicate, null, this.node)) {
        switch (quad.object.termType) {
          case "BlankNode":
          case "NamedNode":
            break;
          default:
            continue;
        }

        for (const value of resourceSet
          .resource(quad.object)
          .toList()
          .orDefault([])) {
          value.toIdentifier().ifRight(addShapeNode);
        }
      }
    }

    // Separate shapes into node and property shapes.
    const nodeShapes: NodeShapeT[] = [];
    const nodeShapesByNode: TermMap<BlankNode | NamedNode, NodeShapeT> =
      new TermMap();
    const propertyShapes: PropertyShapeT[] = [];
    const propertyShapesByNode: TermMap<BlankNode | NamedNode, PropertyShapeT> =
      new TermMap();

    for (const shapeNode of shapeNodeSet) {
      if (this.dataset.match(shapeNode, sh.path, null, this.node).size > 0) {
        // A property shape is a shape in the shapes graph that is the subject of a triple that has sh:path as its predicate. A shape has at most one value for sh:path. Each value of sh:path in a shape must be a well-formed SHACL property path. It is recommended, but not required, for a property shape to be declared as a SHACL instance of sh:PropertyShape. SHACL instances of sh:PropertyShape have one value for the property sh:path.
        const propertyShape = shapeFactory.createPropertyShape(
          resourceSet.resource(shapeNode),
          this,
        );
        propertyShapes.push(propertyShape);
        propertyShapesByNode.set(shapeNode, propertyShape);
      } else {
        // A node shape is a shape in the shapes graph that is not the subject of a triple with sh:path as its predicate. It is recommended, but not required, for a node shape to be declared as a SHACL instance of sh:NodeShape. SHACL instances of sh:NodeShape cannot have a value for the property sh:path.
        const nodeShape = shapeFactory.createNodeShape(
          resourceSet.resource(shapeNode),
          this,
        );
        nodeShapes.push(nodeShape);
        nodeShapesByNode.set(shapeNode, nodeShape);
      }
    }

    return {
      nodeShapes,
      nodeShapesByNode,
      propertyShapes,
      propertyShapesByNode,
    };
  }
}
