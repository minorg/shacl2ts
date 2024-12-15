import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { rdfs, sh } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import { NodeKind } from "./NodeKind.js";
import type { NodeShape } from "./NodeShape.js";
import type { Ontology } from "./Ontology.js";
import type { PropertyGroup } from "./PropertyGroup.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import type { ShapesGraph } from "./ShapesGraph.js";

export abstract class RdfjsShape<
  NodeShapeT extends NodeShape<
    any,
    OntologyT,
    PropertyGroupT,
    PropertyShapeT,
    ShapeT
  > &
    ShapeT,
  OntologyT extends Ontology,
  PropertyGroupT extends PropertyGroup,
  PropertyShapeT extends PropertyShape<
    NodeShapeT,
    OntologyT,
    PropertyGroupT,
    any,
    ShapeT
  > &
    ShapeT,
  ShapeT extends Shape<
    NodeShapeT,
    OntologyT,
    PropertyGroupT,
    PropertyShapeT,
    any
  >,
> implements
    Shape<NodeShapeT, OntologyT, PropertyGroupT, PropertyShapeT, ShapeT>
{
  abstract readonly constraints: RdfjsShape.Constraints<
    NodeShapeT,
    OntologyT,
    PropertyGroupT,
    PropertyShapeT,
    ShapeT
  >;
  readonly targets: RdfjsShape.Targets;

  protected constructor(
    readonly resource: Resource,
    protected readonly shapesGraph: ShapesGraph<
      NodeShapeT,
      OntologyT,
      PropertyGroupT,
      PropertyShapeT,
      ShapeT
    >,
  ) {
    this.targets = new RdfjsShape.Targets(resource);
  }

  get description(): Maybe<Literal> {
    return this.resource
      .value(sh.description)
      .chain((value) => value.toLiteral())
      .toMaybe();
  }

  get identifier(): Resource.Identifier {
    return this.resource.identifier;
  }

  get isDefinedBy(): Maybe<OntologyT> {
    const isDefinedByValue = this.resource.value(rdfs.isDefinedBy);
    if (isDefinedByValue.isRight()) {
      // If there's an rdfs:isDefinedBy statement on the shape then don't fall back to anything else
      return isDefinedByValue
        .chain((value) => value.toIdentifier())
        .toMaybe()
        .chain((identifier) =>
          this.shapesGraph.ontologyByIdentifier(identifier),
        );
    }

    // No rdfs:isDefinedBy statement on the shape

    const ontologies = this.shapesGraph.ontologies;
    if (ontologies.length === 1) {
      // If there's a single ontology in the shapes graph, consider the shape a part of the ontology
      return Maybe.of(ontologies[0]);
    }

    if (this.identifier.termType === "NamedNode") {
      const prefixOntologies = ontologies.filter(
        (ontology) =>
          ontology.identifier.termType === "NamedNode" &&
          this.identifier.value.startsWith(ontology.identifier.value),
      );
      if (prefixOntologies.length === 1) {
        // If there's a single ontology whose IRI is a prefix of this shape's IRI, consider the shape a part of the ontology
        return Maybe.of(prefixOntologies[0]);
      }
    }

    return Maybe.empty();
  }

  get name(): Maybe<Literal> {
    return this.resource
      .value(sh.name)
      .chain((value) => value.toLiteral())
      .toMaybe();
  }
}

export namespace RdfjsShape {
  export class Constraints<
    NodeShapeT extends NodeShape<
      any,
      OntologyT,
      PropertyGroupT,
      PropertyShapeT,
      ShapeT
    > &
      ShapeT,
    OntologyT extends Ontology,
    PropertyGroupT extends PropertyGroup,
    PropertyShapeT extends PropertyShape<
      NodeShapeT,
      OntologyT,
      PropertyGroupT,
      any,
      ShapeT
    > &
      ShapeT,
    ShapeT extends Shape<
      NodeShapeT,
      OntologyT,
      PropertyGroupT,
      PropertyShapeT,
      any
    >,
  > implements
      Shape.Constraints<
        NodeShapeT,
        OntologyT,
        PropertyGroupT,
        PropertyShapeT,
        ShapeT
      >
  {
    constructor(
      protected readonly resource: Resource,
      protected readonly shapesGraph: ShapesGraph<
        NodeShapeT,
        OntologyT,
        PropertyGroupT,
        PropertyShapeT,
        ShapeT
      >,
    ) {}

    get and(): readonly ShapeT[] {
      return this.listTakingLogicalConstraint(sh.and);
    }

    get classes(): readonly NamedNode[] {
      return [...this.resource.values(sh.class)].flatMap((value) =>
        value.toIri().toMaybe().toList(),
      );
    }

    get datatype(): Maybe<NamedNode> {
      return this.resource
        .value(sh.datatype)
        .chain((value) => value.toIri())
        .toMaybe();
    }

    get hasValue(): Maybe<BlankNode | Literal | NamedNode> {
      return this.resource
        .value(sh.hasValue)
        .map((value) => value.toTerm())
        .toMaybe();
    }

    get in_(): Maybe<readonly (BlankNode | Literal | NamedNode)[]> {
      return this.resource
        .value(sh.in)
        .chain((value) => value.toList())
        .map((values) => values.map((value) => value.toTerm()))
        .toMaybe();
    }

    get maxCount(): Maybe<number> {
      return this.resource
        .value(sh.maxCount)
        .chain((value) => value.toNumber())
        .toMaybe();
    }

    get maxExclusive(): Maybe<Literal> {
      return this.resource
        .value(sh.maxExclusive)
        .chain((value) => value.toLiteral())
        .toMaybe();
    }

    get maxInclusive(): Maybe<Literal> {
      return this.resource
        .value(sh.maxInclusive)
        .chain((value) => value.toLiteral())
        .toMaybe();
    }

    get minCount(): Maybe<number> {
      return this.resource
        .value(sh.minCount)
        .chain((value) => value.toNumber())
        .toMaybe();
    }

    get minExclusive(): Maybe<Literal> {
      return this.resource
        .value(sh.minExclusive)
        .chain((value) => value.toLiteral())
        .toMaybe();
    }

    get minInclusive(): Maybe<Literal> {
      return this.resource
        .value(sh.minInclusive)
        .chain((value) => value.toLiteral())
        .toMaybe();
    }

    get nodeKinds(): Set<NodeKind> {
      const nodeKinds = new Set<NodeKind>();
      for (const nodeKindValue of this.resource.values(sh.nodeKind)) {
        nodeKindValue.toIri().ifRight((nodeKindIri) => {
          if (nodeKindIri.equals(sh.BlankNode)) {
            nodeKinds.add(NodeKind.BLANK_NODE);
          } else if (nodeKindIri.equals(sh.BlankNodeOrIRI)) {
            nodeKinds.add(NodeKind.BLANK_NODE);
            nodeKinds.add(NodeKind.IRI);
          } else if (nodeKindIri.equals(sh.BlankNodeOrLiteral)) {
            nodeKinds.add(NodeKind.BLANK_NODE);
            nodeKinds.add(NodeKind.LITERAL);
          } else if (nodeKindIri.equals(sh.IRI)) {
            nodeKinds.add(NodeKind.IRI);
          } else if (nodeKindIri.equals(sh.IRIOrLiteral)) {
            nodeKinds.add(NodeKind.IRI);
            nodeKinds.add(NodeKind.LITERAL);
          } else if (nodeKindIri.equals(sh.Literal)) {
            nodeKinds.add(NodeKind.LITERAL);
          }
        });
      }
      return nodeKinds;
    }

    get nodes(): readonly NodeShapeT[] {
      return [...this.resource.values(sh.node)].flatMap((value) =>
        value
          .toIdentifier()
          .toMaybe()
          .chain((identifier) =>
            this.shapesGraph.nodeShapeByIdentifier(identifier),
          )
          .toList(),
      );
    }

    get not(): readonly ShapeT[] {
      return [...this.resource.values(sh.not)].flatMap((value) =>
        value
          .toIdentifier()
          .toMaybe()
          .chain((identifier) => this.shapesGraph.shapeByIdentifier(identifier))
          .toList(),
      );
    }

    get or(): readonly ShapeT[] {
      return this.listTakingLogicalConstraint(sh.or);
    }

    get xone(): readonly ShapeT[] {
      return this.listTakingLogicalConstraint(sh.xone);
    }

    private listTakingLogicalConstraint(
      predicate: NamedNode,
    ): readonly ShapeT[] {
      return this.resource
        .value(predicate)
        .chain((value) => value.toList())
        .map((values) =>
          values.flatMap((value) =>
            value
              .toIdentifier()
              .toMaybe()
              .chain((identifier) =>
                this.shapesGraph.shapeByIdentifier(identifier),
              )
              .toList(),
          ),
        )
        .orDefault([]);
    }
  }

  export class Targets {
    constructor(protected readonly resource: Resource) {}

    get targetClasses(): readonly NamedNode[] {
      return [...this.resource.values(sh.targetClass)].flatMap((value) =>
        value.toIri().toMaybe().toList(),
      );
    }

    get targetNodes(): readonly (Literal | NamedNode)[] {
      return [...this.resource.values(sh.targetNode)].flatMap((value) =>
        (value.toLiteral().toMaybe() as Maybe<Literal | NamedNode>)
          .altLazy(() => value.toIri().toMaybe())
          .toList(),
      );
    }

    get targetObjectsOf(): readonly NamedNode[] {
      return [...this.resource.values(sh.targetObjectsOf)].flatMap((value) =>
        value.toIri().toMaybe().toList(),
      );
    }

    get targetSubjectsOf(): readonly NamedNode[] {
      return [...this.resource.values(sh.targetSubjectsOf)].flatMap((value) =>
        value.toIri().toMaybe().toList(),
      );
    }
  }
}
