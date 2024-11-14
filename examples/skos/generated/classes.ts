import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
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
    if (typeof parameters.member === "undefined") {
      this.member = [];
    } else {
      this.member = parameters.member;
    }
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

    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
      this.member,
    );
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
    const _memberEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_memberEither.isLeft()) {
      return _memberEither;
    }

    const member = _memberEither.unsafeCoerce();
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
    >,
    hasher: HasherT,
  ): HasherT {
    for (const element of collection.member) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
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
    if (typeof parameters.altLabel === "undefined") {
      this.altLabel = [];
    } else {
      this.altLabel = parameters.altLabel;
    }

    if (typeof parameters.altLabelXl === "undefined") {
      this.altLabelXl = [];
    } else {
      this.altLabelXl = parameters.altLabelXl;
    }

    if (typeof parameters.broader === "undefined") {
      this.broader = [];
    } else {
      this.broader = parameters.broader;
    }

    if (typeof parameters.broaderTransitive === "undefined") {
      this.broaderTransitive = [];
    } else {
      this.broaderTransitive = parameters.broaderTransitive;
    }

    if (typeof parameters.broadMatch === "undefined") {
      this.broadMatch = [];
    } else {
      this.broadMatch = parameters.broadMatch;
    }

    if (typeof parameters.changeNote === "undefined") {
      this.changeNote = [];
    } else {
      this.changeNote = parameters.changeNote;
    }

    if (typeof parameters.closeMatch === "undefined") {
      this.closeMatch = [];
    } else {
      this.closeMatch = parameters.closeMatch;
    }

    if (typeof parameters.definition === "undefined") {
      this.definition = [];
    } else {
      this.definition = parameters.definition;
    }

    if (typeof parameters.editorialNote === "undefined") {
      this.editorialNote = [];
    } else {
      this.editorialNote = parameters.editorialNote;
    }

    if (typeof parameters.exactMatch === "undefined") {
      this.exactMatch = [];
    } else {
      this.exactMatch = parameters.exactMatch;
    }

    if (typeof parameters.example === "undefined") {
      this.example = [];
    } else {
      this.example = parameters.example;
    }

    if (typeof parameters.hiddenLabel === "undefined") {
      this.hiddenLabel = [];
    } else {
      this.hiddenLabel = parameters.hiddenLabel;
    }

    if (typeof parameters.hiddenLabelXl === "undefined") {
      this.hiddenLabelXl = [];
    } else {
      this.hiddenLabelXl = parameters.hiddenLabelXl;
    }

    if (typeof parameters.historyNote === "undefined") {
      this.historyNote = [];
    } else {
      this.historyNote = parameters.historyNote;
    }

    this.identifier = parameters.identifier;
    if (typeof parameters.inScheme === "undefined") {
      this.inScheme = [];
    } else {
      this.inScheme = parameters.inScheme;
    }

    if (typeof parameters.mappingRelation === "undefined") {
      this.mappingRelation = [];
    } else {
      this.mappingRelation = parameters.mappingRelation;
    }

    if (typeof parameters.narrower === "undefined") {
      this.narrower = [];
    } else {
      this.narrower = parameters.narrower;
    }

    if (typeof parameters.narrowerTransitive === "undefined") {
      this.narrowerTransitive = [];
    } else {
      this.narrowerTransitive = parameters.narrowerTransitive;
    }

    if (typeof parameters.narrowMatch === "undefined") {
      this.narrowMatch = [];
    } else {
      this.narrowMatch = parameters.narrowMatch;
    }

    if (typeof parameters.notation === "undefined") {
      this.notation = [];
    } else {
      this.notation = parameters.notation;
    }

    if (typeof parameters.note === "undefined") {
      this.note = [];
    } else {
      this.note = parameters.note;
    }

    if (typeof parameters.prefLabel === "undefined") {
      this.prefLabel = [];
    } else {
      this.prefLabel = parameters.prefLabel;
    }

    if (typeof parameters.prefLabelXl === "undefined") {
      this.prefLabelXl = [];
    } else {
      this.prefLabelXl = parameters.prefLabelXl;
    }

    if (typeof parameters.related === "undefined") {
      this.related = [];
    } else {
      this.related = parameters.related;
    }

    if (typeof parameters.relatedMatch === "undefined") {
      this.relatedMatch = [];
    } else {
      this.relatedMatch = parameters.relatedMatch;
    }

    if (typeof parameters.scopeNote === "undefined") {
      this.scopeNote = [];
    } else {
      this.scopeNote = parameters.scopeNote;
    }

    if (typeof parameters.semanticRelation === "undefined") {
      this.semanticRelation = [];
    } else {
      this.semanticRelation = parameters.semanticRelation;
    }

    if (typeof parameters.topConceptOf === "undefined") {
      this.topConceptOf = [];
    } else {
      this.topConceptOf = parameters.topConceptOf;
    }
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

    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
      this.altLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
      this.altLabelXl,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
      this.broader,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#broaderTransitive",
      ),
      this.broaderTransitive,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broadMatch"),
      this.broadMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#changeNote"),
      this.changeNote,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#closeMatch"),
      this.closeMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#definition"),
      this.definition,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#editorialNote",
      ),
      this.editorialNote,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#exactMatch"),
      this.exactMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
      this.example,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
      this.hiddenLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#hiddenLabel"),
      this.hiddenLabelXl,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#historyNote"),
      this.historyNote,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
      this.inScheme,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#mappingRelation",
      ),
      this.mappingRelation,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
      this.narrower,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
      ),
      this.narrowerTransitive,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrowMatch"),
      this.narrowMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      this.notation,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      this.note,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
      this.prefLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
      this.prefLabelXl,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
      this.related,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#relatedMatch"),
      this.relatedMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#scopeNote"),
      this.scopeNote,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#semanticRelation",
      ),
      this.semanticRelation,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#topConceptOf"),
      this.topConceptOf,
    );
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

    const _altLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_altLabelEither.isLeft()) {
      return _altLabelEither;
    }

    const altLabel = _altLabelEither.unsafeCoerce();
    const _altLabelXlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly (rdfjs.BlankNode | rdfjs.NamedNode)[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toIdentifier().toMaybe().toList(),
        ),
    ]);
    if (_altLabelXlEither.isLeft()) {
      return _altLabelXlEither;
    }

    const altLabelXl = _altLabelXlEither.unsafeCoerce();
    const _broaderEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_broaderEither.isLeft()) {
      return _broaderEither;
    }

    const broader = _broaderEither.unsafeCoerce();
    const _broaderTransitiveEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broaderTransitive",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_broaderTransitiveEither.isLeft()) {
      return _broaderTransitiveEither;
    }

    const broaderTransitive = _broaderTransitiveEither.unsafeCoerce();
    const _broadMatchEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#broadMatch",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_broadMatchEither.isLeft()) {
      return _broadMatchEither;
    }

    const broadMatch = _broadMatchEither.unsafeCoerce();
    const _changeNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#changeNote",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_changeNoteEither.isLeft()) {
      return _changeNoteEither;
    }

    const changeNote = _changeNoteEither.unsafeCoerce();
    const _closeMatchEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#closeMatch",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_closeMatchEither.isLeft()) {
      return _closeMatchEither;
    }

    const closeMatch = _closeMatchEither.unsafeCoerce();
    const _definitionEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#definition",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_definitionEither.isLeft()) {
      return _definitionEither;
    }

    const definition = _definitionEither.unsafeCoerce();
    const _editorialNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#editorialNote",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_editorialNoteEither.isLeft()) {
      return _editorialNoteEither;
    }

    const editorialNote = _editorialNoteEither.unsafeCoerce();
    const _exactMatchEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#exactMatch",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_exactMatchEither.isLeft()) {
      return _exactMatchEither;
    }

    const exactMatch = _exactMatchEither.unsafeCoerce();
    const _exampleEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_exampleEither.isLeft()) {
      return _exampleEither;
    }

    const example = _exampleEither.unsafeCoerce();
    const _hiddenLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_hiddenLabelEither.isLeft()) {
      return _hiddenLabelEither;
    }

    const hiddenLabel = _hiddenLabelEither.unsafeCoerce();
    const _hiddenLabelXlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly (rdfjs.BlankNode | rdfjs.NamedNode)[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toIdentifier().toMaybe().toList(),
        ),
    ]);
    if (_hiddenLabelXlEither.isLeft()) {
      return _hiddenLabelXlEither;
    }

    const hiddenLabelXl = _hiddenLabelXlEither.unsafeCoerce();
    const _historyNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#historyNote",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_historyNoteEither.isLeft()) {
      return _historyNoteEither;
    }

    const historyNote = _historyNoteEither.unsafeCoerce();
    const identifier = resource.identifier;
    const _inSchemeEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_inSchemeEither.isLeft()) {
      return _inSchemeEither;
    }

    const inScheme = _inSchemeEither.unsafeCoerce();
    const _mappingRelationEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#mappingRelation",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_mappingRelationEither.isLeft()) {
      return _mappingRelationEither;
    }

    const mappingRelation = _mappingRelationEither.unsafeCoerce();
    const _narrowerEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_narrowerEither.isLeft()) {
      return _narrowerEither;
    }

    const narrower = _narrowerEither.unsafeCoerce();
    const _narrowerTransitiveEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_narrowerTransitiveEither.isLeft()) {
      return _narrowerTransitiveEither;
    }

    const narrowerTransitive = _narrowerTransitiveEither.unsafeCoerce();
    const _narrowMatchEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#narrowMatch",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_narrowMatchEither.isLeft()) {
      return _narrowMatchEither;
    }

    const narrowMatch = _narrowMatchEither.unsafeCoerce();
    const _notationEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_notationEither.isLeft()) {
      return _notationEither;
    }

    const notation = _notationEither.unsafeCoerce();
    const _noteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_noteEither.isLeft()) {
      return _noteEither;
    }

    const note = _noteEither.unsafeCoerce();
    const _prefLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_prefLabelEither.isLeft()) {
      return _prefLabelEither;
    }

    const prefLabel = _prefLabelEither.unsafeCoerce();
    const _prefLabelXlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly (rdfjs.BlankNode | rdfjs.NamedNode)[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toIdentifier().toMaybe().toList(),
        ),
    ]);
    if (_prefLabelXlEither.isLeft()) {
      return _prefLabelXlEither;
    }

    const prefLabelXl = _prefLabelXlEither.unsafeCoerce();
    const _relatedEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_relatedEither.isLeft()) {
      return _relatedEither;
    }

    const related = _relatedEither.unsafeCoerce();
    const _relatedMatchEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#relatedMatch",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_relatedMatchEither.isLeft()) {
      return _relatedMatchEither;
    }

    const relatedMatch = _relatedMatchEither.unsafeCoerce();
    const _scopeNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#scopeNote",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_scopeNoteEither.isLeft()) {
      return _scopeNoteEither;
    }

    const scopeNote = _scopeNoteEither.unsafeCoerce();
    const _semanticRelationEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#semanticRelation",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_semanticRelationEither.isLeft()) {
      return _semanticRelationEither;
    }

    const semanticRelation = _semanticRelationEither.unsafeCoerce();
    const _topConceptOfEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#topConceptOf",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_topConceptOfEither.isLeft()) {
      return _topConceptOfEither;
    }

    const topConceptOf = _topConceptOfEither.unsafeCoerce();
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
    concept: Omit<Concept, "equals" | "hash" | "identifier" | "toRdf" | "type">,
    hasher: HasherT,
  ): HasherT {
    for (const element of concept.altLabel) {
      hasher.update(element.value);
    }

    for (const element of concept.altLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.broader) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.broaderTransitive) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.broadMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.changeNote) {
      hasher.update(element.value);
    }

    for (const element of concept.closeMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.definition) {
      hasher.update(element.value);
    }

    for (const element of concept.editorialNote) {
      hasher.update(element.value);
    }

    for (const element of concept.exactMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.example) {
      hasher.update(element.value);
    }

    for (const element of concept.hiddenLabel) {
      hasher.update(element.value);
    }

    for (const element of concept.hiddenLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.historyNote) {
      hasher.update(element.value);
    }

    for (const element of concept.inScheme) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.mappingRelation) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.narrower) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.narrowerTransitive) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.narrowMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.notation) {
      hasher.update(element.value);
    }

    for (const element of concept.note) {
      hasher.update(element.value);
    }

    for (const element of concept.prefLabel) {
      hasher.update(element.value);
    }

    for (const element of concept.prefLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.related) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.relatedMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.scopeNote) {
      hasher.update(element.value);
    }

    for (const element of concept.semanticRelation) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of concept.topConceptOf) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
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
    if (typeof parameters.altLabel === "undefined") {
      this.altLabel = [];
    } else {
      this.altLabel = parameters.altLabel;
    }

    if (typeof parameters.hasTopConcept === "undefined") {
      this.hasTopConcept = [];
    } else {
      this.hasTopConcept = parameters.hasTopConcept;
    }

    if (typeof parameters.hiddenLabel === "undefined") {
      this.hiddenLabel = [];
    } else {
      this.hiddenLabel = parameters.hiddenLabel;
    }

    this.identifier = parameters.identifier;
    if (typeof parameters.prefLabel === "undefined") {
      this.prefLabel = [];
    } else {
      this.prefLabel = parameters.prefLabel;
    }
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

    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
      this.altLabel,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#hasTopConcept",
      ),
      this.hasTopConcept,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
      this.hiddenLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
      this.prefLabel,
    );
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

    const _altLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_altLabelEither.isLeft()) {
      return _altLabelEither;
    }

    const altLabel = _altLabelEither.unsafeCoerce();
    const _hasTopConceptEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.NamedNode[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hasTopConcept",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) => resourceValue.toIri().toMaybe().toList()),
    ]);
    if (_hasTopConceptEither.isLeft()) {
      return _hasTopConceptEither;
    }

    const hasTopConcept = _hasTopConceptEither.unsafeCoerce();
    const _hiddenLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_hiddenLabelEither.isLeft()) {
      return _hiddenLabelEither;
    }

    const hiddenLabel = _hiddenLabelEither.unsafeCoerce();
    const identifier = resource.identifier;
    const _prefLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_prefLabelEither.isLeft()) {
      return _prefLabelEither;
    }

    const prefLabel = _prefLabelEither.unsafeCoerce();
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
    >,
    hasher: HasherT,
  ): HasherT {
    for (const element of conceptScheme.altLabel) {
      hasher.update(element.value);
    }

    for (const element of conceptScheme.hasTopConcept) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of conceptScheme.hiddenLabel) {
      hasher.update(element.value);
    }

    for (const element of conceptScheme.prefLabel) {
      hasher.update(element.value);
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
    if (typeof parameters.skos$j$xl_literalForm === "undefined") {
      this.skos$j$xl_literalForm = [];
    } else {
      this.skos$j$xl_literalForm = parameters.skos$j$xl_literalForm;
    }
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

    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
      this.skos$j$xl_literalForm,
    );
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
    const _skos$j$xl_literalFormEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          { unique: true },
        )
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_skos$j$xl_literalFormEither.isLeft()) {
      return _skos$j$xl_literalFormEither;
    }

    const skos$j$xl_literalForm = _skos$j$xl_literalFormEither.unsafeCoerce();
    return purify.Either.of(new Label({ identifier, skos$j$xl_literalForm }));
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    label: Omit<Label, "equals" | "hash" | "identifier" | "toRdf" | "type">,
    hasher: HasherT,
  ): HasherT {
    for (const element of label.skos$j$xl_literalForm) {
      hasher.update(element.value);
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

          item;

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
        const _memberListEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = resource
          .value(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#memberList",
            ),
          )
          .chain((resourceValue) =>
            resourceValue
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
    >,
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
            (object) =>
              new sparqlBuilder.RdfListGraphPatterns({ rdfList: object }),
          ),
        ),
      );
    }
  }
}
