import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

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
      this.literalForm,
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
    const _literalFormEither: purify.Either<
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
        .flatMap((value) =>
          value
            .toValues()
            .head()
            .chain((value) => value.toLiteral())
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
    for (const element of label.literalForm) {
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
          this.variable("LiteralForm"),
        ),
      );
    }
  }
}

abstract class Labeled {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly identifier: rdfjs.NamedNode;
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  abstract readonly type:
    | "Collection"
    | "Concept"
    | "ConceptScheme"
    | "OrderedCollection";

  constructor(parameters: {
    readonly altLabel?: readonly rdfjs.Literal[];
    readonly altLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly hiddenLabel?: readonly rdfjs.Literal[];
    readonly hiddenLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly identifier: rdfjs.NamedNode;
    readonly prefLabel?: readonly rdfjs.Literal[];
    readonly prefLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
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

    this.identifier = parameters.identifier;
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
  }

  equals(other: Labeled): purifyHelpers.Equatable.EqualsResult {
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
      identifier: purifyHelpers.Equatable.booleanEquals,
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
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Labeled.hashLabeled(this, hasher);
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
          "http://kos-kit.github.io/skos-shacl/ns#Labeled",
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
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#hiddenLabel"),
      this.hiddenLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#hiddenLabel"),
      this.hiddenLabelXl,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
      this.prefLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
      this.prefLabelXl,
    );
    return resource;
  }
}

namespace Labeled {
  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      altLabel: readonly rdfjs.Literal[];
      altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      hiddenLabel: readonly rdfjs.Literal[];
      hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      identifier: rdfjs.NamedNode;
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    }
  > {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode("http://kos-kit.github.io/skos-shacl/ns#Labeled"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://kos-kit.github.io/skos-shacl/ns#Labeled",
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
        .flatMap((value) =>
          value
            .toValues()
            .head()
            .chain((value) => value.toLiteral())
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
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
          { unique: true },
        )
        .flatMap((value) =>
          value
            .toValues()
            .head()
            .chain((value) => value.toIdentifier())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_altLabelXlEither.isLeft()) {
      return _altLabelXlEither;
    }

    const altLabelXl = _altLabelXlEither.unsafeCoerce();
    const _hiddenLabelEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((value) =>
          value
            .toValues()
            .head()
            .chain((value) => value.toLiteral())
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
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2008/05/skos-xl#hiddenLabel",
          ),
          { unique: true },
        )
        .flatMap((value) =>
          value
            .toValues()
            .head()
            .chain((value) => value.toIdentifier())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_hiddenLabelXlEither.isLeft()) {
      return _hiddenLabelXlEither;
    }

    const hiddenLabelXl = _hiddenLabelXlEither.unsafeCoerce();
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
        .flatMap((value) =>
          value
            .toValues()
            .head()
            .chain((value) => value.toLiteral())
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
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
          { unique: true },
        )
        .flatMap((value) =>
          value
            .toValues()
            .head()
            .chain((value) => value.toIdentifier())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_prefLabelXlEither.isLeft()) {
      return _prefLabelXlEither;
    }

    const prefLabelXl = _prefLabelXlEither.unsafeCoerce();
    return purify.Either.of({
      altLabel,
      altLabelXl,
      hiddenLabel,
      hiddenLabelXl,
      identifier,
      prefLabel,
      prefLabelXl,
    });
  }

  export function hashLabeled<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    labeled: Omit<Labeled, "equals" | "hash" | "identifier" | "toRdf" | "type">,
    hasher: HasherT,
  ): HasherT {
    for (const element of labeled.altLabel) {
      hasher.update(element.value);
    }

    for (const element of labeled.altLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of labeled.hiddenLabel) {
      hasher.update(element.value);
    }

    for (const element of labeled.hiddenLabelXl) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    for (const element of labeled.prefLabel) {
      hasher.update(element.value);
    }

    for (const element of labeled.prefLabelXl) {
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
              "http://kos-kit.github.io/skos-shacl/ns#Labeled",
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
    }
  }
}

export class Collection extends Labeled {
  readonly member: readonly rdfjs.NamedNode[];
  readonly type: "Collection" | "OrderedCollection" = "Collection";

  constructor(
    parameters: {
      readonly member?: readonly rdfjs.NamedNode[];
    } & ConstructorParameters<typeof Labeled>[0],
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
    return super
      .equals(other)
      .chain(() =>
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
    return Labeled.fromRdf(resource, { ignoreRdfType: true }).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !resource.isInstanceOf(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Collection",
            ),
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
        const _memberEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#member",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            identifier: _super.identifier,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
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
    Labeled.hashLabeled(collection, hasher);
    for (const element of collection.member) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends Labeled.SparqlGraphPatterns {
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

export class Concept extends Labeled {
  readonly broader: readonly rdfjs.NamedNode[];
  readonly broaderTransitive: readonly rdfjs.NamedNode[];
  readonly broadMatch: readonly rdfjs.NamedNode[];
  readonly changeNote: readonly rdfjs.Literal[];
  readonly closeMatch: readonly rdfjs.NamedNode[];
  readonly definition: readonly rdfjs.Literal[];
  readonly editorialNote: readonly rdfjs.Literal[];
  readonly exactMatch: readonly rdfjs.NamedNode[];
  readonly example: readonly rdfjs.Literal[];
  readonly historyNote: readonly rdfjs.Literal[];
  readonly inScheme: readonly rdfjs.NamedNode[];
  readonly mappingRelation: readonly rdfjs.NamedNode[];
  readonly narrower: readonly rdfjs.NamedNode[];
  readonly narrowerTransitive: readonly rdfjs.NamedNode[];
  readonly narrowMatch: readonly rdfjs.NamedNode[];
  readonly notation: readonly rdfjs.Literal[];
  readonly note: readonly rdfjs.Literal[];
  readonly related: readonly rdfjs.NamedNode[];
  readonly relatedMatch: readonly rdfjs.NamedNode[];
  readonly scopeNote: readonly rdfjs.Literal[];
  readonly semanticRelation: readonly rdfjs.NamedNode[];
  readonly topConceptOf: readonly rdfjs.NamedNode[];
  readonly type = "Concept" as const;

  constructor(
    parameters: {
      readonly broader?: readonly rdfjs.NamedNode[];
      readonly broaderTransitive?: readonly rdfjs.NamedNode[];
      readonly broadMatch?: readonly rdfjs.NamedNode[];
      readonly changeNote?: readonly rdfjs.Literal[];
      readonly closeMatch?: readonly rdfjs.NamedNode[];
      readonly definition?: readonly rdfjs.Literal[];
      readonly editorialNote?: readonly rdfjs.Literal[];
      readonly exactMatch?: readonly rdfjs.NamedNode[];
      readonly example?: readonly rdfjs.Literal[];
      readonly historyNote?: readonly rdfjs.Literal[];
      readonly inScheme?: readonly rdfjs.NamedNode[];
      readonly mappingRelation?: readonly rdfjs.NamedNode[];
      readonly narrower?: readonly rdfjs.NamedNode[];
      readonly narrowerTransitive?: readonly rdfjs.NamedNode[];
      readonly narrowMatch?: readonly rdfjs.NamedNode[];
      readonly notation?: readonly rdfjs.Literal[];
      readonly note?: readonly rdfjs.Literal[];
      readonly related?: readonly rdfjs.NamedNode[];
      readonly relatedMatch?: readonly rdfjs.NamedNode[];
      readonly scopeNote?: readonly rdfjs.Literal[];
      readonly semanticRelation?: readonly rdfjs.NamedNode[];
      readonly topConceptOf?: readonly rdfjs.NamedNode[];
    } & ConstructorParameters<typeof Labeled>[0],
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

    if (typeof parameters.changeNote === "undefined") {
      this.changeNote = [];
    } else if (Array.isArray(parameters.changeNote)) {
      this.changeNote = parameters.changeNote;
    } else {
      this.changeNote = parameters.changeNote; // never
    }

    if (typeof parameters.closeMatch === "undefined") {
      this.closeMatch = [];
    } else if (Array.isArray(parameters.closeMatch)) {
      this.closeMatch = parameters.closeMatch;
    } else {
      this.closeMatch = parameters.closeMatch; // never
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

    if (typeof parameters.exactMatch === "undefined") {
      this.exactMatch = [];
    } else if (Array.isArray(parameters.exactMatch)) {
      this.exactMatch = parameters.exactMatch;
    } else {
      this.exactMatch = parameters.exactMatch; // never
    }

    if (typeof parameters.example === "undefined") {
      this.example = [];
    } else if (Array.isArray(parameters.example)) {
      this.example = parameters.example;
    } else {
      this.example = parameters.example; // never
    }

    if (typeof parameters.historyNote === "undefined") {
      this.historyNote = [];
    } else if (Array.isArray(parameters.historyNote)) {
      this.historyNote = parameters.historyNote;
    } else {
      this.historyNote = parameters.historyNote; // never
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

    if (typeof parameters.scopeNote === "undefined") {
      this.scopeNote = [];
    } else if (Array.isArray(parameters.scopeNote)) {
      this.scopeNote = parameters.scopeNote;
    } else {
      this.scopeNote = parameters.scopeNote; // never
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
    return super
      .equals(other)
      .chain(() =>
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
          historyNote: (left, right) =>
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
          "http://www.w3.org/2004/02/skos/core#Concept",
        ),
      );
    }

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
    return Labeled.fromRdf(resource, { ignoreRdfType: true }).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !resource.isInstanceOf(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#Concept",
            ),
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
        const _broaderEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broader",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broaderTransitive",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#broadMatch",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
                .toMaybe()
                .toList(),
            ),
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
                .toMaybe()
                .toList(),
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
                .toMaybe()
                .toList(),
            ),
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#editorialNote",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
                .toMaybe()
                .toList(),
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
                .toMaybe()
                .toList(),
            ),
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
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#example",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_exampleEither.isLeft()) {
          return _exampleEither;
        }
        const example = _exampleEither.unsafeCoerce();
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_historyNoteEither.isLeft()) {
          return _historyNoteEither;
        }
        const historyNote = _historyNoteEither.unsafeCoerce();
        const _inSchemeEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#inScheme",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#mappingRelation",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrower",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#narrowMatch",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
                .toMaybe()
                .toList(),
            ),
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
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#notation",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#notation",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
                .toMaybe()
                .toList(),
            ),
        ]);
        if (_noteEither.isLeft()) {
          return _noteEither;
        }
        const note = _noteEither.unsafeCoerce();
        const _relatedEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = purify.Either.of([
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#related",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#relatedMatch",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
                .toMaybe()
                .toList(),
            ),
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toLiteral())
                .toMaybe()
                .toList(),
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
          ...resource
            .values(
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#topConceptOf",
              ),
              { unique: true },
            )
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            identifier: _super.identifier,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
            broader,
            broaderTransitive,
            broadMatch,
            changeNote,
            closeMatch,
            definition,
            editorialNote,
            exactMatch,
            example,
            historyNote,
            inScheme,
            mappingRelation,
            narrower,
            narrowerTransitive,
            narrowMatch,
            notation,
            note,
            related,
            relatedMatch,
            scopeNote,
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
    Labeled.hashLabeled(concept, hasher);
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

  export class SparqlGraphPatterns extends Labeled.SparqlGraphPatterns {
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

export class ConceptScheme extends Labeled {
  readonly hasTopConcept: readonly rdfjs.NamedNode[];
  readonly type = "ConceptScheme" as const;

  constructor(
    parameters: {
      readonly hasTopConcept?: readonly rdfjs.NamedNode[];
    } & ConstructorParameters<typeof Labeled>[0],
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
    return super
      .equals(other)
      .chain(() =>
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
          "http://www.w3.org/2004/02/skos/core#ConceptScheme",
        ),
      );
    }

    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#hasTopConcept",
      ),
      this.hasTopConcept,
    );
    return resource;
  }
}

export namespace ConceptScheme {
  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, ConceptScheme> {
    return Labeled.fromRdf(resource, { ignoreRdfType: true }).chain(
      (_super) => {
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
            .flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            identifier: _super.identifier,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
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
    Labeled.hashLabeled(conceptScheme, hasher);
    for (const element of conceptScheme.hasTopConcept) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends Labeled.SparqlGraphPatterns {
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
    return super
      .equals(other)
      .chain(() =>
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
        const _memberListEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          readonly rdfjs.NamedNode[]
        > = resource
          .values(
            dataFactory.namedNode(
              "http://www.w3.org/2004/02/skos/core#memberList",
            ),
            { unique: true },
          )
          .head()
          .chain((value) => value.toList())
          .map((values) =>
            values.flatMap((value) =>
              value
                .toValues()
                .head()
                .chain((value) => value.toIri())
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
            hiddenLabel: _super.hiddenLabel,
            hiddenLabelXl: _super.hiddenLabelXl,
            identifier: _super.identifier,
            prefLabel: _super.prefLabel,
            prefLabelXl: _super.prefLabelXl,
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
    for (const element of orderedCollection.memberList) {
      hasher.update(rdfjsResource.Resource.Identifier.toString(element));
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
