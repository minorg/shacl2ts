import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";
export type MachineLearningModel = MachineLearningModel.Class;

export namespace MachineLearningModel {
  export interface Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily.Interface;
    readonly localIdentifier: string;
    readonly name: rdfjs.Literal;
    readonly trainingDataCutoff: purify.Maybe<string>;
    readonly type: "LanguageModel" | "MachineLearningModel";
    readonly url: purify.Maybe<string>;
  }

  export class Class implements MachineLearningModel.Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily.Interface;
    readonly localIdentifier: string;
    readonly name: rdfjs.Literal;
    readonly trainingDataCutoff: purify.Maybe<string>;
    readonly type: "LanguageModel" | "MachineLearningModel" =
      "MachineLearningModel";
    readonly url: purify.Maybe<string>;

    constructor(parameters: {
      readonly description?:
        | Date
        | boolean
        | number
        | purify.Maybe<rdfjs.Literal | boolean | Date | number | string>
        | rdfjs.Literal
        | string;
      readonly identifier: rdfjs.NamedNode;
      readonly isVariantOf: MachineLearningModelFamily.Interface;
      readonly localIdentifier: string;
      readonly name: Date | boolean | number | rdfjs.Literal | string;
      readonly trainingDataCutoff?: purify.Maybe<string> | string;
      readonly url?: purify.Maybe<string> | string;
    }) {
      this.description = (
        purify.Maybe.isMaybe(parameters.description)
          ? parameters.description
          : purify.Maybe.fromNullable(parameters.description)
      ).map((value) =>
        typeof value === "object" && !(value instanceof Date)
          ? value
          : rdfLiteral.toRdf(value, dataFactory),
      );
      this.identifier = parameters.identifier;
      this.isVariantOf = parameters.isVariantOf;
      this.localIdentifier = parameters.localIdentifier;
      this.name =
        typeof parameters.name === "object" &&
        !(parameters.name instanceof Date)
          ? parameters.name
          : rdfLiteral.toRdf(parameters.name, dataFactory);
      this.trainingDataCutoff = purify.Maybe.isMaybe(
        parameters.trainingDataCutoff,
      )
        ? parameters.trainingDataCutoff
        : purify.Maybe.fromNullable(parameters.trainingDataCutoff);
      this.url = purify.Maybe.isMaybe(parameters.url)
        ? parameters.url
        : purify.Maybe.fromNullable(parameters.url);
    }

    equals(
      other: MachineLearningModel.Interface,
    ): purifyHelpers.Equatable.EqualsResult {
      return MachineLearningModel.equals(this, other);
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<
      rdfjsResource.Resource.ValueError,
      MachineLearningModel.Class
    > {
      return MachineLearningModel.fromRdf(resource).map(
        (properties) => new MachineLearningModel.Class(properties),
      );
    }

    hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return MachineLearningModel.hash(this, hasher);
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return MachineLearningModel.toRdf(this, kwds);
    }
  }

  export function equals(
    left: MachineLearningModel.Interface,
    right: MachineLearningModel.Interface,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      description: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      isVariantOf: MachineLearningModelFamily.equals,
      localIdentifier: purifyHelpers.Equatable.strictEquals,
      name: purifyHelpers.Equatable.booleanEquals,
      trainingDataCutoff: (left, right) => left.equals(right),
      type: purifyHelpers.Equatable.strictEquals,
      url: (left, right) => left.equals(right),
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    MachineLearningModel.Interface
  > {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#MachineLearningModel",
        ),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#MachineLearningModel",
          ),
        }),
      );
    }

    const description = resource
      .value(dataFactory.namedNode("https://schema.org/description"))
      .chain((value) => value.toLiteral())
      .toMaybe();
    const identifier = resource.identifier;
    const _isVariantOfEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      MachineLearningModelFamily.Interface
    > = resource
      .value(dataFactory.namedNode("https://schema.org/isVariantOf"))
      .chain((value) =>
        value
          .toNamedResource()
          .chain((resource) => MachineLearningModelFamily.fromRdf(resource)),
      );
    if (_isVariantOfEither.isLeft()) {
      return _isVariantOfEither;
    }

    const isVariantOf = _isVariantOfEither.unsafeCoerce();
    const _localIdentifierEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = resource
      .value(dataFactory.namedNode("https://schema.org/identifier"))
      .chain((value) => value.toString());
    if (_localIdentifierEither.isLeft()) {
      return _localIdentifierEither;
    }

    const localIdentifier = _localIdentifierEither.unsafeCoerce();
    const _nameEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      rdfjs.Literal
    > = resource
      .value(dataFactory.namedNode("https://schema.org/name"))
      .chain((value) => value.toLiteral());
    if (_nameEither.isLeft()) {
      return _nameEither;
    }

    const name = _nameEither.unsafeCoerce();
    const trainingDataCutoff = resource
      .value(
        dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
        ),
      )
      .chain((value) => value.toString())
      .toMaybe();
    const type = "MachineLearningModel" as const;
    const url = resource
      .value(dataFactory.namedNode("https://schema.org/url"))
      .chain((value) => value.toString())
      .toMaybe();
    return purify.Either.of({
      description,
      identifier,
      isVariantOf,
      localIdentifier,
      name,
      trainingDataCutoff,
      type,
      url,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    machineLearningModel: Omit<
      MachineLearningModel.Interface,
      "identifier" | "type"
    > & { identifier?: rdfjs.NamedNode },
    hasher: HasherT,
  ): HasherT {
    machineLearningModel.description.ifJust((_description) => {
      hasher.update(_description.value);
    });
    if (typeof machineLearningModel.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(
          machineLearningModel.identifier,
        ),
      );
    }

    MachineLearningModelFamily.hash(machineLearningModel.isVariantOf, hasher);
    hasher.update(machineLearningModel.localIdentifier);
    hasher.update(machineLearningModel.name.value);
    machineLearningModel.trainingDataCutoff.ifJust((_trainingDataCutoff) => {
      hasher.update(_trainingDataCutoff);
    });
    machineLearningModel.url.ifJust((_url) => {
      hasher.update(_url);
    });
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
              "http://purl.annotize.ai/ontology/mlm#MachineLearningModel",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("https://schema.org/description"),
            this.variable("Description"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.group(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("https://schema.org/isVariantOf"),
            this.variable("IsVariantOf"),
          ).chainObject(
            (isVariantOf) =>
              new MachineLearningModelFamily.SparqlGraphPatterns(isVariantOf),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("https://schema.org/identifier"),
          this.variable("LocalIdentifier"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("https://schema.org/name"),
          this.variable("Name"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
            ),
            this.variable("TrainingDataCutoff"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("https://schema.org/url"),
            this.variable("Url"),
          ),
        ),
      );
    }
  }

  export function toRdf(
    machineLearningModel: MachineLearningModel.Interface,
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
      identifier: machineLearningModel.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#MachineLearningModel",
        ),
      );
    }

    machineLearningModel.description.ifJust((descriptionValue) => {
      resource.add(
        dataFactory.namedNode("https://schema.org/description"),
        descriptionValue,
      );
    });
    resource.add(
      dataFactory.namedNode("https://schema.org/isVariantOf"),
      MachineLearningModelFamily.toRdf(machineLearningModel.isVariantOf, {
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(
      dataFactory.namedNode("https://schema.org/identifier"),
      machineLearningModel.localIdentifier,
    );
    resource.add(
      dataFactory.namedNode("https://schema.org/name"),
      machineLearningModel.name,
    );
    machineLearningModel.trainingDataCutoff.ifJust(
      (trainingDataCutoffValue) => {
        resource.add(
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
          ),
          trainingDataCutoffValue,
        );
      },
    );
    machineLearningModel.url.ifJust((urlValue) => {
      resource.add(dataFactory.namedNode("https://schema.org/url"), urlValue);
    });
    return resource;
  }
}
export type LanguageModel = LanguageModel.Class;

export namespace LanguageModel {
  export interface Interface extends MachineLearningModel.Interface {
    readonly contextWindow: number;
    readonly maxTokenOutput: purify.Maybe<number>;
    readonly type: "LanguageModel";
  }

  export class Class
    extends MachineLearningModel.Class
    implements LanguageModel.Interface
  {
    readonly contextWindow: number;
    readonly maxTokenOutput: purify.Maybe<number>;
    override readonly type = "LanguageModel" as const;

    constructor(
      parameters: {
        readonly contextWindow: number;
        readonly maxTokenOutput?: number | purify.Maybe<number>;
      } & ConstructorParameters<typeof MachineLearningModel.Class>[0],
    ) {
      super(parameters);
      this.contextWindow = parameters.contextWindow;
      this.maxTokenOutput = purify.Maybe.isMaybe(parameters.maxTokenOutput)
        ? parameters.maxTokenOutput
        : purify.Maybe.fromNullable(parameters.maxTokenOutput);
    }

    override equals(
      other: LanguageModel.Interface,
    ): purifyHelpers.Equatable.EqualsResult {
      return LanguageModel.equals(this, other);
    }

    static override fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, LanguageModel.Class> {
      return LanguageModel.fromRdf(resource).map(
        (properties) => new LanguageModel.Class(properties),
      );
    }

    override hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return LanguageModel.hash(this, hasher);
    }

    override toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return LanguageModel.toRdf(this, kwds);
    }
  }

  export function equals(
    left: LanguageModel.Interface,
    right: LanguageModel.Interface,
  ): purifyHelpers.Equatable.EqualsResult {
    return MachineLearningModel.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
        contextWindow: purifyHelpers.Equatable.strictEquals,
        maxTokenOutput: (left, right) => left.equals(right),
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, LanguageModel.Interface> {
    return MachineLearningModel.fromRdf(resource, {
      ignoreRdfType: true,
    }).chain((_super) => {
      if (
        !_options?.ignoreRdfType &&
        !resource.isInstanceOf(
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#LanguageModel",
          ),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: resource,
            message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://purl.annotize.ai/ontology/mlm#LanguageModel",
            ),
          }),
        );
      }
      const _contextWindowEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        number
      > = resource
        .value(
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#contextWindow",
          ),
        )
        .chain((value) => value.toNumber());
      if (_contextWindowEither.isLeft()) {
        return _contextWindowEither;
      }
      const contextWindow = _contextWindowEither.unsafeCoerce();
      const maxTokenOutput = resource
        .value(
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#maxTokenOutput",
          ),
        )
        .chain((value) => value.toNumber())
        .toMaybe();
      const type = "LanguageModel" as const;
      return purify.Either.of({
        ..._super,
        contextWindow,
        maxTokenOutput,
        type,
      });
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    languageModel: Omit<LanguageModel.Interface, "identifier" | "type"> & {
      identifier?: rdfjs.NamedNode;
    },
    hasher: HasherT,
  ): HasherT {
    MachineLearningModel.hash(languageModel, hasher);
    hasher.update(languageModel.contextWindow.toString());
    languageModel.maxTokenOutput.ifJust((_maxTokenOutput) => {
      hasher.update(_maxTokenOutput.toString());
    });
    return hasher;
  }

  export class SparqlGraphPatterns extends MachineLearningModel.SparqlGraphPatterns {
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
              "http://purl.annotize.ai/ontology/mlm#LanguageModel",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#contextWindow",
          ),
          this.variable("ContextWindow"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode(
              "http://purl.annotize.ai/ontology/mlm#maxTokenOutput",
            ),
            this.variable("MaxTokenOutput"),
          ),
        ),
      );
    }
  }

  export function toRdf(
    languageModel: LanguageModel.Interface,
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
    const resource = MachineLearningModel.toRdf(languageModel, {
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
          "http://purl.annotize.ai/ontology/mlm#LanguageModel",
        ),
      );
    }

    resource.add(
      dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#contextWindow",
      ),
      languageModel.contextWindow,
    );
    languageModel.maxTokenOutput.ifJust((maxTokenOutputValue) => {
      resource.add(
        dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#maxTokenOutput",
        ),
        maxTokenOutputValue,
      );
    });
    return resource;
  }
}
export type MachineLearningModelFamily = MachineLearningModelFamily.Class;

export namespace MachineLearningModelFamily {
  export interface Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization.Interface;
    readonly name: rdfjs.Literal;
    readonly type: "MachineLearningModelFamily";
    readonly url: purify.Maybe<string>;
  }

  export class Class implements MachineLearningModelFamily.Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization.Interface;
    readonly name: rdfjs.Literal;
    readonly type = "MachineLearningModelFamily" as const;
    readonly url: purify.Maybe<string>;

    constructor(parameters: {
      readonly description?:
        | Date
        | boolean
        | number
        | purify.Maybe<rdfjs.Literal | boolean | Date | number | string>
        | rdfjs.Literal
        | string;
      readonly identifier: rdfjs.NamedNode;
      readonly manufacturer: Organization.Interface;
      readonly name: Date | boolean | number | rdfjs.Literal | string;
      readonly url?: purify.Maybe<string> | string;
    }) {
      this.description = (
        purify.Maybe.isMaybe(parameters.description)
          ? parameters.description
          : purify.Maybe.fromNullable(parameters.description)
      ).map((value) =>
        typeof value === "object" && !(value instanceof Date)
          ? value
          : rdfLiteral.toRdf(value, dataFactory),
      );
      this.identifier = parameters.identifier;
      this.manufacturer = parameters.manufacturer;
      this.name =
        typeof parameters.name === "object" &&
        !(parameters.name instanceof Date)
          ? parameters.name
          : rdfLiteral.toRdf(parameters.name, dataFactory);
      this.url = purify.Maybe.isMaybe(parameters.url)
        ? parameters.url
        : purify.Maybe.fromNullable(parameters.url);
    }

    equals(
      other: MachineLearningModelFamily.Interface,
    ): purifyHelpers.Equatable.EqualsResult {
      return MachineLearningModelFamily.equals(this, other);
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<
      rdfjsResource.Resource.ValueError,
      MachineLearningModelFamily.Class
    > {
      return MachineLearningModelFamily.fromRdf(resource).map(
        (properties) => new MachineLearningModelFamily.Class(properties),
      );
    }

    hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return MachineLearningModelFamily.hash(this, hasher);
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return MachineLearningModelFamily.toRdf(this, kwds);
    }
  }

  export function equals(
    left: MachineLearningModelFamily.Interface,
    right: MachineLearningModelFamily.Interface,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      description: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      manufacturer: Organization.equals,
      name: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
      url: (left, right) => left.equals(right),
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    MachineLearningModelFamily.Interface
  > {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#MachineLearningModelFamily",
        ),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#MachineLearningModelFamily",
          ),
        }),
      );
    }

    const description = resource
      .value(dataFactory.namedNode("https://schema.org/description"))
      .chain((value) => value.toLiteral())
      .toMaybe();
    const identifier = resource.identifier;
    const _manufacturerEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      Organization.Interface
    > = resource
      .value(dataFactory.namedNode("https://schema.org/manufacturer"))
      .chain((value) =>
        value
          .toNamedResource()
          .chain((resource) => Organization.fromRdf(resource)),
      );
    if (_manufacturerEither.isLeft()) {
      return _manufacturerEither;
    }

    const manufacturer = _manufacturerEither.unsafeCoerce();
    const _nameEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      rdfjs.Literal
    > = resource
      .value(dataFactory.namedNode("https://schema.org/name"))
      .chain((value) => value.toLiteral());
    if (_nameEither.isLeft()) {
      return _nameEither;
    }

    const name = _nameEither.unsafeCoerce();
    const type = "MachineLearningModelFamily" as const;
    const url = resource
      .value(dataFactory.namedNode("https://schema.org/url"))
      .chain((value) => value.toString())
      .toMaybe();
    return purify.Either.of({
      description,
      identifier,
      manufacturer,
      name,
      type,
      url,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    machineLearningModelFamily: Omit<
      MachineLearningModelFamily.Interface,
      "identifier" | "type"
    > & { identifier?: rdfjs.NamedNode },
    hasher: HasherT,
  ): HasherT {
    machineLearningModelFamily.description.ifJust((_description) => {
      hasher.update(_description.value);
    });
    if (typeof machineLearningModelFamily.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(
          machineLearningModelFamily.identifier,
        ),
      );
    }

    Organization.hash(machineLearningModelFamily.manufacturer, hasher);
    hasher.update(machineLearningModelFamily.name.value);
    machineLearningModelFamily.url.ifJust((_url) => {
      hasher.update(_url);
    });
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
              "http://purl.annotize.ai/ontology/mlm#MachineLearningModelFamily",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("https://schema.org/description"),
            this.variable("Description"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.group(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("https://schema.org/manufacturer"),
            this.variable("Manufacturer"),
          ).chainObject(
            (manufacturer) =>
              new Organization.SparqlGraphPatterns(manufacturer),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("https://schema.org/name"),
          this.variable("Name"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("https://schema.org/url"),
            this.variable("Url"),
          ),
        ),
      );
    }
  }

  export function toRdf(
    machineLearningModelFamily: MachineLearningModelFamily.Interface,
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
      identifier: machineLearningModelFamily.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#MachineLearningModelFamily",
        ),
      );
    }

    machineLearningModelFamily.description.ifJust((descriptionValue) => {
      resource.add(
        dataFactory.namedNode("https://schema.org/description"),
        descriptionValue,
      );
    });
    resource.add(
      dataFactory.namedNode("https://schema.org/manufacturer"),
      Organization.toRdf(machineLearningModelFamily.manufacturer, {
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(
      dataFactory.namedNode("https://schema.org/name"),
      machineLearningModelFamily.name,
    );
    machineLearningModelFamily.url.ifJust((urlValue) => {
      resource.add(dataFactory.namedNode("https://schema.org/url"), urlValue);
    });
    return resource;
  }
}
export type Organization = Organization.Class;

export namespace Organization {
  export interface Interface {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;
    readonly type: "Organization";
  }

  export class Class implements Organization.Interface {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;
    readonly type = "Organization" as const;

    constructor(parameters: {
      readonly identifier: rdfjs.NamedNode;
      readonly name: Date | boolean | number | rdfjs.Literal | string;
    }) {
      this.identifier = parameters.identifier;
      this.name =
        typeof parameters.name === "object" &&
        !(parameters.name instanceof Date)
          ? parameters.name
          : rdfLiteral.toRdf(parameters.name, dataFactory);
    }

    equals(
      other: Organization.Interface,
    ): purifyHelpers.Equatable.EqualsResult {
      return Organization.equals(this, other);
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, Organization.Class> {
      return Organization.fromRdf(resource).map(
        (properties) => new Organization.Class(properties),
      );
    }

    hash<
      HasherT extends {
        update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
      },
    >(hasher: HasherT): HasherT {
      return Organization.hash(this, hasher);
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return Organization.toRdf(this, kwds);
    }
  }

  export function equals(
    left: Organization.Interface,
    right: Organization.Interface,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      name: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Organization.Interface> {
    if (
      !_options?.ignoreRdfType &&
      !resource.isInstanceOf(
        dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#Organization",
        ),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: resource,
          message: `${rdfjsResource.Resource.Identifier.toString(resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#Organization",
          ),
        }),
      );
    }

    const identifier = resource.identifier;
    const _nameEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      rdfjs.Literal
    > = resource
      .value(dataFactory.namedNode("https://schema.org/name"))
      .chain((value) => value.toLiteral());
    if (_nameEither.isLeft()) {
      return _nameEither;
    }

    const name = _nameEither.unsafeCoerce();
    const type = "Organization" as const;
    return purify.Either.of({ identifier, name, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    organization: Omit<Organization.Interface, "identifier" | "type"> & {
      identifier?: rdfjs.NamedNode;
    },
    hasher: HasherT,
  ): HasherT {
    if (typeof organization.identifier !== "undefined") {
      hasher.update(
        rdfjsResource.Resource.Identifier.toString(organization.identifier),
      );
    }

    hasher.update(organization.name.value);
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
              "http://purl.annotize.ai/ontology/mlm#Organization",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("https://schema.org/name"),
          this.variable("Name"),
        ),
      );
    }
  }

  export function toRdf(
    organization: Organization.Interface,
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
      identifier: organization.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      resource.add(
        resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        resource.dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#Organization",
        ),
      );
    }

    resource.add(
      dataFactory.namedNode("https://schema.org/name"),
      organization.name,
    );
    return resource;
  }
}
