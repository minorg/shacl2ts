import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

abstract class Resource {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly changeNote: readonly rdfjs.Literal[];
  readonly definition: readonly rdfjs.Literal[];
  readonly editorialNote: readonly rdfjs.Literal[];
  readonly example: readonly rdfjs.Literal[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly historyNote: readonly rdfjs.Literal[];
  readonly identifier: rdfjs.NamedNode;
  readonly notation: readonly rdfjs.Literal[];
  readonly note: readonly rdfjs.Literal[];
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly scopeNote: readonly rdfjs.Literal[];
  abstract readonly type:
    | "Collection"
    | "Concept"
    | "ConceptScheme"
    | "OrderedCollection";

  constructor(parameters: {
    readonly altLabel?: readonly rdfjs.Literal[];
    readonly altLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly changeNote?: readonly rdfjs.Literal[];
    readonly definition?: readonly rdfjs.Literal[];
    readonly editorialNote?: readonly rdfjs.Literal[];
    readonly example?: readonly rdfjs.Literal[];
    readonly hiddenLabel?: readonly rdfjs.Literal[];
    readonly hiddenLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly historyNote?: readonly rdfjs.Literal[];
    readonly identifier: rdfjs.NamedNode;
    readonly notation?: readonly rdfjs.Literal[];
    readonly note?: readonly rdfjs.Literal[];
    readonly prefLabel?: readonly rdfjs.Literal[];
    readonly prefLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly scopeNote?: readonly rdfjs.Literal[];
  }) {
    if (typeof parameters.altLabel === "undefined") {
      this.altLabel = [];
    } else if (Array.isArray(parameters.altLabel)) {
      this.altLabel = parameters.altLabel;
    } else {
      this.altLabel = parameters.altLabel; // never
    }

    if (typeof parameters.altLabelXl === "undefined") {
      this.altLabelXl = [];
    } else if (Array.isArray(parameters.altLabelXl)) {
      this.altLabelXl = parameters.altLabelXl;
    } else {
      this.altLabelXl = parameters.altLabelXl; // never
    }

    if (typeof parameters.changeNote === "undefined") {
      this.changeNote = [];
    } else if (Array.isArray(parameters.changeNote)) {
      this.changeNote = parameters.changeNote;
    } else {
      this.changeNote = parameters.changeNote; // never
    }

    if (typeof parameters.definition === "undefined") {
      this.definition = [];
    } else if (Array.isArray(parameters.definition)) {
      this.definition = parameters.definition;
    } else {
      this.definition = parameters.definition; // never
    }

    if (typeof parameters.editorialNote === "undefined") {
      this.editorialNote = [];
    } else if (Array.isArray(parameters.editorialNote)) {
      this.editorialNote = parameters.editorialNote;
    } else {
      this.editorialNote = parameters.editorialNote; // never
    }

    if (typeof parameters.example === "undefined") {
      this.example = [];
    } else if (Array.isArray(parameters.example)) {
      this.example = parameters.example;
    } else {
      this.example = parameters.example; // never
    }

    if (typeof parameters.hiddenLabel === "undefined") {
      this.hiddenLabel = [];
    } else if (Array.isArray(parameters.hiddenLabel)) {
      this.hiddenLabel = parameters.hiddenLabel;
    } else {
      this.hiddenLabel = parameters.hiddenLabel; // never
    }

    if (typeof parameters.hiddenLabelXl === "undefined") {
      this.hiddenLabelXl = [];
    } else if (Array.isArray(parameters.hiddenLabelXl)) {
      this.hiddenLabelXl = parameters.hiddenLabelXl;
    } else {
      this.hiddenLabelXl = parameters.hiddenLabelXl; // never
    }

    if (typeof parameters.historyNote === "undefined") {
      this.historyNote = [];
    } else if (Array.isArray(parameters.historyNote)) {
      this.historyNote = parameters.historyNote;
    } else {
      this.historyNote = parameters.historyNote; // never
    }

    this.identifier = parameters.identifier;
    if (typeof parameters.notation === "undefined") {
      this.notation = [];
    } else if (Array.isArray(parameters.notation)) {
      this.notation = parameters.notation;
    } else {
      this.notation = parameters.notation; // never
    }

    if (typeof parameters.note === "undefined") {
      this.note = [];
    } else if (Array.isArray(parameters.note)) {
      this.note = parameters.note;
    } else {
      this.note = parameters.note; // never
    }

    if (typeof parameters.prefLabel === "undefined") {
      this.prefLabel = [];
    } else if (Array.isArray(parameters.prefLabel)) {
      this.prefLabel = parameters.prefLabel;
    } else {
      this.prefLabel = parameters.prefLabel; // never
    }

    if (typeof parameters.prefLabelXl === "undefined") {
      this.prefLabelXl = [];
    } else if (Array.isArray(parameters.prefLabelXl)) {
      this.prefLabelXl = parameters.prefLabelXl;
    } else {
      this.prefLabelXl = parameters.prefLabelXl; // never
    }

    if (typeof parameters.scopeNote === "undefined") {
      this.scopeNote = [];
    } else if (Array.isArray(parameters.scopeNote)) {
      this.scopeNote = parameters.scopeNote;
    } else {
      this.scopeNote = parameters.scopeNote; // never
    }
  }

  equals(other: Resource): purifyHelpers.Equatable.EqualsResult {
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
      changeNote: (left, right) =>
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
      scopeNote: (left, right) =>
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
    return Resource.hashResource(this, hasher);
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
    const _resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://kos-kit.github.io/skos-shacl/ns#Resource",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
      this.altLabel,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
      this.altLabelXl,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#changeNote"),
      this.changeNote,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#definition"),
      this.definition,
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#editorialNote",
      ),
      this.editorialNote,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
      this.example,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#hiddenLabel"),
      this.hiddenLabel,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#hiddenLabel"),
      this.hiddenLabelXl,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#historyNote"),
      this.historyNote,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      this.notation,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      this.note,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
      this.prefLabel,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
      this.prefLabelXl,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#scopeNote"),
      this.scopeNote,
    );
    return _resource;
  }
}

namespace Resource {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      altLabel: readonly rdfjs.Literal[];
      altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      changeNote: readonly rdfjs.Literal[];
      definition: readonly rdfjs.Literal[];
      editorialNote: readonly rdfjs.Literal[];
      example: readonly rdfjs.Literal[];
      hiddenLabel: readonly rdfjs.Literal[];
      hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      historyNote: readonly rdfjs.Literal[];
      identifier: rdfjs.NamedNode;
      notation: readonly rdfjs.Literal[];
      note: readonly rdfjs.Literal[];
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      scopeNote: readonly rdfjs.Literal[];
    }
  > {
    if (
      !_options?.ignoreRdfType &&
      !_resource.isInstanceOf(
        dataFactory.namedNode(
          "http://kos-kit.github.io/skos-shacl/ns#Resource",
        ),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: _resource,
          message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://kos-kit.github.io/skos-shacl/ns#Resource",
          ),
        }),
      );
    }

    const _altLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toIdentifier())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_altLabelXlEither.isLeft()) {
      return _altLabelXlEither;
    }

    const altLabelXl = _altLabelXlEither.unsafeCoerce();
    const _changeNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#changeNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_changeNoteEither.isLeft()) {
      return _changeNoteEither;
    }

    const changeNote = _changeNoteEither.unsafeCoerce();
    const _definitionEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#definition",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#editorialNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_editorialNoteEither.isLeft()) {
      return _editorialNoteEither;
    }

    const editorialNote = _editorialNoteEither.unsafeCoerce();
    const _exampleEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toIdentifier())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#historyNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_historyNoteEither.isLeft()) {
      return _historyNoteEither;
    }

    const historyNote = _historyNoteEither.unsafeCoerce();
    const identifier = _resource.identifier;
    const _notationEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#prefLabel",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
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
      ..._resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toIdentifier())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_prefLabelXlEither.isLeft()) {
      return _prefLabelXlEither;
    }

    const prefLabelXl = _prefLabelXlEither.unsafeCoerce();
    const _scopeNoteEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#scopeNote",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_scopeNoteEither.isLeft()) {
      return _scopeNoteEither;
    }

    const scopeNote = _scopeNoteEither.unsafeCoerce();
    return purify.Either.of({
      altLabel,
      altLabelXl,
      changeNote,
      definition,
      editorialNote,
      example,
      hiddenLabel,
      hiddenLabelXl,
      historyNote,
      identifier,
      notation,
      note,
      prefLabel,
      prefLabelXl,
      scopeNote,
    });
  }

  export function hashResource<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    resource: Omit<
      Resource,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    hasher: HasherT,
  ): HasherT {
    for (const _element of resource.altLabel) {
      hasher.update(_element.value);
    }

    for (const _element of resource.altLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of resource.changeNote) {
      hasher.update(_element.value);
    }

    for (const _element of resource.definition) {
      hasher.update(_element.value);
    }

    for (const _element of resource.editorialNote) {
      hasher.update(_element.value);
    }

    for (const _element of resource.example) {
      hasher.update(_element.value);
    }

    for (const _element of resource.hiddenLabel) {
      hasher.update(_element.value);
    }

    for (const _element of resource.hiddenLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of resource.historyNote) {
      hasher.update(_element.value);
    }

    for (const _element of resource.notation) {
      hasher.update(_element.value);
    }

    for (const _element of resource.note) {
      hasher.update(_element.value);
    }

    for (const _element of resource.prefLabel) {
      hasher.update(_element.value);
    }

    for (const _element of resource.prefLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of resource.scopeNote) {
      hasher.update(_element.value);
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode(
              "http://kos-kit.github.io/skos-shacl/ns#Resource",
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
              "http://www.w3.org/2004/02/skos/core#hiddenLabel",
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
              "http://www.w3.org/2004/02/skos/core#scopeNote",
            ),
            this.variable("ScopeNote"),
          ),
        ),
      );
    }
  }
}

export class Collection extends Resource {
  readonly member: readonly rdfjs.NamedNode[];
  readonly type: "Collection" | "OrderedCollection" = "Collection";

  constructor(
    parameters: {
      readonly member?: readonly rdfjs.NamedNode[];
    } & ConstructorParameters<typeof Resource>[0],
  ) {
    super(parameters);
    if (typeof parameters.member === "undefined") {
      this.member = [];
    } else if (Array.isArray(parameters.member)) {
      this.member = parameters.member;
    } else {
      this.member = parameters.member; // never
    }
  }

  override equals(other: Collection): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        member: (left, right) =>
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
    return Collection.hashCollection(this, hasher);
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
    const _resource = super.toRdf({
      mutateGraph,
      ignoreRdfType: true,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Collection",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#member"),
      this.member,
    );
    return _resource;
  }
}

export namespace Collection {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Collection> {
    return Resource.fromRdf(_resource, { ignoreRdfType: true }).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !_resource.isInstanceOf(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Collection",
            ),
          )
        ) {
          return purify.Left(
            new rdfjsResource.Resource.ValueError({
              focusResource: _resource,
              message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#Collection",
              ),
            }),
          );
        }
        const _memberEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#member",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_memberEither.isLeft()) {
          return _memberEither;
        }
        const member = _memberEither.unsafeCoerce();
        return purify.Either.of(
          new Collection({
            altLabel: _super.altLabel,
            altLabelXl: _super.altLabelXl,
            changeNote: _super.changeNote,
            definition: _super.definition,
            editorialNote: _super.editorialNote,
            example: _super.example,
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            historyNote: _super.historyNote,
            identifier: _super.identifier,
            notation: _super.notation,
            note: _super.note,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
            scopeNote: _super.scopeNote,
            member,
          }),
        );
      },
    );
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
    Resource.hashResource(collection, hasher);
    for (const _element of collection.member) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends Resource.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!options?.ignoreRdfType) {
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

export class Concept extends Resource {
  readonly broader: readonly rdfjs.NamedNode[];
  readonly broaderTransitive: readonly rdfjs.NamedNode[];
  readonly broadMatch: readonly rdfjs.NamedNode[];
  readonly closeMatch: readonly rdfjs.NamedNode[];
  readonly exactMatch: readonly rdfjs.NamedNode[];
  readonly inScheme: readonly rdfjs.NamedNode[];
  readonly mappingRelation: readonly rdfjs.NamedNode[];
  readonly narrower: readonly rdfjs.NamedNode[];
  readonly narrowerTransitive: readonly rdfjs.NamedNode[];
  readonly narrowMatch: readonly rdfjs.NamedNode[];
  readonly related: readonly rdfjs.NamedNode[];
  readonly relatedMatch: readonly rdfjs.NamedNode[];
  readonly semanticRelation: readonly rdfjs.NamedNode[];
  readonly topConceptOf: readonly rdfjs.NamedNode[];
  readonly type = "Concept" as const;

  constructor(
    parameters: {
      readonly broader?: readonly rdfjs.NamedNode[];
      readonly broaderTransitive?: readonly rdfjs.NamedNode[];
      readonly broadMatch?: readonly rdfjs.NamedNode[];
      readonly closeMatch?: readonly rdfjs.NamedNode[];
      readonly exactMatch?: readonly rdfjs.NamedNode[];
      readonly inScheme?: readonly rdfjs.NamedNode[];
      readonly mappingRelation?: readonly rdfjs.NamedNode[];
      readonly narrower?: readonly rdfjs.NamedNode[];
      readonly narrowerTransitive?: readonly rdfjs.NamedNode[];
      readonly narrowMatch?: readonly rdfjs.NamedNode[];
      readonly related?: readonly rdfjs.NamedNode[];
      readonly relatedMatch?: readonly rdfjs.NamedNode[];
      readonly semanticRelation?: readonly rdfjs.NamedNode[];
      readonly topConceptOf?: readonly rdfjs.NamedNode[];
    } & ConstructorParameters<typeof Resource>[0],
  ) {
    super(parameters);
    if (typeof parameters.broader === "undefined") {
      this.broader = [];
    } else if (Array.isArray(parameters.broader)) {
      this.broader = parameters.broader;
    } else {
      this.broader = parameters.broader; // never
    }

    if (typeof parameters.broaderTransitive === "undefined") {
      this.broaderTransitive = [];
    } else if (Array.isArray(parameters.broaderTransitive)) {
      this.broaderTransitive = parameters.broaderTransitive;
    } else {
      this.broaderTransitive = parameters.broaderTransitive; // never
    }

    if (typeof parameters.broadMatch === "undefined") {
      this.broadMatch = [];
    } else if (Array.isArray(parameters.broadMatch)) {
      this.broadMatch = parameters.broadMatch;
    } else {
      this.broadMatch = parameters.broadMatch; // never
    }

    if (typeof parameters.closeMatch === "undefined") {
      this.closeMatch = [];
    } else if (Array.isArray(parameters.closeMatch)) {
      this.closeMatch = parameters.closeMatch;
    } else {
      this.closeMatch = parameters.closeMatch; // never
    }

    if (typeof parameters.exactMatch === "undefined") {
      this.exactMatch = [];
    } else if (Array.isArray(parameters.exactMatch)) {
      this.exactMatch = parameters.exactMatch;
    } else {
      this.exactMatch = parameters.exactMatch; // never
    }

    if (typeof parameters.inScheme === "undefined") {
      this.inScheme = [];
    } else if (Array.isArray(parameters.inScheme)) {
      this.inScheme = parameters.inScheme;
    } else {
      this.inScheme = parameters.inScheme; // never
    }

    if (typeof parameters.mappingRelation === "undefined") {
      this.mappingRelation = [];
    } else if (Array.isArray(parameters.mappingRelation)) {
      this.mappingRelation = parameters.mappingRelation;
    } else {
      this.mappingRelation = parameters.mappingRelation; // never
    }

    if (typeof parameters.narrower === "undefined") {
      this.narrower = [];
    } else if (Array.isArray(parameters.narrower)) {
      this.narrower = parameters.narrower;
    } else {
      this.narrower = parameters.narrower; // never
    }

    if (typeof parameters.narrowerTransitive === "undefined") {
      this.narrowerTransitive = [];
    } else if (Array.isArray(parameters.narrowerTransitive)) {
      this.narrowerTransitive = parameters.narrowerTransitive;
    } else {
      this.narrowerTransitive = parameters.narrowerTransitive; // never
    }

    if (typeof parameters.narrowMatch === "undefined") {
      this.narrowMatch = [];
    } else if (Array.isArray(parameters.narrowMatch)) {
      this.narrowMatch = parameters.narrowMatch;
    } else {
      this.narrowMatch = parameters.narrowMatch; // never
    }

    if (typeof parameters.related === "undefined") {
      this.related = [];
    } else if (Array.isArray(parameters.related)) {
      this.related = parameters.related;
    } else {
      this.related = parameters.related; // never
    }

    if (typeof parameters.relatedMatch === "undefined") {
      this.relatedMatch = [];
    } else if (Array.isArray(parameters.relatedMatch)) {
      this.relatedMatch = parameters.relatedMatch;
    } else {
      this.relatedMatch = parameters.relatedMatch; // never
    }

    if (typeof parameters.semanticRelation === "undefined") {
      this.semanticRelation = [];
    } else if (Array.isArray(parameters.semanticRelation)) {
      this.semanticRelation = parameters.semanticRelation;
    } else {
      this.semanticRelation = parameters.semanticRelation; // never
    }

    if (typeof parameters.topConceptOf === "undefined") {
      this.topConceptOf = [];
    } else if (Array.isArray(parameters.topConceptOf)) {
      this.topConceptOf = parameters.topConceptOf;
    } else {
      this.topConceptOf = parameters.topConceptOf; // never
    }
  }

  override equals(other: Concept): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
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
        closeMatch: (left, right) =>
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
      }),
    );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Concept.hashConcept(this, hasher);
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
    const _resource = super.toRdf({
      mutateGraph,
      ignoreRdfType: true,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#Concept",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broader"),
      this.broader,
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#broaderTransitive",
      ),
      this.broaderTransitive,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broadMatch"),
      this.broadMatch,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#closeMatch"),
      this.closeMatch,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#exactMatch"),
      this.exactMatch,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
      this.inScheme,
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#mappingRelation",
      ),
      this.mappingRelation,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
      this.narrower,
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
      ),
      this.narrowerTransitive,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrowMatch"),
      this.narrowMatch,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
      this.related,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#relatedMatch"),
      this.relatedMatch,
    );
    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#semanticRelation",
      ),
      this.semanticRelation,
    );
    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#topConceptOf"),
      this.topConceptOf,
    );
    return _resource;
  }
}

export namespace Concept {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Concept> {
    return Resource.fromRdf(_resource, { ignoreRdfType: true }).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !_resource.isInstanceOf(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Concept",
            ),
          )
        ) {
          return purify.Left(
            new rdfjsResource.Resource.ValueError({
              focusResource: _resource,
              message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#Concept",
              ),
            }),
          );
        }
        const _broaderEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broader",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_broaderEither.isLeft()) {
          return _broaderEither;
        }
        const broader = _broaderEither.unsafeCoerce();
        const _broaderTransitiveEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broaderTransitive",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_broaderTransitiveEither.isLeft()) {
          return _broaderTransitiveEither;
        }
        const broaderTransitive = _broaderTransitiveEither.unsafeCoerce();
        const _broadMatchEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broadMatch",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_broadMatchEither.isLeft()) {
          return _broadMatchEither;
        }
        const broadMatch = _broadMatchEither.unsafeCoerce();
        const _closeMatchEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#closeMatch",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_closeMatchEither.isLeft()) {
          return _closeMatchEither;
        }
        const closeMatch = _closeMatchEither.unsafeCoerce();
        const _exactMatchEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#exactMatch",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_exactMatchEither.isLeft()) {
          return _exactMatchEither;
        }
        const exactMatch = _exactMatchEither.unsafeCoerce();
        const _inSchemeEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#inScheme",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_inSchemeEither.isLeft()) {
          return _inSchemeEither;
        }
        const inScheme = _inSchemeEither.unsafeCoerce();
        const _mappingRelationEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#mappingRelation",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_mappingRelationEither.isLeft()) {
          return _mappingRelationEither;
        }
        const mappingRelation = _mappingRelationEither.unsafeCoerce();
        const _narrowerEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrower",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_narrowerEither.isLeft()) {
          return _narrowerEither;
        }
        const narrower = _narrowerEither.unsafeCoerce();
        const _narrowerTransitiveEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_narrowerTransitiveEither.isLeft()) {
          return _narrowerTransitiveEither;
        }
        const narrowerTransitive = _narrowerTransitiveEither.unsafeCoerce();
        const _narrowMatchEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrowMatch",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_narrowMatchEither.isLeft()) {
          return _narrowMatchEither;
        }
        const narrowMatch = _narrowMatchEither.unsafeCoerce();
        const _relatedEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#related",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_relatedEither.isLeft()) {
          return _relatedEither;
        }
        const related = _relatedEither.unsafeCoerce();
        const _relatedMatchEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#relatedMatch",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_relatedMatchEither.isLeft()) {
          return _relatedMatchEither;
        }
        const relatedMatch = _relatedMatchEither.unsafeCoerce();
        const _semanticRelationEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#semanticRelation",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_semanticRelationEither.isLeft()) {
          return _semanticRelationEither;
        }
        const semanticRelation = _semanticRelationEither.unsafeCoerce();
        const _topConceptOfEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#topConceptOf",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_topConceptOfEither.isLeft()) {
          return _topConceptOfEither;
        }
        const topConceptOf = _topConceptOfEither.unsafeCoerce();
        return purify.Either.of(
          new Concept({
            altLabel: _super.altLabel,
            altLabelXl: _super.altLabelXl,
            changeNote: _super.changeNote,
            definition: _super.definition,
            editorialNote: _super.editorialNote,
            example: _super.example,
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            historyNote: _super.historyNote,
            identifier: _super.identifier,
            notation: _super.notation,
            note: _super.note,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
            scopeNote: _super.scopeNote,
            broader,
            broaderTransitive,
            broadMatch,
            closeMatch,
            exactMatch,
            inScheme,
            mappingRelation,
            narrower,
            narrowerTransitive,
            narrowMatch,
            related,
            relatedMatch,
            semanticRelation,
            topConceptOf,
          }),
        );
      },
    );
  }

  export function hashConcept<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    concept: Omit<Concept, "equals" | "hash" | "identifier" | "toRdf" | "type">,
    hasher: HasherT,
  ): HasherT {
    Resource.hashResource(concept, hasher);
    for (const _element of concept.broader) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.broaderTransitive) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.broadMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.closeMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.exactMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
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

    for (const _element of concept.related) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.relatedMatch) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.semanticRelation) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    for (const _element of concept.topConceptOf) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends Resource.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!options?.ignoreRdfType) {
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

export class ConceptScheme extends Resource {
  readonly hasTopConcept: readonly rdfjs.NamedNode[];
  readonly type = "ConceptScheme" as const;

  constructor(
    parameters: {
      readonly hasTopConcept?: readonly rdfjs.NamedNode[];
    } & ConstructorParameters<typeof Resource>[0],
  ) {
    super(parameters);
    if (typeof parameters.hasTopConcept === "undefined") {
      this.hasTopConcept = [];
    } else if (Array.isArray(parameters.hasTopConcept)) {
      this.hasTopConcept = parameters.hasTopConcept;
    } else {
      this.hasTopConcept = parameters.hasTopConcept; // never
    }
  }

  override equals(other: ConceptScheme): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        hasTopConcept: (left, right) =>
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
    return ConceptScheme.hashConceptScheme(this, hasher);
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
    const _resource = super.toRdf({
      mutateGraph,
      ignoreRdfType: true,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#hasTopConcept",
      ),
      this.hasTopConcept,
    );
    return _resource;
  }
}

export namespace ConceptScheme {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, ConceptScheme> {
    return Resource.fromRdf(_resource, { ignoreRdfType: true }).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !_resource.isInstanceOf(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#ConceptScheme",
            ),
          )
        ) {
          return purify.Left(
            new rdfjsResource.Resource.ValueError({
              focusResource: _resource,
              message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#ConceptScheme",
              ),
            }),
          );
        }
        const _hasTopConceptEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ..._resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#hasTopConcept",
              ),
              { unique: true },
            )
            .flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_hasTopConceptEither.isLeft()) {
          return _hasTopConceptEither;
        }
        const hasTopConcept = _hasTopConceptEither.unsafeCoerce();
        return purify.Either.of(
          new ConceptScheme({
            altLabel: _super.altLabel,
            altLabelXl: _super.altLabelXl,
            changeNote: _super.changeNote,
            definition: _super.definition,
            editorialNote: _super.editorialNote,
            example: _super.example,
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            historyNote: _super.historyNote,
            identifier: _super.identifier,
            notation: _super.notation,
            note: _super.note,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
            scopeNote: _super.scopeNote,
            hasTopConcept,
          }),
        );
      },
    );
  }

  export function hashConceptScheme<
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
    Resource.hashResource(conceptScheme, hasher);
    for (const _element of conceptScheme.hasTopConcept) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(_element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends Resource.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!options?.ignoreRdfType) {
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
              "http://www.w3.org/2004/02/skos/core#hasTopConcept",
            ),
            this.variable("HasTopConcept"),
          ),
        ),
      );
    }
  }
}

export class Label {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly literalForm: readonly rdfjs.Literal[];
  readonly type = "Label" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly literalForm?: readonly rdfjs.Literal[];
  }) {
    this.identifier = parameters.identifier;
    if (typeof parameters.literalForm === "undefined") {
      this.literalForm = [];
    } else if (Array.isArray(parameters.literalForm)) {
      this.literalForm = parameters.literalForm;
    } else {
      this.literalForm = parameters.literalForm; // never
    }
  }

  equals(other: Label): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      literalForm: (left, right) =>
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
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2008/05/skos-xl#Label",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
      this.literalForm,
    );
    return _resource;
  }
}

export namespace Label {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Label> {
    if (
      !_options?.ignoreRdfType &&
      !_resource.isInstanceOf(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#Label"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: _resource,
          message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#Label",
          ),
        }),
      );
    }

    const identifier = _resource.identifier;
    const _literalFormEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#literalForm",
          ),
          { unique: true },
        )
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    return purify.Either.of(new Label({ identifier, literalForm }));
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    label: Omit<Label, "equals" | "hash" | "identifier" | "toRdf" | "type">,
    hasher: HasherT,
  ): HasherT {
    for (const _element of label.literalForm) {
      hasher.update(_element.value);
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      if (!options?.ignoreRdfType) {
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
          this.variable("LiteralForm"),
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
    const _resource = super.toRdf({
      mutateGraph,
      ignoreRdfType: true,
      resourceSet,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#OrderedCollection",
        ),
      );
    }

    _resource.add(
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
    return _resource;
  }
}

export namespace OrderedCollection {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, OrderedCollection> {
    return Collection.fromRdf(_resource, { ignoreRdfType: true }).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !_resource.isInstanceOf(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#OrderedCollection",
            ),
          )
        ) {
          return purify.Left(
            new rdfjsResource.Resource.ValueError({
              focusResource: _resource,
              message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
              predicate: dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#OrderedCollection",
              ),
            }),
          );
        }
        const _memberListEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = _resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#memberList",
            ),
            { unique: true },
          )
          .head()
          .chain((value) => value.toList())
          .map((values) =>
            values.flatMap((_value) =>
              _value
                .toValues()
                .head()
                .chain((_value) => _value.toIri())
                .toMaybe()
                .toList(),
            ),
          );
        if (_memberListEither.isLeft()) {
          return _memberListEither;
        }
        const memberList = _memberListEither.unsafeCoerce();
        return purify.Either.of(
          new OrderedCollection({
            member: _super.member,
            altLabel: _super.altLabel,
            altLabelXl: _super.altLabelXl,
            changeNote: _super.changeNote,
            definition: _super.definition,
            editorialNote: _super.editorialNote,
            example: _super.example,
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            historyNote: _super.historyNote,
            identifier: _super.identifier,
            notation: _super.notation,
            note: _super.note,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
            scopeNote: _super.scopeNote,
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
      options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!options?.ignoreRdfType) {
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
            (_object) =>
              new sparqlBuilder.RdfListGraphPatterns({ rdfList: _object }),
          ),
        ),
      );
    }
  }
}
