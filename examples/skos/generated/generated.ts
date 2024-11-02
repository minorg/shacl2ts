import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

export interface Concept {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly broader: readonly rdfjs.NamedNode[];
  readonly broaderTransitive: readonly rdfjs.NamedNode[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly identifier: rdfjs.NamedNode;
  readonly narrower: readonly rdfjs.NamedNode[];
  readonly narrowerTransitive: readonly rdfjs.NamedNode[];
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
  readonly related: readonly rdfjs.NamedNode[];
  readonly semanticRelation: readonly rdfjs.NamedNode[];
  readonly type: "Concept";
}

export namespace Concept {
  export class Class implements Concept {
    readonly altLabel: readonly rdfjs.Literal[];
    readonly altLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly broader: readonly rdfjs.NamedNode[];
    readonly broaderTransitive: readonly rdfjs.NamedNode[];
    readonly hiddenLabel: readonly rdfjs.Literal[];
    readonly hiddenLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly identifier: rdfjs.NamedNode;
    readonly narrower: readonly rdfjs.NamedNode[];
    readonly narrowerTransitive: readonly rdfjs.NamedNode[];
    readonly prefLabel: readonly rdfjs.Literal[];
    readonly prefLabelXl: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
    readonly related: readonly rdfjs.NamedNode[];
    readonly semanticRelation: readonly rdfjs.NamedNode[];
    readonly type = "Concept" as const;

    constructor(parameters: Concept.Class.ConstructorParameters) {
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
      this.hiddenLabel =
        typeof parameters.hiddenLabel !== "undefined"
          ? parameters.hiddenLabel
          : [];
      this.hiddenLabelXl =
        typeof parameters.hiddenLabelXl !== "undefined"
          ? parameters.hiddenLabelXl
          : [];
      this.identifier = parameters.identifier;
      this.narrower =
        typeof parameters.narrower !== "undefined" ? parameters.narrower : [];
      this.narrowerTransitive =
        typeof parameters.narrowerTransitive !== "undefined"
          ? parameters.narrowerTransitive
          : [];
      this.prefLabel =
        typeof parameters.prefLabel !== "undefined" ? parameters.prefLabel : [];
      this.prefLabelXl =
        typeof parameters.prefLabelXl !== "undefined"
          ? parameters.prefLabelXl
          : [];
      this.related =
        typeof parameters.related !== "undefined" ? parameters.related : [];
      this.semanticRelation =
        typeof parameters.semanticRelation !== "undefined"
          ? parameters.semanticRelation
          : [];
    }

    equals(other: Concept): purifyHelpers.Equatable.EqualsResult {
      return Concept.equals(this, other);
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, Concept.Class> {
      return Concept.fromRdf(resource).map(
        (properties) => new Concept.Class(properties),
      );
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

  export namespace Class {
    export interface ConstructorParameters {
      readonly altLabel?: readonly rdfjs.Literal[];
      readonly altLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      readonly broader?: readonly rdfjs.NamedNode[];
      readonly broaderTransitive?: readonly rdfjs.NamedNode[];
      readonly hiddenLabel?: readonly rdfjs.Literal[];
      readonly hiddenLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      readonly identifier: rdfjs.NamedNode;
      readonly narrower?: readonly rdfjs.NamedNode[];
      readonly narrowerTransitive?: readonly rdfjs.NamedNode[];
      readonly prefLabel?: readonly rdfjs.Literal[];
      readonly prefLabelXl?: readonly (rdfjs.BlankNode | rdfjs.NamedNode)[];
      readonly related?: readonly rdfjs.NamedNode[];
      readonly semanticRelation?: readonly rdfjs.NamedNode[];
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
      semanticRelation: (left, right) =>
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
    const identifier = resource.identifier;
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
    const semanticRelation = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#semanticRelation",
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
      hiddenLabel,
      hiddenLabelXl,
      identifier,
      narrower,
      narrowerTransitive,
      prefLabel,
      prefLabelXl,
      related,
      semanticRelation,
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
    for (const _altLabelElement of concept.altLabel) {
      hasher.update(_altLabelElement.value);
    }

    for (const _altLabelXlElement of concept.altLabelXl) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_altLabelXlElement),
      );
    }

    for (const _broaderElement of concept.broader) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_broaderElement),
      );
    }

    for (const _broaderTransitiveElement of concept.broaderTransitive) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_broaderTransitiveElement),
      );
    }

    for (const _hiddenLabelElement of concept.hiddenLabel) {
      hasher.update(_hiddenLabelElement.value);
    }

    for (const _hiddenLabelXlElement of concept.hiddenLabelXl) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_hiddenLabelXlElement),
      );
    }

    if (typeof concept.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(concept.identifier),
      );
    }

    for (const _narrowerElement of concept.narrower) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_narrowerElement),
      );
    }

    for (const _narrowerTransitiveElement of concept.narrowerTransitive) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_narrowerTransitiveElement),
      );
    }

    for (const _prefLabelElement of concept.prefLabel) {
      hasher.update(_prefLabelElement.value);
    }

    for (const _prefLabelXlElement of concept.prefLabelXl) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_prefLabelXlElement),
      );
    }

    for (const _relatedElement of concept.related) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_relatedElement),
      );
    }

    for (const _semanticRelationElement of concept.semanticRelation) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_semanticRelationElement),
      );
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
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
            "http://www.w3.org/2004/02/skos/core#semanticRelation",
          ),
          this.variable("SemanticRelation"),
        ),
      );
    }
  }

  export function toRdf(
    concept: Concept,
    {
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

    for (const semanticRelationValue of concept.semanticRelation) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#semanticRelation",
        ),
        semanticRelationValue,
      );
    }

    return resource;
  }
}

export interface ConceptScheme {
  readonly altLabel: readonly rdfjs.Literal[];
  readonly hiddenLabel: readonly rdfjs.Literal[];
  readonly identifier: rdfjs.NamedNode;
  readonly prefLabel: readonly rdfjs.Literal[];
  readonly skos_hasTopConcept: readonly rdfjs.NamedNode[];
  readonly type: "ConceptScheme";
}

export namespace ConceptScheme {
  export class Class implements ConceptScheme {
    readonly altLabel: readonly rdfjs.Literal[];
    readonly hiddenLabel: readonly rdfjs.Literal[];
    readonly identifier: rdfjs.NamedNode;
    readonly prefLabel: readonly rdfjs.Literal[];
    readonly skos_hasTopConcept: readonly rdfjs.NamedNode[];
    readonly type = "ConceptScheme" as const;

    constructor(parameters: ConceptScheme.Class.ConstructorParameters) {
      this.altLabel =
        typeof parameters.altLabel !== "undefined" ? parameters.altLabel : [];
      this.hiddenLabel =
        typeof parameters.hiddenLabel !== "undefined"
          ? parameters.hiddenLabel
          : [];
      this.identifier = parameters.identifier;
      this.prefLabel =
        typeof parameters.prefLabel !== "undefined" ? parameters.prefLabel : [];
      this.skos_hasTopConcept =
        typeof parameters.skos_hasTopConcept !== "undefined"
          ? parameters.skos_hasTopConcept
          : [];
    }

    equals(other: ConceptScheme): purifyHelpers.Equatable.EqualsResult {
      return ConceptScheme.equals(this, other);
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, ConceptScheme.Class> {
      return ConceptScheme.fromRdf(resource).map(
        (properties) => new ConceptScheme.Class(properties),
      );
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

  export namespace Class {
    export interface ConstructorParameters {
      readonly altLabel?: readonly rdfjs.Literal[];
      readonly hiddenLabel?: readonly rdfjs.Literal[];
      readonly identifier: rdfjs.NamedNode;
      readonly prefLabel?: readonly rdfjs.Literal[];
      readonly skos_hasTopConcept?: readonly rdfjs.NamedNode[];
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
      skos_hasTopConcept: (left, right) =>
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
    const altLabel = [
      ...resource
        .values(
          dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
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
    const skos_hasTopConcept = [
      ...resource
        .values(
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hasTopConcept",
          ),
        )
        .flatMap((value) => value.toIri().toMaybe().toList()),
    ];
    const type = "ConceptScheme" as const;
    return purify.Either.of({
      altLabel,
      hiddenLabel,
      identifier,
      prefLabel,
      skos_hasTopConcept,
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
    for (const _altLabelElement of conceptScheme.altLabel) {
      hasher.update(_altLabelElement.value);
    }

    for (const _hiddenLabelElement of conceptScheme.hiddenLabel) {
      hasher.update(_hiddenLabelElement.value);
    }

    if (typeof conceptScheme.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(conceptScheme.identifier),
      );
    }

    for (const _prefLabelElement of conceptScheme.prefLabel) {
      hasher.update(_prefLabelElement.value);
    }

    for (const _skos_hasTopConceptElement of conceptScheme.skos_hasTopConcept) {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(_skos_hasTopConceptElement),
      );
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
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
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://www.w3.org/2004/02/skos/core#hasTopConcept",
          ),
          this.variable("SkosHasTopConcept"),
        ),
      );
    }
  }

  export function toRdf(
    conceptScheme: ConceptScheme,
    {
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
    for (const altLabelValue of conceptScheme.altLabel) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2004/02/skos/core#altLabel"),
        altLabelValue,
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

    for (const skos_hasTopConceptValue of conceptScheme.skos_hasTopConcept) {
      resource.add(
        dataFactory.namedNode(
          "http://www.w3.org/2004/02/skos/core#hasTopConcept",
        ),
        skos_hasTopConceptValue,
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

    constructor(parameters: Label.Class.ConstructorParameters) {
      this.identifier = parameters.identifier;
      this.skos$j$xl_literalForm = parameters.skos$j$xl_literalForm;
    }

    equals(other: Label): purifyHelpers.Equatable.EqualsResult {
      return Label.equals(this, other);
    }

    static fromRdf(
      resource: rdfjsResource.Resource,
    ): purify.Either<rdfjsResource.Resource.ValueError, Label.Class> {
      return Label.fromRdf(resource).map(
        (properties) => new Label.Class(properties),
      );
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

  export namespace Class {
    export interface ConstructorParameters {
      readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      readonly skos$j$xl_literalForm: readonly rdfjs.Literal[];
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

    for (const _skos$j$xl_literalFormElement of label.skos$j$xl_literalForm) {
      hasher.update(_skos$j$xl_literalFormElement.value);
    }

    return hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
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
    for (const skos$j$xl_literalFormValue of label.skos$j$xl_literalForm) {
      resource.add(
        dataFactory.namedNode("http://www.w3.org/2008/05/skos-xl#literalForm"),
        skos$j$xl_literalFormValue,
      );
    }

    return resource;
  }
}
