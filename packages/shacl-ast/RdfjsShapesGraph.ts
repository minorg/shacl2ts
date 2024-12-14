import TermMap from "@rdfjs/term-map";
import TermSet from "@rdfjs/term-set";
import type {
  BlankNode,
  DatasetCore,
  DefaultGraph,
  NamedNode,
  Term,
} from "@rdfjs/types";
import { owl, sh } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { ResourceSet } from "rdfjs-resource";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { RdfjsFactory } from "./RdfjsFactory.js";
import type { Shape } from "./Shape.js";

export class RdfjsShapesGraph<
  NodeShapeT extends NodeShape<any, OntologyT, PropertyShapeT, ShapeT> & ShapeT,
  OntologyT extends Ontology,
  PropertyShapeT extends PropertyShape<NodeShapeT, OntologyT, any, ShapeT> &
    ShapeT,
  ShapeT extends Shape<NodeShapeT, OntologyT, PropertyShapeT, any>,
> {
  readonly dataset: DatasetCore;
  readonly node: BlankNode | DefaultGraph | NamedNode | null;
  readonly nodeShapes: readonly NodeShapeT[];
  readonly ontologies: readonly OntologyT[];
  readonly propertyGroups: readonly PropertyGroup[];
  readonly propertyShapes: readonly PropertyShapeT[];
  private readonly nodeShapesByIdentifier: TermMap<
    BlankNode | NamedNode,
    NodeShapeT
  >;
  private readonly ontologiesByIdentifier: TermMap<
    BlankNode | NamedNode,
    OntologyT
  >;
  private readonly propertyGroupsByIdentifier: TermMap<
    BlankNode | NamedNode,
    PropertyGroup
  >;
  private readonly propertyShapesByIdentifier: TermMap<
    BlankNode | NamedNode,
    PropertyShapeT
  >;
  private readonly resourceSet: ResourceSet;

  constructor({
    dataset,
    factory,
  }: {
    dataset: DatasetCore;
    factory: RdfjsFactory<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>;
  }) {
    this.dataset = dataset;
    this.resourceSet = new ResourceSet({ dataset: this.dataset });

    this.node = this.readGraph();

    const {
      nodeShapes,
      nodeShapesByIdentifier,
      propertyShapes,
      propertyShapesByIdentifier,
    } = this.readShapes(factory);
    this.nodeShapes = nodeShapes;
    this.nodeShapesByIdentifier = nodeShapesByIdentifier;
    this.propertyShapes = propertyShapes;
    this.propertyShapesByIdentifier = propertyShapesByIdentifier;

    const { ontologies, ontologiesByIdentifier } = this.readOntologies(factory);
    this.ontologies = ontologies;
    this.ontologiesByIdentifier = ontologiesByIdentifier;

    const { propertyGroups, propertyGroupsByIdentifier } =
      this.readPropertyGroups();
    this.propertyGroups = propertyGroups;
    this.propertyGroupsByIdentifier = propertyGroupsByIdentifier;
  }

  nodeShapeByIdentifier(
    nodeShapeNode: BlankNode | NamedNode,
  ): Maybe<NodeShapeT> {
    return Maybe.fromNullable(this.nodeShapesByIdentifier.get(nodeShapeNode));
  }

  ontologyByIdentifier(identifier: BlankNode | NamedNode): Maybe<OntologyT> {
    return Maybe.fromNullable(this.ontologiesByIdentifier.get(identifier));
  }

  propertyGroupByIdentifier(identifier: NamedNode): Maybe<PropertyGroup> {
    return Maybe.fromNullable(this.propertyGroupsByIdentifier.get(identifier));
  }

  propertyShapeByIdentifier(
    identifier: BlankNode | NamedNode,
  ): Maybe<PropertyShapeT> {
    return Maybe.fromNullable(this.propertyShapesByIdentifier.get(identifier));
  }

  shapeByIdentifier(identifier: BlankNode | NamedNode): Maybe<ShapeT> {
    const nodeShape = this.nodeShapeByIdentifier(identifier);
    if (nodeShape.isJust()) {
      return nodeShape;
    }
    return this.propertyShapeByIdentifier(identifier);
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

  private readOntologies(
    factory: RdfjsFactory<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>,
  ): {
    ontologies: OntologyT[];
    ontologiesByIdentifier: TermMap<BlankNode | NamedNode, OntologyT>;
  } {
    const ontologies: OntologyT[] = [];
    const ontologiesByIdentifier: TermMap<BlankNode | NamedNode, OntologyT> =
      new TermMap();
    for (const ontologyResource of this.resourceSet.instancesOf(owl.Ontology, {
      graph: this.node,
    })) {
      if (ontologiesByIdentifier.has(ontologyResource.identifier)) {
        continue;
      }
      const ontology = factory.createOntology(ontologyResource, this);
      ontologies.push(ontology);
      ontologiesByIdentifier.set(ontologyResource.identifier, ontology);
    }
    return { ontologies, ontologiesByIdentifier };
  }

  private readPropertyGroups(): {
    propertyGroups: PropertyGroup[];
    propertyGroupsByIdentifier: TermMap<BlankNode | NamedNode, PropertyGroup>;
  } {
    const propertyGroups: PropertyGroup[] = [];
    const propertyGroupsByIdentifier: TermMap<
      BlankNode | NamedNode,
      PropertyGroup
    > = new TermMap();
    for (const propertyGroupResource of this.resourceSet.instancesOf(
      sh.PropertyGroup,
      { graph: this.node },
    )) {
      if (propertyGroupResource.identifier.termType !== "NamedNode") {
        continue;
      }
      if (propertyGroupsByIdentifier.has(propertyGroupResource.identifier)) {
        continue;
      }
      const propertyGroup = new PropertyGroup(propertyGroupResource);
      propertyGroups.push(propertyGroup);
      propertyGroupsByIdentifier.set(
        propertyGroupResource.identifier,
        propertyGroup,
      );
    }
    return { propertyGroups, propertyGroupsByIdentifier };
  }

  private readShapes(
    factory: RdfjsFactory<NodeShapeT, OntologyT, PropertyShapeT, ShapeT>,
  ): {
    nodeShapes: readonly NodeShapeT[];
    nodeShapesByIdentifier: TermMap<BlankNode | NamedNode, NodeShapeT>;
    propertyShapes: readonly PropertyShapeT[];
    propertyShapesByIdentifier: TermMap<BlankNode | NamedNode, PropertyShapeT>;
  } {
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
      for (const resource of this.resourceSet.instancesOf(rdfType, {
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

        for (const value of this.resourceSet
          .resource(quad.object)
          .toList()
          .orDefault([])) {
          value.toIdentifier().ifRight(addShapeNode);
        }
      }
    }

    // Separate shapes into node and property shapes.
    const nodeShapes: NodeShapeT[] = [];
    const nodeShapesByIdentifier: TermMap<BlankNode | NamedNode, NodeShapeT> =
      new TermMap();
    const propertyShapes: PropertyShapeT[] = [];
    const propertyShapesByIdentifier: TermMap<
      BlankNode | NamedNode,
      PropertyShapeT
    > = new TermMap();

    for (const shapeNode of shapeNodeSet) {
      if (this.dataset.match(shapeNode, sh.path, null, this.node).size > 0) {
        // A property shape is a shape in the shapes graph that is the subject of a triple that has sh:path as its predicate. A shape has at most one value for sh:path. Each value of sh:path in a shape must be a well-formed SHACL property path. It is recommended, but not required, for a property shape to be declared as a SHACL instance of sh:PropertyShape. SHACL instances of sh:PropertyShape have one value for the property sh:path.
        const propertyShape = factory.createPropertyShape(
          this.resourceSet.resource(shapeNode),
          this,
        );
        propertyShapes.push(propertyShape);
        propertyShapesByIdentifier.set(shapeNode, propertyShape);
      } else {
        // A node shape is a shape in the shapes graph that is not the subject of a triple with sh:path as its predicate. It is recommended, but not required, for a node shape to be declared as a SHACL instance of sh:NodeShape. SHACL instances of sh:NodeShape cannot have a value for the property sh:path.
        const nodeShape = factory.createNodeShape(
          this.resourceSet.resource(shapeNode),
          this,
        );
        nodeShapes.push(nodeShape);
        nodeShapesByIdentifier.set(shapeNode, nodeShape);
      }
    }

    return {
      nodeShapes,
      nodeShapesByIdentifier,
      propertyShapes,
      propertyShapesByIdentifier,
    };
  }
}
