import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

export interface Collection {
  readonly identifier: rdfjs.NamedNode;
  readonly member: readonly rdfjs.NamedNode[];
  readonly type: "Collection" | "OrderedCollection";
}

export namespace Collection {
  export class Class implements Collection {
    readonly identifier: rdfjs.NamedNode;
    readonly member: readonly rdfjs.NamedNode[];
    readonly type: "Collection" | "OrderedCollection" = "Collection";

    constructor(parameters: {
      readonly identifier: rdfjs.NamedNode;
      readonly member?: readonly rdfjs.NamedNode[];
    }) {
      this.identifier = parameters.identifier;
      this.member =
        typeof parameters.member !== "undefined" ? parameters.member : [];
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, Collection.Class> {
      return Collection.fromRdf(resource).map(
        (properties) => new Collection.Class(properties),
      );
    }

    equals(other: Collection): purifyHelpers.Equatable.EqualsResult {
      return Collection.equals(this, other);
    }

    hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return Collection.hash(this, hasher);
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return Collection.toRdf(this, kwds);
    }
  }

  export function equals(
    left: Collection,
    right: Collection,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      member: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Collection> {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#Collection"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#Collection",
          ),
        }),
      );
    }

    const identifier = resource.identifier;
    const member = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const type = "Collection" as const;
    return purify.Either.of({ identifier, member, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    collection: Omit<Collection, "identifier"> & {
      identifier?: rdfjs.NamedNode;
    },
    hasher: HasherT,
  ): HasherT {
    if (typeof collection.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(collection.identifier),
      );
    }

    for (const _element of collection.member) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Collection",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
          this.variable("Member"),
        ),
      );
    }
  }

  export function toRdf(
    collection: Collection,
    {
      ignoreRdfType,
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: collection.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Collection",
        ),
      );
    }

    for (const memberValue of collection.member) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
        memberValue,
      );
    }

    return resource;
  }
}

export interface Concept {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly broadMatch: readonly rdfjs.NamedNode[];
  readonly broader: readonly rdfjs.NamedNode[];
  readonly broaderTransitive: readonly rdfjs.NamedNode[];
  readonly changeNote: readonly rdfjs.Literal[];
  readonly closeMatch: readonly rdfjs.NamedNode[];
  readonly definition: readonly rdfjs.Literal[];
  readonly editorialNote: readonly rdfjs.Literal[];
  readonly exactMatch: readonly rdfjs.NamedNode[];
  readonly example: readonly rdfjs.Literal[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly historyNote: readonly rdfjs.Literal[];
  readonly identifier: rdfjs.NamedNode;
  readonly inScheme: readonly rdfjs.NamedNode[];
  readonly mappingRelation: readonly rdfjs.NamedNode[];
  readonly narrowMatch: readonly rdfjs.NamedNode[];
  readonly narrower: readonly rdfjs.NamedNode[];
  readonly narrowerTransitive: readonly rdfjs.NamedNode[];
  readonly notation: readonly rdfjs.Literal[];
  readonly note: readonly rdfjs.Literal[];
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly related: readonly rdfjs.NamedNode[];
  readonly relatedMatch: readonly rdfjs.NamedNode[];
  readonly scopeNote: readonly rdfjs.Literal[];
  readonly semanticRelation: readonly rdfjs.NamedNode[];
  readonly topConceptOf: readonly rdfjs.NamedNode[];
  readonly type: "Concept";
}

export namespace Concept {
  export class Class implements Concept {
    readonly altLabel: readonly rdfjs.Literal[];
    readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly broadMatch: readonly rdfjs.NamedNode[];
    readonly broader: readonly rdfjs.NamedNode[];
    readonly broaderTransitive: readonly rdfjs.NamedNode[];
    readonly changeNote: readonly rdfjs.Literal[];
    readonly closeMatch: readonly rdfjs.NamedNode[];
    readonly definition: readonly rdfjs.Literal[];
    readonly editorialNote: readonly rdfjs.Literal[];
    readonly exactMatch: readonly rdfjs.NamedNode[];
    readonly example: readonly rdfjs.Literal[];
    readonly hiddenLabel: readonly rdfjs.Literal[];
    readonly hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly historyNote: readonly rdfjs.Literal[];
    readonly identifier: rdfjs.NamedNode;
    readonly inScheme: readonly rdfjs.NamedNode[];
    readonly mappingRelation: readonly rdfjs.NamedNode[];
    readonly narrowMatch: readonly rdfjs.NamedNode[];
    readonly narrower: readonly rdfjs.NamedNode[];
    readonly narrowerTransitive: readonly rdfjs.NamedNode[];
    readonly notation: readonly rdfjs.Literal[];
    readonly note: readonly rdfjs.Literal[];
    readonly prefLabel: readonly rdfjs.Literal[];
    readonly prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly related: readonly rdfjs.NamedNode[];
    readonly relatedMatch: readonly rdfjs.NamedNode[];
    readonly scopeNote: readonly rdfjs.Literal[];
    readonly semanticRelation: readonly rdfjs.NamedNode[];
    readonly topConceptOf: readonly rdfjs.NamedNode[];
    readonly type = "Concept" as const;

    constructor(parameters: {
      readonly altLabel?: readonly rdfjs.Literal[];
      readonly altLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      readonly broader?: readonly rdfjs.NamedNode[];
      readonly broaderTransitive?: readonly rdfjs.NamedNode[];
      readonly broadMatch?: readonly rdfjs.NamedNode[];
      readonly changeNote?: readonly rdfjs.Literal[];
      readonly closeMatch?: readonly rdfjs.NamedNode[];
      readonly definition?: readonly rdfjs.Literal[];
      readonly editorialNote?: readonly rdfjs.Literal[];
      readonly exactMatch?: readonly rdfjs.NamedNode[];
      readonly example?: readonly rdfjs.Literal[];
      readonly hiddenLabel?: readonly rdfjs.Literal[];
      readonly hiddenLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      readonly historyNote?: readonly rdfjs.Literal[];
      readonly identifier: rdfjs.NamedNode;
      readonly inScheme?: readonly rdfjs.NamedNode[];
      readonly mappingRelation?: readonly rdfjs.NamedNode[];
      readonly narrower?: readonly rdfjs.NamedNode[];
      readonly narrowerTransitive?: readonly rdfjs.NamedNode[];
      readonly narrowMatch?: readonly rdfjs.NamedNode[];
      readonly notation?: readonly rdfjs.Literal[];
      readonly note?: readonly rdfjs.Literal[];
      readonly prefLabel?: readonly rdfjs.Literal[];
      readonly prefLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      readonly related?: readonly rdfjs.NamedNode[];
      readonly relatedMatch?: readonly rdfjs.NamedNode[];
      readonly scopeNote?: readonly rdfjs.Literal[];
      readonly semanticRelation?: readonly rdfjs.NamedNode[];
      readonly topConceptOf?: readonly rdfjs.NamedNode[];
    }) {
      this.altLabel =
        typeof parameters.altLabel !== "undefined" ? parameters.altLabel : [];
      this.altLabelXl =
        typeof parameters.altLabelXl !== "undefined"
          ? parameters.altLabelXl
          : [];
      this.broader =
        typeof parameters.broader !== "undefined" ? parameters.broader : [];
      this.broaderTransitive =
        typeof parameters.broaderTransitive !== "undefined"
          ? parameters.broaderTransitive
          : [];
      this.broadMatch =
        typeof parameters.broadMatch !== "undefined"
          ? parameters.broadMatch
          : [];
      this.changeNote =
        typeof parameters.changeNote !== "undefined"
          ? parameters.changeNote
          : [];
      this.closeMatch =
        typeof parameters.closeMatch !== "undefined"
          ? parameters.closeMatch
          : [];
      this.definition =
        typeof parameters.definition !== "undefined"
          ? parameters.definition
          : [];
      this.editorialNote =
        typeof parameters.editorialNote !== "undefined"
          ? parameters.editorialNote
          : [];
      this.exactMatch =
        typeof parameters.exactMatch !== "undefined"
          ? parameters.exactMatch
          : [];
      this.example =
        typeof parameters.example !== "undefined" ? parameters.example : [];
      this.hiddenLabel =
        typeof parameters.hiddenLabel !== "undefined"
          ? parameters.hiddenLabel
          : [];
      this.hiddenLabelXl =
        typeof parameters.hiddenLabelXl !== "undefined"
          ? parameters.hiddenLabelXl
          : [];
      this.historyNote =
        typeof parameters.historyNote !== "undefined"
          ? parameters.historyNote
          : [];
      this.identifier = parameters.identifier;
      this.inScheme =
        typeof parameters.inScheme !== "undefined" ? parameters.inScheme : [];
      this.mappingRelation =
        typeof parameters.mappingRelation !== "undefined"
          ? parameters.mappingRelation
          : [];
      this.narrower =
        typeof parameters.narrower !== "undefined" ? parameters.narrower : [];
      this.narrowerTransitive =
        typeof parameters.narrowerTransitive !== "undefined"
          ? parameters.narrowerTransitive
          : [];
      this.narrowMatch =
        typeof parameters.narrowMatch !== "undefined"
          ? parameters.narrowMatch
          : [];
      this.notation =
        typeof parameters.notation !== "undefined" ? parameters.notation : [];
      this.note = typeof parameters.note !== "undefined" ? parameters.note : [];
      this.prefLabel =
        typeof parameters.prefLabel !== "undefined" ? parameters.prefLabel : [];
      this.prefLabelXl =
        typeof parameters.prefLabelXl !== "undefined"
          ? parameters.prefLabelXl
          : [];
      this.related =
        typeof parameters.related !== "undefined" ? parameters.related : [];
      this.relatedMatch =
        typeof parameters.relatedMatch !== "undefined"
          ? parameters.relatedMatch
          : [];
      this.scopeNote =
        typeof parameters.scopeNote !== "undefined" ? parameters.scopeNote : [];
      this.semanticRelation =
        typeof parameters.semanticRelation !== "undefined"
          ? parameters.semanticRelation
          : [];
      this.topConceptOf =
        typeof parameters.topConceptOf !== "undefined"
          ? parameters.topConceptOf
          : [];
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, Concept.Class> {
      return Concept.fromRdf(resource).map(
        (properties) => new Concept.Class(properties),
      );
    }

    equals(other: Concept): purifyHelpers.Equatable.EqualsResult {
      return Concept.equals(this, other);
    }

    hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return Concept.hash(this, hasher);
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return Concept.toRdf(this, kwds);
    }
  }

  export function equals(
    left: Concept,
    right: Concept,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      altLabel: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      altLabelXl: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      broader: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      broaderTransitive: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      broadMatch: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      changeNote: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      closeMatch: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      definition: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      editorialNote: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      exactMatch: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      example: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      hiddenLabel: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      hiddenLabelXl: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      historyNote: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      inScheme: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      mappingRelation: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      narrower: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      narrowerTransitive: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      narrowMatch: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      notation: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      note: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      prefLabel: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      prefLabelXl: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      related: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      relatedMatch: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      scopeNote: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      semanticRelation: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      topConceptOf: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Concept> {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#Concept"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#Concept",
          ),
        }),
      );
    }

    const altLabel = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const altLabelXl = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
        )
        .flatMap((value) => value.toIdentifier().toMaybe().toList()),
    ];
    const broader = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const broaderTransitive = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broaderTransitive",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const broadMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broadMatch",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const changeNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#changeNote",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const closeMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#closeMatch",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const definition = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#definition",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const editorialNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#editorialNote",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const exactMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#exactMatch",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const example = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const hiddenLabel = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const hiddenLabelXl = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
        )
        .flatMap((value) => value.toIdentifier().toMaybe().toList()),
    ];
    const historyNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#historyNote",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const identifier = resource.identifier;
    const inScheme = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const mappingRelation = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#mappingRelation",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const narrower = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const narrowerTransitive = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const narrowMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowMatch",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const notation = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const note = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const prefLabel = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const prefLabelXl = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
        )
        .flatMap((value) => value.toIdentifier().toMaybe().toList()),
    ];
    const related = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const relatedMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#relatedMatch",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const scopeNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#scopeNote",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const semanticRelation = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#semanticRelation",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const topConceptOf = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#topConceptOf",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const type = "Concept" as const;
    return purify.Either.of({
      altLabel,
      altLabelXl,
      broader,
      broaderTransitive,
      broadMatch,
      changeNote,
      closeMatch,
      definition,
      editorialNote,
      exactMatch,
      example,
      hiddenLabel,
      hiddenLabelXl,
      historyNote,
      identifier,
      inScheme,
      mappingRelation,
      narrower,
      narrowerTransitive,
      narrowMatch,
      notation,
      note,
      prefLabel,
      prefLabelXl,
      related,
      relatedMatch,
      scopeNote,
      semanticRelation,
      topConceptOf,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    concept: Omit<Concept, "identifier"> & { identifier?: rdfjs.NamedNode },
    hasher: HasherT,
  ): HasherT {
    for (const _element of concept.altLabel) {
      hasher.update(_element.value);
    }

    for (const _element of concept.altLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.broader) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.broaderTransitive) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.broadMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.changeNote) {
      hasher.update(_element.value);
    }

    for (const _element of concept.closeMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.definition) {
      hasher.update(_element.value);
    }

    for (const _element of concept.editorialNote) {
      hasher.update(_element.value);
    }

    for (const _element of concept.exactMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.example) {
      hasher.update(_element.value);
    }

    for (const _element of concept.hiddenLabel) {
      hasher.update(_element.value);
    }

    for (const _element of concept.hiddenLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.historyNote) {
      hasher.update(_element.value);
    }

    if (typeof concept.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(concept.identifier),
      );
    }

    for (const _element of concept.inScheme) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.mappingRelation) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.narrower) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.narrowerTransitive) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.narrowMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.notation) {
      hasher.update(_element.value);
    }

    for (const _element of concept.note) {
      hasher.update(_element.value);
    }

    for (const _element of concept.prefLabel) {
      hasher.update(_element.value);
    }

    for (const _element of concept.prefLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.related) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.relatedMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.scopeNote) {
      hasher.update(_element.value);
    }

    for (const _element of concept.semanticRelation) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.topConceptOf) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Concept",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          this.variable("AltLabel"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
          this.variable("AltLabelXl"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
          this.variable("Broader"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broaderTransitive",
          ),
          this.variable("BroaderTransitive"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broadMatch",
          ),
          this.variable("BroadMatch"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#changeNote",
          ),
          this.variable("ChangeNote"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#closeMatch",
          ),
          this.variable("CloseMatch"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#definition",
          ),
          this.variable("Definition"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#editorialNote",
          ),
          this.variable("EditorialNote"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#exactMatch",
          ),
          this.variable("ExactMatch"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
          this.variable("Example"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          this.variable("HiddenLabel"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
          this.variable("HiddenLabelXl"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#historyNote",
          ),
          this.variable("HistoryNote"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
          this.variable("InScheme"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#mappingRelation",
          ),
          this.variable("MappingRelation"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
          this.variable("Narrower"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
          ),
          this.variable("NarrowerTransitive"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowMatch",
          ),
          this.variable("NarrowMatch"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          this.variable("Notation"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          this.variable("Note"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          this.variable("PrefLabel"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          this.variable("PrefLabelXl"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
          this.variable("Related"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#relatedMatch",
          ),
          this.variable("RelatedMatch"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#scopeNote",
          ),
          this.variable("ScopeNote"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#semanticRelation",
          ),
          this.variable("SemanticRelation"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#topConceptOf",
          ),
          this.variable("TopConceptOf"),
        ),
      );
    }
  }

  export function toRdf(
    concept: Concept,
    {
      ignoreRdfType,
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: concept.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Concept",
        ),
      );
    }

    for (const altLabelValue of concept.altLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        altLabelValue,
      );
    }

    for (const altLabelXlValue of concept.altLabelXl) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
        altLabelXlValue,
      );
    }

    for (const broaderValue of concept.broader) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
        broaderValue,
      );
    }

    for (const broaderTransitiveValue of concept.broaderTransitive) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#broaderTransitive",
        ),
        broaderTransitiveValue,
      );
    }

    for (const broadMatchValue of concept.broadMatch) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broadMatch"),
        broadMatchValue,
      );
    }

    for (const changeNoteValue of concept.changeNote) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#changeNote"),
        changeNoteValue,
      );
    }

    for (const closeMatchValue of concept.closeMatch) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#closeMatch"),
        closeMatchValue,
      );
    }

    for (const definitionValue of concept.definition) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#definition"),
        definitionValue,
      );
    }

    for (const editorialNoteValue of concept.editorialNote) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#editorialNote",
        ),
        editorialNoteValue,
      );
    }

    for (const exactMatchValue of concept.exactMatch) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#exactMatch"),
        exactMatchValue,
      );
    }

    for (const exampleValue of concept.example) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
        exampleValue,
      );
    }

    for (const hiddenLabelValue of concept.hiddenLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        hiddenLabelValue,
      );
    }

    for (const hiddenLabelXlValue of concept.hiddenLabelXl) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#hiddenLabel"),
        hiddenLabelXlValue,
      );
    }

    for (const historyNoteValue of concept.historyNote) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#historyNote",
        ),
        historyNoteValue,
      );
    }

    for (const inSchemeValue of concept.inScheme) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
        inSchemeValue,
      );
    }

    for (const mappingRelationValue of concept.mappingRelation) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#mappingRelation",
        ),
        mappingRelationValue,
      );
    }

    for (const narrowerValue of concept.narrower) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
        narrowerValue,
      );
    }

    for (const narrowerTransitiveValue of concept.narrowerTransitive) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
        ),
        narrowerTransitiveValue,
      );
    }

    for (const narrowMatchValue of concept.narrowMatch) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#narrowMatch",
        ),
        narrowMatchValue,
      );
    }

    for (const notationValue of concept.notation) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
        notationValue,
      );
    }

    for (const noteValue of concept.note) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
        noteValue,
      );
    }

    for (const prefLabelValue of concept.prefLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
        prefLabelValue,
      );
    }

    for (const prefLabelXlValue of concept.prefLabelXl) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
        prefLabelXlValue,
      );
    }

    for (const relatedValue of concept.related) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
        relatedValue,
      );
    }

    for (const relatedMatchValue of concept.relatedMatch) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#relatedMatch",
        ),
        relatedMatchValue,
      );
    }

    for (const scopeNoteValue of concept.scopeNote) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#scopeNote"),
        scopeNoteValue,
      );
    }

    for (const semanticRelationValue of concept.semanticRelation) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#semanticRelation",
        ),
        semanticRelationValue,
      );
    }

    for (const topConceptOfValue of concept.topConceptOf) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#topConceptOf",
        ),
        topConceptOfValue,
      );
    }

    return resource;
  }
}

export interface ConceptScheme {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly hasTopConcept: readonly rdfjs.NamedNode[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly identifier: rdfjs.NamedNode;
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly type: "ConceptScheme";
}

export namespace ConceptScheme {
  export class Class implements ConceptScheme {
    readonly altLabel: readonly rdfjs.Literal[];
    readonly hasTopConcept: readonly rdfjs.NamedNode[];
    readonly hiddenLabel: readonly rdfjs.Literal[];
    readonly identifier: rdfjs.NamedNode;
    readonly prefLabel: readonly rdfjs.Literal[];
    readonly type = "ConceptScheme" as const;

    constructor(parameters: {
      readonly altLabel?: readonly rdfjs.Literal[];
      readonly hasTopConcept?: readonly rdfjs.NamedNode[];
      readonly hiddenLabel?: readonly rdfjs.Literal[];
      readonly identifier: rdfjs.NamedNode;
      readonly prefLabel?: readonly rdfjs.Literal[];
    }) {
      this.altLabel =
        typeof parameters.altLabel !== "undefined" ? parameters.altLabel : [];
      this.hasTopConcept =
        typeof parameters.hasTopConcept !== "undefined"
          ? parameters.hasTopConcept
          : [];
      this.hiddenLabel =
        typeof parameters.hiddenLabel !== "undefined"
          ? parameters.hiddenLabel
          : [];
      this.identifier = parameters.identifier;
      this.prefLabel =
        typeof parameters.prefLabel !== "undefined" ? parameters.prefLabel : [];
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, ConceptScheme.Class> {
      return ConceptScheme.fromRdf(resource).map(
        (properties) => new ConceptScheme.Class(properties),
      );
    }

    equals(other: ConceptScheme): purifyHelpers.Equatable.EqualsResult {
      return ConceptScheme.equals(this, other);
    }

    hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return ConceptScheme.hash(this, hasher);
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return ConceptScheme.toRdf(this, kwds);
    }
  }

  export function equals(
    left: ConceptScheme,
    right: ConceptScheme,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      altLabel: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      hasTopConcept: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      hiddenLabel: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      prefLabel: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, ConceptScheme> {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#ConceptScheme",
          ),
        }),
      );
    }

    const altLabel = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const hasTopConcept = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hasTopConcept",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const hiddenLabel = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const identifier = resource.identifier;
    const prefLabel = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const type = "ConceptScheme" as const;
    return purify.Either.of({
      altLabel,
      hasTopConcept,
      hiddenLabel,
      identifier,
      prefLabel,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    conceptScheme: Omit<ConceptScheme, "identifier"> & {
      identifier?: rdfjs.NamedNode;
    },
    hasher: HasherT,
  ): HasherT {
    for (const _element of conceptScheme.altLabel) {
      hasher.update(_element.value);
    }

    for (const _element of conceptScheme.hasTopConcept) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of conceptScheme.hiddenLabel) {
      hasher.update(_element.value);
    }

    if (typeof conceptScheme.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(conceptScheme.identifier),
      );
    }

    for (const _element of conceptScheme.prefLabel) {
      hasher.update(_element.value);
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#ConceptScheme",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          this.variable("AltLabel"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hasTopConcept",
          ),
          this.variable("HasTopConcept"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          this.variable("HiddenLabel"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          this.variable("PrefLabel"),
        ),
      );
    }
  }

  export function toRdf(
    conceptScheme: ConceptScheme,
    {
      ignoreRdfType,
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: conceptScheme.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      );
    }

    for (const altLabelValue of conceptScheme.altLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        altLabelValue,
      );
    }

    for (const hasTopConceptValue of conceptScheme.hasTopConcept) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#hasTopConcept",
        ),
        hasTopConceptValue,
      );
    }

    for (const hiddenLabelValue of conceptScheme.hiddenLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        hiddenLabelValue,
      );
    }

    for (const prefLabelValue of conceptScheme.prefLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
        prefLabelValue,
      );
    }

    return resource;
  }
}

export interface Label {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly skos$j$xl_literalForm: readonly rdfjs.Literal[];
  readonly type: "Label";
}

export namespace Label {
  export class Class implements Label {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly skos$j$xl_literalForm: readonly rdfjs.Literal[];
    readonly type = "Label" as const;

    constructor(parameters: {
      readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      readonly skos$j$xl_literalForm: readonly rdfjs.Literal[];
    }) {
      this.identifier = parameters.identifier;
      this.skos$j$xl_literalForm = parameters.skos$j$xl_literalForm;
    }

    static fromRdf(
      resource: rdfjsResource.Resource,
    ): purify.Either<rdfjsResource.Resource.ValueError, Label.Class> {
      return Label.fromRdf(resource).map(
        (properties) => new Label.Class(properties),
      );
    }

    equals(other: Label): purifyHelpers.Equatable.EqualsResult {
      return Label.equals(this, other);
    }

    hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return Label.hash(this, hasher);
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource {
      return Label.toRdf(this, kwds);
    }
  }

  export function equals(
    left: Label,
    right: Label,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      skos$j$xl_literalForm: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Label> {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#Label"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#Label",
          ),
        }),
      );
    }

    const identifier = resource.identifier;
    const skos$j$xl_literalForm = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const type = "Label" as const;
    return purify.Either.of({ identifier, skos$j$xl_literalForm, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    label: Omit<Label, "identifier"> & {
      identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    },
    hasher: HasherT,
  ): HasherT {
    if (typeof label.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(label.identifier),
      );
    }

    for (const _element of label.skos$j$xl_literalForm) {
      hasher.update(_element.value);
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#Label"),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          this.variable("SkosJXlLiteralForm"),
        ),
      );
    }
  }

  export function toRdf(
    label: Label,
    {
      ignoreRdfType,
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const resource = resourceSet.mutableResource({
      identifier: label.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#Label",
        ),
      );
    }

    for (const skos$j$xl_literalFormValue of label.skos$j$xl_literalForm) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
        skos$j$xl_literalFormValue,
      );
    }

    return resource;
  }
}

export interface OrderedCollection extends Collection {
  readonly memberList: readonly rdfjs.NamedNode[];
  readonly type: "OrderedCollection";
}

export namespace OrderedCollection {
  export class Class extends Collection.Class implements OrderedCollection {
    readonly memberList: readonly rdfjs.NamedNode[];
    override readonly type = "OrderedCollection" as const;

    constructor(
      parameters: {
        readonly memberList: readonly rdfjs.NamedNode[];
      } & ConstructorParameters<typeof Collection.Class>[0],
    ) {
      super(parameters);
      this.memberList = parameters.memberList;
    }

    static override fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<
      rdfjsResource.Resource.ValueError,
      OrderedCollection.Class
    > {
      return OrderedCollection.fromRdf(resource).map(
        (properties) => new OrderedCollection.Class(properties),
      );
    }

    override equals(
      other: OrderedCollection,
    ): purifyHelpers.Equatable.EqualsResult {
      return OrderedCollection.equals(this, other);
    }

    override hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return OrderedCollection.hash(this, hasher);
    }

    override toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return OrderedCollection.toRdf(this, kwds);
    }
  }

  export function equals(
    left: OrderedCollection,
    right: OrderedCollection,
  ): purifyHelpers.Equatable.EqualsResult {
    return Collection.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
        memberList: (left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ),
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, OrderedCollection> {
    return Collection.fromRdf(resource, { ignoreRdfType: true }).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !resource.isInstanceOf(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#OrderedCollection",
            ),
          )
        ) {
          return purify.Left(
            new rdfjsResource.Resource.ValueError({
              focusResource: resource,
              message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#OrderedCollection",
              ),
            }),
          );
        }
        const _memberListEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = resource
          .value(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#memberList",
            ),
          )
          .chain((value) =>
            value
              .toList()
              .map((values) =>
                values.flatMap((value) => value.toIri().toMaybe().toList()),
              ),
          );
        if (_memberListEither.isLeft()) {
          return _memberListEither;
        }
        const memberList = _memberListEither.unsafeCoerce();
        const type = "OrderedCollection" as const;
        return purify.Either.of({ ..._super, memberList, type });
      },
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    orderedCollection: Omit<OrderedCollection, "identifier"> & {
      identifier?: rdfjs.NamedNode;
    },
    hasher: HasherT,
  ): HasherT {
    Collection.hash(orderedCollection, hasher);
    for (const _element of orderedCollection.memberList) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends Collection.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#OrderedCollection",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#memberList",
          ),
          this.variable("MemberList"),
        ),
      );
    }
  }

  export function toRdf(
    orderedCollection: OrderedCollection,
    {
      ignoreRdfType,
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = Collection.toRdf(orderedCollection, {
      mutateGraph,
      ignoreRdfType: true,
      resourceSet,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#OrderedCollection",
        ),
      );
    }

    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#memberList"),
      orderedCollection.memberList.reduce(
        ({ currentSubListResource, listResource }, item, itemIndex) => {
          if (itemIndex === 0) {
            currentSubListResource = listResource;
          } else {
            const newSubListResource = resourceSet.mutableResource({
              identifier: dataFactory.blankNode(),
              mutateGraph: mutateGraph,
            });
            currentSubListResource!.add(
              dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
              ),
              newSubListResource.identifier,
            );
            currentSubListResource = newSubListResource;
          }

          currentSubListResource.add(
            dataFactory.namedNode(
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
            ),
            dataFactory.namedNode(
              "http://kos-kit.github.io/skos-shacl/ns#OrderedCollectionMemberList",
            ),
          );

          currentSubListResource.add(
            dataFactory.namedNode(
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
            ),
            item,
          );

          if (itemIndex + 1 === orderedCollection.memberList.length) {
            currentSubListResource.add(
              dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
              ),
              dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil",
              ),
            );
          }

          return { currentSubListResource, listResource };
        },
        {
          currentSubListResource: null,
          listResource: resourceSet.mutableResource({
            identifier: dataFactory.blankNode(),
            mutateGraph: mutateGraph,
          }),
        } as {
          currentSubListResource: rdfjsResource.MutableResource | null;
          listResource: rdfjsResource.MutableResource;
        },
      ).listResource.identifier,
    );
    return resource;
  }
}
