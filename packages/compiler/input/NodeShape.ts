import TermSet from "@rdfjs/term-set";
import type * as rdfjs from "@rdfjs/types";
import type { NamedNode } from "@rdfjs/types";
import { NodeKind, RdfjsNodeShape } from "@shaclmate/shacl-ast";
import { owl, rdfs } from "@tpluscode/rdf-ns-builders";
import { Either, Left, type Maybe } from "purify-ts";
import type { Resource } from "rdfjs-resource";
import { IriMintingStrategy } from "../IriMintingStrategy.js";
import { shaclmate } from "../vocabularies/index.js";
import type { PropertyShape } from "./PropertyShape.js";
import type { Shape } from "./Shape.js";
import { inline } from "./inline.js";
import { shaclmateName } from "./shaclmateName.js";

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

export class NodeShape
  extends RdfjsNodeShape<any, PropertyShape, Shape>
  implements Shape
{
  get abstract(): Maybe<boolean> {
    return this.resource
      .value(shaclmate.abstract)
      .chain((value) => value.toBoolean())
      .toMaybe();
  }

  get ancestorNodeShapes(): readonly NodeShape[] {
    return this.isClass
      ? this.ancestorClassIris.flatMap((classIri) =>
          this.shapesGraph.nodeShapeByNode(classIri).toList(),
        )
      : [];
  }

  get childNodeShapes(): readonly NodeShape[] {
    return this.isClass
      ? this.childClassIris.flatMap((classIri) =>
          this.shapesGraph.nodeShapeByNode(classIri).toList(),
        )
      : [];
  }

  get descendantNodeShapes(): readonly NodeShape[] {
    return this.isClass
      ? this.descendantClassIris.flatMap((classIri) =>
          this.shapesGraph.nodeShapeByNode(classIri).toList(),
        )
      : [];
  }

  get export(): Maybe<boolean> {
    return this.resource
      .value(shaclmate.export)
      .chain((value) => value.toBoolean())
      .toMaybe();
  }

  get inline(): Maybe<boolean> {
    return inline.bind(this)();
  }

  get iriMintingStrategy(): Either<Error, IriMintingStrategy> {
    const thisMintingStrategy = this._mintingStrategy;
    if (thisMintingStrategy.isLeft()) {
      for (const ancestorNodeShape of this.ancestorNodeShapes) {
        const ancestorMintingStrategy = ancestorNodeShape._mintingStrategy;
        if (ancestorMintingStrategy.isRight()) {
          return ancestorMintingStrategy;
        }
      }
    }
    return thisMintingStrategy;
  }

  get isClass(): boolean {
    return (
      this.resource.isInstanceOf(owl.Class) ||
      this.resource.isInstanceOf(rdfs.Class)
    );
  }

  get native(): Maybe<boolean> {
    return this.resource
      .value(shaclmate.native)
      .chain((value) => value.toBoolean())
      .toMaybe();
  }

  get nodeKinds(): Set<NodeKind.BLANK_NODE | NodeKind.IRI> {
    const thisNodeKinds = new Set<NodeKind.BLANK_NODE | NodeKind.IRI>(
      [...this.constraints.nodeKinds].filter(
        (nodeKind) => nodeKind !== NodeKind.LITERAL,
      ),
    );

    const parentNodeKinds = new Set<NodeKind.BLANK_NODE | NodeKind.IRI>();
    for (const parentNodeShape of this.parentNodeShapes) {
      for (const parentNodeKind of parentNodeShape.nodeKinds) {
        parentNodeKinds.add(parentNodeKind);
      }
    }

    if (thisNodeKinds.size === 0 && parentNodeKinds.size > 0) {
      // No node kinds on this shape, use the parent's
      return parentNodeKinds;
    }

    if (thisNodeKinds.size > 0 && parentNodeKinds.size > 0) {
      // Node kinds on this shape and the parent's shape
      // This node kinds must be a subset of parent node kinds.
      for (const thisNodeKind of thisNodeKinds) {
        if (!parentNodeKinds.has(thisNodeKind)) {
          throw new Error(
            `${this} has a nodeKind ${thisNodeKind} that is not in its parent's node kinds`,
          );
        }
      }
    }

    if (thisNodeKinds.size === 0) {
      // Default: both node kinds
      thisNodeKinds.add(NodeKind.BLANK_NODE);
      thisNodeKinds.add(NodeKind.IRI);
    }

    return thisNodeKinds;
  }

  get parentNodeShapes(): readonly NodeShape[] {
    return this.isClass
      ? this.parentClassIris.flatMap((classIri) =>
          this.shapesGraph.nodeShapeByNode(classIri).toList(),
        )
      : [];
  }

  get shaclmateName(): Maybe<string> {
    return shaclmateName.bind(this)();
  }

  get tsEqualsFunction(): Maybe<string> {
    return this.resource
      .value(shaclmate.tsEqualsFunction)
      .chain((value) => value.toString())
      .toMaybe();
  }

  get tsFromRdfFunction(): Maybe<string> {
    return this.resource
      .value(shaclmate.tsFromRdfFunction)
      .chain((value) => value.toString())
      .toMaybe();
  }

  get tsHashFunction(): Maybe<string> {
    return this.resource
      .value(shaclmate.tsHashFunction)
      .chain((value) => value.toString())
      .toMaybe();
  }

  get tsImport(): Maybe<string> {
    return this.resource
      .value(shaclmate.tsImport)
      .chain((value) => value.toString())
      .toMaybe();
  }

  get tsName(): Maybe<string> {
    return this.resource
      .value(shaclmate.tsName)
      .chain((value) => value.toString())
      .toMaybe();
  }

  get tsToRdfFunction(): Maybe<string> {
    return this.resource
      .value(shaclmate.tsToRdfFunction)
      .chain((value) => value.toString())
      .toMaybe();
  }

  private get _mintingStrategy(): Either<Error, IriMintingStrategy> {
    return this.resource
      .value(shaclmate.mintingStrategy)
      .chain((value) => value.toIri())
      .chain((iri) => {
        if (iri.equals(shaclmate.SHA256)) {
          return Either.of(IriMintingStrategy.SHA256);
        }
        if (iri.equals(shaclmate.UUIDv4)) {
          return Either.of(IriMintingStrategy.UUIDv4);
        }
        return Left(new Error(`unrecognizing minting strategy: ${iri.value}`));
      });
  }

  private get ancestorClassIris(): readonly NamedNode[] {
    return ancestorClassIris(this.resource, Number.MAX_SAFE_INTEGER);
  }

  private get childClassIris(): readonly NamedNode[] {
    return descendantClassIris(this.resource, 1);
  }

  private get descendantClassIris(): readonly NamedNode[] {
    return descendantClassIris(this.resource, Number.MAX_SAFE_INTEGER);
  }

  private get parentClassIris(): readonly NamedNode[] {
    return ancestorClassIris(this.resource, 1);
  }
}
