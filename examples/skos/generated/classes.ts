import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
// @ts-ignore
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";

export class Collection {
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

  equals(other: Collection): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
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

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Collection.hashCollection(this, hasher);
  }

  toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
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

    for (const memberValue of this.member) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
        memberValue,
      );
    }

    return resource;
  }
}

export namespace Collection {
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
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    return purify.Either.of(new Collection({ identifier, member }));
  }

  export function hashCollection<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    collection: Omit<
      Collection,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    > & { identifier?: rdfjs.NamedNode },
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
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
            this.variable("Member"),
          ),
        ),
      );
    }
  }
}

export class Concept {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly broader: readonly rdfjs.NamedNode[];
  readonly broaderTransitive: readonly rdfjs.NamedNode[];
  readonly broadMatch: readonly rdfjs.NamedNode[];
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
  readonly narrower: readonly rdfjs.NamedNode[];
  readonly narrowerTransitive: readonly rdfjs.NamedNode[];
  readonly narrowMatch: readonly rdfjs.NamedNode[];
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
      typeof parameters.altLabelXl !== "undefined" ? parameters.altLabelXl : [];
    this.broader =
      typeof parameters.broader !== "undefined" ? parameters.broader : [];
    this.broaderTransitive =
      typeof parameters.broaderTransitive !== "undefined"
        ? parameters.broaderTransitive
        : [];
    this.broadMatch =
      typeof parameters.broadMatch !== "undefined" ? parameters.broadMatch : [];
    this.changeNote =
      typeof parameters.changeNote !== "undefined" ? parameters.changeNote : [];
    this.closeMatch =
      typeof parameters.closeMatch !== "undefined" ? parameters.closeMatch : [];
    this.definition =
      typeof parameters.definition !== "undefined" ? parameters.definition : [];
    this.editorialNote =
      typeof parameters.editorialNote !== "undefined"
        ? parameters.editorialNote
        : [];
    this.exactMatch =
      typeof parameters.exactMatch !== "undefined" ? parameters.exactMatch : [];
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

  equals(other: Concept): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
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

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Concept.hash(this, hasher);
  }

  toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
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

    for (const altLabelValue of this.altLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        altLabelValue,
      );
    }

    for (const altLabelXlValue of this.altLabelXl) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
        altLabelXlValue,
      );
    }

    for (const broaderValue of this.broader) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
        broaderValue,
      );
    }

    for (const broaderTransitiveValue of this.broaderTransitive) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#broaderTransitive",
        ),
        broaderTransitiveValue,
      );
    }

    for (const broadMatchValue of this.broadMatch) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broadMatch"),
        broadMatchValue,
      );
    }

    for (const changeNoteValue of this.changeNote) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#changeNote"),
        changeNoteValue,
      );
    }

    for (const closeMatchValue of this.closeMatch) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#closeMatch"),
        closeMatchValue,
      );
    }

    for (const definitionValue of this.definition) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#definition"),
        definitionValue,
      );
    }

    for (const editorialNoteValue of this.editorialNote) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#editorialNote",
        ),
        editorialNoteValue,
      );
    }

    for (const exactMatchValue of this.exactMatch) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#exactMatch"),
        exactMatchValue,
      );
    }

    for (const exampleValue of this.example) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
        exampleValue,
      );
    }

    for (const hiddenLabelValue of this.hiddenLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        hiddenLabelValue,
      );
    }

    for (const hiddenLabelXlValue of this.hiddenLabelXl) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#hiddenLabel"),
        hiddenLabelXlValue,
      );
    }

    for (const historyNoteValue of this.historyNote) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#historyNote",
        ),
        historyNoteValue,
      );
    }

    for (const inSchemeValue of this.inScheme) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
        inSchemeValue,
      );
    }

    for (const mappingRelationValue of this.mappingRelation) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#mappingRelation",
        ),
        mappingRelationValue,
      );
    }

    for (const narrowerValue of this.narrower) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
        narrowerValue,
      );
    }

    for (const narrowerTransitiveValue of this.narrowerTransitive) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
        ),
        narrowerTransitiveValue,
      );
    }

    for (const narrowMatchValue of this.narrowMatch) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#narrowMatch",
        ),
        narrowMatchValue,
      );
    }

    for (const notationValue of this.notation) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
        notationValue,
      );
    }

    for (const noteValue of this.note) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
        noteValue,
      );
    }

    for (const prefLabelValue of this.prefLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
        prefLabelValue,
      );
    }

    for (const prefLabelXlValue of this.prefLabelXl) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
        prefLabelXlValue,
      );
    }

    for (const relatedValue of this.related) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
        relatedValue,
      );
    }

    for (const relatedMatchValue of this.relatedMatch) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#relatedMatch",
        ),
        relatedMatchValue,
      );
    }

    for (const scopeNoteValue of this.scopeNote) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#scopeNote"),
        scopeNoteValue,
      );
    }

    for (const semanticRelationValue of this.semanticRelation) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#semanticRelation",
        ),
        semanticRelationValue,
      );
    }

    for (const topConceptOfValue of this.topConceptOf) {
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

export namespace Concept {
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
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const altLabelXl = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
          { unique: true },
        )
        .flatMap((value) => value.toIdentifier().toMaybe().toList()),
    ];
    const broader = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const broaderTransitive = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broaderTransitive",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const broadMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broadMatch",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const changeNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#changeNote",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const closeMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#closeMatch",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const definition = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#definition",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const editorialNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#editorialNote",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const exactMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#exactMatch",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const example = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const hiddenLabel = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const hiddenLabelXl = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIdentifier().toMaybe().toList()),
    ];
    const historyNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#historyNote",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const identifier = resource.identifier;
    const inScheme = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const mappingRelation = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#mappingRelation",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const narrower = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const narrowerTransitive = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const narrowMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowMatch",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const notation = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const note = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const prefLabel = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const prefLabelXl = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          { unique: true },
        )
        .flatMap((value) => value.toIdentifier().toMaybe().toList()),
    ];
    const related = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const relatedMatch = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#relatedMatch",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const scopeNote = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#scopeNote",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const semanticRelation = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#semanticRelation",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const topConceptOf = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#topConceptOf",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    return purify.Either.of(
      new Concept({
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
      }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    concept: Omit<
      Concept,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    > & { identifier?: rdfjs.NamedNode },
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
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#altLabel",
            ),
            this.variable("AltLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
            this.variable("AltLabelXl"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#broader",
            ),
            this.variable("Broader"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#broaderTransitive",
            ),
            this.variable("BroaderTransitive"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#broadMatch",
            ),
            this.variable("BroadMatch"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#changeNote",
            ),
            this.variable("ChangeNote"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#closeMatch",
            ),
            this.variable("CloseMatch"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#definition",
            ),
            this.variable("Definition"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#editorialNote",
            ),
            this.variable("EditorialNote"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#exactMatch",
            ),
            this.variable("ExactMatch"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#example",
            ),
            this.variable("Example"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#altLabel",
            ),
            this.variable("HiddenLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
            ),
            this.variable("HiddenLabelXl"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#historyNote",
            ),
            this.variable("HistoryNote"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#inScheme",
            ),
            this.variable("InScheme"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#mappingRelation",
            ),
            this.variable("MappingRelation"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#narrower",
            ),
            this.variable("Narrower"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
            ),
            this.variable("NarrowerTransitive"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#narrowMatch",
            ),
            this.variable("NarrowMatch"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#notation",
            ),
            this.variable("Notation"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#notation",
            ),
            this.variable("Note"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#prefLabel",
            ),
            this.variable("PrefLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2008/05/skos-xl#prefLabel",
            ),
            this.variable("PrefLabelXl"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#related",
            ),
            this.variable("Related"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#relatedMatch",
            ),
            this.variable("RelatedMatch"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#scopeNote",
            ),
            this.variable("ScopeNote"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#semanticRelation",
            ),
            this.variable("SemanticRelation"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#topConceptOf",
            ),
            this.variable("TopConceptOf"),
          ),
        ),
      );
    }
  }
}

export class ConceptScheme {
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

  equals(other: ConceptScheme): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
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

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return ConceptScheme.hash(this, hasher);
  }

  toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
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

    for (const altLabelValue of this.altLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        altLabelValue,
      );
    }

    for (const hasTopConceptValue of this.hasTopConcept) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#hasTopConcept",
        ),
        hasTopConceptValue,
      );
    }

    for (const hiddenLabelValue of this.hiddenLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        hiddenLabelValue,
      );
    }

    for (const prefLabelValue of this.prefLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
        prefLabelValue,
      );
    }

    return resource;
  }
}

export namespace ConceptScheme {
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
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    const hasTopConcept = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hasTopConcept",
          ),
          { unique: true },
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const hiddenLabel = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
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
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    return purify.Either.of(
      new ConceptScheme({
        altLabel,
        hasTopConcept,
        hiddenLabel,
        identifier,
        prefLabel,
      }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    conceptScheme: Omit<
      ConceptScheme,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    > & { identifier?: rdfjs.NamedNode },
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
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#altLabel",
            ),
            this.variable("AltLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#hasTopConcept",
            ),
            this.variable("HasTopConcept"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#altLabel",
            ),
            this.variable("HiddenLabel"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#prefLabel",
            ),
            this.variable("PrefLabel"),
          ),
        ),
      );
    }
  }
}

export class Label {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly skos$j$xl_literalForm: readonly rdfjs.Literal[];
  readonly type = "Label" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly skos$j$xl_literalForm?: readonly rdfjs.Literal[];
  }) {
    this.identifier = parameters.identifier;
    this.skos$j$xl_literalForm =
      typeof parameters.skos$j$xl_literalForm !== "undefined"
        ? parameters.skos$j$xl_literalForm
        : [];
  }

  equals(other: Label): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
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

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Label.hash(this, hasher);
  }

  toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const resource = resourceSet.mutableResource({
      identifier: this.identifier,
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

    for (const skos$j$xl_literalFormValue of this.skos$j$xl_literalForm) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
        skos$j$xl_literalFormValue,
      );
    }

    return resource;
  }
}

export namespace Label {
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
          { unique: true },
        )
        .flatMap((value) => value.toLiteral().toMaybe().toList()),
    ];
    return purify.Either.of(new Label({ identifier, skos$j$xl_literalForm }));
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    label: Omit<Label, "equals" | "hash" | "identifier" | "toRdf" | "type"> & {
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
}

export class OrderedCollection extends Collection {
  readonly memberList: readonly rdfjs.NamedNode[];
  override readonly type = "OrderedCollection" as const;

  constructor(
    parameters: {
      readonly memberList: readonly rdfjs.NamedNode[];
    } & ConstructorParameters<typeof Collection>[0],
  ) {
    super(parameters);
    this.memberList = parameters.memberList;
  }

  override equals(
    other: OrderedCollection,
  ): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
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

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return OrderedCollection.hashOrderedCollection(this, hasher);
  }

  override toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = super.toRdf({
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
      this.memberList.reduce(
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

          if (itemIndex + 1 === this.memberList.length) {
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

export namespace OrderedCollection {
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
        const _memberListEither = resource
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
        return purify.Either.of(
          new OrderedCollection({
            identifier: _super.identifier,
            member: _super.member,
            memberList,
          }),
        );
      },
    );
  }

  export function hashOrderedCollection<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    orderedCollection: Omit<
      OrderedCollection,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    > & { identifier?: rdfjs.NamedNode },
    hasher: HasherT,
  ): HasherT {
    Collection.hashCollection(orderedCollection, hasher);
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
        sparqlBuilder.GraphPattern.group(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#memberList",
            ),
            this.variable("MemberList"),
          ).chainObject(
            (memberList) =>
              new sparqlBuilder.RdfListGraphPatterns({ rdfList: memberList }),
          ),
        ),
      );
    }
  }
}
