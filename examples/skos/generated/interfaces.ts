import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

export interface Label {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly literalForm: readonly rdfjs.Literal[];
  readonly type: "Label";
}

export namespace Label {
  export function equals(
    left: Label,
    right: Label,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
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

  export function fromRdf(
    resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      literalForm: readonly rdfjs.Literal[];
      type: "Label";
    }
  > {
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
        .flatMap((resourceValue) =>
          resourceValue.toLiteral().toMaybe().toList(),
        ),
    ]);
    if (_literalFormEither.isLeft()) {
      return _literalFormEither;
    }

    const literalForm = _literalFormEither.unsafeCoerce();
    const type = "Label" as const;
    return purify.Either.of({ identifier, literalForm, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(label: Omit<Label, "identifier" | "type">, hasher: HasherT): HasherT {
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

    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
      label.literalForm,
    );
    return resource;
  }
}

export interface Labeled {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly identifier: rdfjs.NamedNode;
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly type:
    | "Collection"
    | "Concept"
    | "ConceptScheme"
    | "OrderedCollection";
}

namespace Labeled {
  export function equals(
    left: Labeled,
    right: Labeled,
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
  >(labeled: Omit<Labeled, "identifier" | "type">, hasher: HasherT): HasherT {
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

  export function toRdf(
    labeled: Labeled,
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
      identifier: labeled.identifier,
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
      labeled.altLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#altLabel"),
      labeled.altLabelXl,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#hiddenLabel"),
      labeled.hiddenLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#hiddenLabel"),
      labeled.hiddenLabelXl,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#prefLabel"),
      labeled.prefLabel,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#prefLabel"),
      labeled.prefLabelXl,
    );
    return resource;
  }
}

export interface Collection extends Labeled {
  readonly member: readonly rdfjs.NamedNode[];
  readonly type: "Collection" | "OrderedCollection";
}

export namespace Collection {
  export function equals(
    left: Collection,
    right: Collection,
  ): purifyHelpers.Equatable.EqualsResult {
    return Labeled.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
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
      member: readonly rdfjs.NamedNode[];
      type: "Collection" | "OrderedCollection";
    }
  > {
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
            ),
        ]);
        if (_memberEither.isLeft()) {
          return _memberEither;
        }
        const member = _memberEither.unsafeCoerce();
        const type = "Collection" as const;
        return purify.Either.of({
          altLabel: _super.altLabel,
          altLabelXl: _super.altLabelXl,
          hiddenLabel: _super.hiddenLabel,
          hiddenLabelXl: _super.hiddenLabelXl,
          identifier: _super.identifier,
          prefLabel: _super.prefLabel,
          prefLabelXl: _super.prefLabelXl,
          member,
          type,
        });
      },
    );
  }

  export function hashCollection<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    collection: Omit<Collection, "identifier" | "type">,
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
    const resource = Labeled.toRdf(collection, {
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
      collection.member,
    );
    return resource;
  }
}

export interface Concept extends Labeled {
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
  readonly type: "Concept";
}

export namespace Concept {
  export function equals(
    left: Concept,
    right: Concept,
  ): purifyHelpers.Equatable.EqualsResult {
    return Labeled.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
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
      broader: readonly rdfjs.NamedNode[];
      broaderTransitive: readonly rdfjs.NamedNode[];
      broadMatch: readonly rdfjs.NamedNode[];
      changeNote: readonly rdfjs.Literal[];
      closeMatch: readonly rdfjs.NamedNode[];
      definition: readonly rdfjs.Literal[];
      editorialNote: readonly rdfjs.Literal[];
      exactMatch: readonly rdfjs.NamedNode[];
      example: readonly rdfjs.Literal[];
      historyNote: readonly rdfjs.Literal[];
      inScheme: readonly rdfjs.NamedNode[];
      mappingRelation: readonly rdfjs.NamedNode[];
      narrower: readonly rdfjs.NamedNode[];
      narrowerTransitive: readonly rdfjs.NamedNode[];
      narrowMatch: readonly rdfjs.NamedNode[];
      notation: readonly rdfjs.Literal[];
      note: readonly rdfjs.Literal[];
      related: readonly rdfjs.NamedNode[];
      relatedMatch: readonly rdfjs.NamedNode[];
      scopeNote: readonly rdfjs.Literal[];
      semanticRelation: readonly rdfjs.NamedNode[];
      topConceptOf: readonly rdfjs.NamedNode[];
      type: "Concept";
    }
  > {
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toLiteral().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toLiteral().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
              dataFactory.namedNode(
                "http://www.w3.org/2004/02/skos/core#notation",
              ),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
            ),
        ]);
        if (_topConceptOfEither.isLeft()) {
          return _topConceptOfEither;
        }
        const topConceptOf = _topConceptOfEither.unsafeCoerce();
        const type = "Concept" as const;
        return purify.Either.of({
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
          type,
        });
      },
    );
  }

  export function hashConcept<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(concept: Omit<Concept, "identifier" | "type">, hasher: HasherT): HasherT {
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
    const resource = Labeled.toRdf(concept, {
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
      concept.broader,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#broaderTransitive",
      ),
      concept.broaderTransitive,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#broadMatch"),
      concept.broadMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#changeNote"),
      concept.changeNote,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#closeMatch"),
      concept.closeMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#definition"),
      concept.definition,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#editorialNote",
      ),
      concept.editorialNote,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#exactMatch"),
      concept.exactMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#example"),
      concept.example,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#historyNote"),
      concept.historyNote,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#inScheme"),
      concept.inScheme,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#mappingRelation",
      ),
      concept.mappingRelation,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrower"),
      concept.narrower,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#narrowerTransitive",
      ),
      concept.narrowerTransitive,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#narrowMatch"),
      concept.narrowMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      concept.notation,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#notation"),
      concept.note,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#related"),
      concept.related,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#relatedMatch"),
      concept.relatedMatch,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#scopeNote"),
      concept.scopeNote,
    );
    resource.add(
      dataFactory.namedNode(
        "http://www.w3.org/2004/02/skos/core#semanticRelation",
      ),
      concept.semanticRelation,
    );
    resource.add(
      dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#topConceptOf"),
      concept.topConceptOf,
    );
    return resource;
  }
}

export interface ConceptScheme extends Labeled {
  readonly hasTopConcept: readonly rdfjs.NamedNode[];
  readonly type: "ConceptScheme";
}

export namespace ConceptScheme {
  export function equals(
    left: ConceptScheme,
    right: ConceptScheme,
  ): purifyHelpers.Equatable.EqualsResult {
    return Labeled.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
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
      hasTopConcept: readonly rdfjs.NamedNode[];
      type: "ConceptScheme";
    }
  > {
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
            .flatMap((resourceValue) =>
              resourceValue.toIri().toMaybe().toList(),
            ),
        ]);
        if (_hasTopConceptEither.isLeft()) {
          return _hasTopConceptEither;
        }
        const hasTopConcept = _hasTopConceptEither.unsafeCoerce();
        const type = "ConceptScheme" as const;
        return purify.Either.of({
          altLabel: _super.altLabel,
          altLabelXl: _super.altLabelXl,
          hiddenLabel: _super.hiddenLabel,
          hiddenLabelXl: _super.hiddenLabelXl,
          identifier: _super.identifier,
          prefLabel: _super.prefLabel,
          prefLabelXl: _super.prefLabelXl,
          hasTopConcept,
          type,
        });
      },
    );
  }

  export function hashConceptScheme<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    conceptScheme: Omit<ConceptScheme, "identifier" | "type">,
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
    const resource = Labeled.toRdf(conceptScheme, {
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
      conceptScheme.hasTopConcept,
    );
    return resource;
  }
}

export interface OrderedCollection extends Collection {
  readonly memberList: readonly rdfjs.NamedNode[];
  readonly type: "OrderedCollection";
}

export namespace OrderedCollection {
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
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      member: readonly rdfjs.NamedNode[];
      type: "OrderedCollection";
      altLabel: readonly rdfjs.Literal[];
      altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      hiddenLabel: readonly rdfjs.Literal[];
      hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      identifier: rdfjs.NamedNode;
      prefLabel: readonly rdfjs.Literal[];
      prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      memberList: readonly rdfjs.NamedNode[];
    }
  > {
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
        return purify.Either.of({
          member: _super.member,
          type,
          altLabel: _super.altLabel,
          altLabelXl: _super.altLabelXl,
          hiddenLabel: _super.hiddenLabel,
          hiddenLabelXl: _super.hiddenLabelXl,
          identifier: _super.identifier,
          prefLabel: _super.prefLabel,
          prefLabelXl: _super.prefLabelXl,
          memberList,
        });
      },
    );
  }

  export function hashOrderedCollection<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    orderedCollection: Omit<OrderedCollection, "identifier" | "type">,
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
