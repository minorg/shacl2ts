import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
// @ts-ignore
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";

export class MachineLearningModel {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: MachineLearningModelFamily;
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
      | purify.Maybe<rdfjs.Literal>
      | rdfjs.Literal
      | string;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily;
    readonly localIdentifier: string;
    readonly name: Date | boolean | number | rdfjs.Literal | string;
    readonly trainingDataCutoff?: purify.Maybe<string> | string;
    readonly url?: purify.Maybe<string> | string;
  }) {
    if (purify.Maybe.isMaybe(parameters.description)) {
      this.description = parameters.description;
    } else if (typeof parameters.description === "boolean") {
      this.description = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.description),
      );
    } else if (
      typeof parameters.description === "object" &&
      parameters.description instanceof Date
    ) {
      this.description = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.description),
      );
    } else if (typeof parameters.description === "number") {
      this.description = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.description),
      );
    } else if (typeof parameters.description === "string") {
      this.description = purify.Maybe.of(
        dataFactory.literal(parameters.description),
      );
    } else if (typeof parameters.description === "object") {
      this.description = purify.Maybe.of(parameters.description);
    } else if (typeof parameters.description === "undefined") {
      this.description = purify.Maybe.empty();
    } else {
      this.description = parameters.description; // never
    }

    this.identifier = parameters.identifier;
    this.isVariantOf = parameters.isVariantOf;
    this.localIdentifier = parameters.localIdentifier;
    if (typeof parameters.name === "boolean") {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (
      typeof parameters.name === "object" &&
      parameters.name instanceof Date
    ) {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (typeof parameters.name === "number") {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (typeof parameters.name === "string") {
      this.name = dataFactory.literal(parameters.name);
    } else if (typeof parameters.name === "object") {
      this.name = parameters.name;
    } else {
      this.name = parameters.name; // never
    }

    if (purify.Maybe.isMaybe(parameters.trainingDataCutoff)) {
      this.trainingDataCutoff = parameters.trainingDataCutoff;
    } else if (typeof parameters.trainingDataCutoff === "string") {
      this.trainingDataCutoff = purify.Maybe.of(parameters.trainingDataCutoff);
    } else if (typeof parameters.trainingDataCutoff === "undefined") {
      this.trainingDataCutoff = purify.Maybe.empty();
    } else {
      this.trainingDataCutoff = parameters.trainingDataCutoff; // never
    }

    if (purify.Maybe.isMaybe(parameters.url)) {
      this.url = parameters.url;
    } else if (typeof parameters.url === "string") {
      this.url = purify.Maybe.of(parameters.url);
    } else if (typeof parameters.url === "undefined") {
      this.url = purify.Maybe.empty();
    } else {
      this.url = parameters.url; // never
    }
  }

  equals(other: MachineLearningModel): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      description: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      isVariantOf: purifyHelpers.Equatable.equals,
      localIdentifier: purifyHelpers.Equatable.strictEquals,
      name: purifyHelpers.Equatable.booleanEquals,
      trainingDataCutoff: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
      url: purifyHelpers.Equatable.booleanEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return MachineLearningModel.hashMachineLearningModel(this, hasher);
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
          "http://purl.annotize.ai/ontology/mlm#MachineLearningModel",
        ),
      );
    }

    resource.add(
      dataFactory.namedNode("https://schema.org/description"),
      this.description,
    );
    resource.add(
      dataFactory.namedNode("https://schema.org/isVariantOf"),
      this.isVariantOf.toRdf({
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(
      dataFactory.namedNode("https://schema.org/identifier"),
      this.localIdentifier,
    );
    resource.add(dataFactory.namedNode("https://schema.org/name"), this.name);
    resource.add(
      dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
      ),
      this.trainingDataCutoff,
    );
    resource.add(dataFactory.namedNode("https://schema.org/url"), this.url);
    return resource;
  }
}

export namespace MachineLearningModel {
  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, MachineLearningModel> {
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

    const _descriptionEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<rdfjs.Literal>
    > = purify.Either.of(
      resource
        .values(dataFactory.namedNode("https://schema.org/description"), {
          unique: true,
        })
        .head()
        .chain((value) => value.toLiteral())
        .toMaybe(),
    );
    if (_descriptionEither.isLeft()) {
      return _descriptionEither;
    }

    const description = _descriptionEither.unsafeCoerce();
    const identifier = resource.identifier;
    const _isVariantOfEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      MachineLearningModelFamily
    > = resource
      .values(dataFactory.namedNode("https://schema.org/isVariantOf"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toNamedResource())
      .chain((resource) => MachineLearningModelFamily.fromRdf(resource));
    if (_isVariantOfEither.isLeft()) {
      return _isVariantOfEither;
    }

    const isVariantOf = _isVariantOfEither.unsafeCoerce();
    const _localIdentifierEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = resource
      .values(dataFactory.namedNode("https://schema.org/identifier"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toString());
    if (_localIdentifierEither.isLeft()) {
      return _localIdentifierEither;
    }

    const localIdentifier = _localIdentifierEither.unsafeCoerce();
    const _nameEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      rdfjs.Literal
    > = resource
      .values(dataFactory.namedNode("https://schema.org/name"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toLiteral());
    if (_nameEither.isLeft()) {
      return _nameEither;
    }

    const name = _nameEither.unsafeCoerce();
    const _trainingDataCutoffEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<string>
    > = purify.Either.of(
      resource
        .values(
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
          ),
          { unique: true },
        )
        .head()
        .chain((value) => value.toString())
        .toMaybe(),
    );
    if (_trainingDataCutoffEither.isLeft()) {
      return _trainingDataCutoffEither;
    }

    const trainingDataCutoff = _trainingDataCutoffEither.unsafeCoerce();
    const _urlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<string>
    > = purify.Either.of(
      resource
        .values(dataFactory.namedNode("https://schema.org/url"), {
          unique: true,
        })
        .head()
        .chain((value) => value.toString())
        .toMaybe(),
    );
    if (_urlEither.isLeft()) {
      return _urlEither;
    }

    const url = _urlEither.unsafeCoerce();
    return purify.Either.of(
      new MachineLearningModel({
        description,
        identifier,
        isVariantOf,
        localIdentifier,
        name,
        trainingDataCutoff,
        url,
      }),
    );
  }

  export function hashMachineLearningModel<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    machineLearningModel: Omit<
      MachineLearningModel,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    hasher: HasherT,
  ): HasherT {
    machineLearningModel.description.ifJust((value) => {
      hasher.update(value.value);
    });
    MachineLearningModelFamily.hash(machineLearningModel.isVariantOf, hasher);
    hasher.update(machineLearningModel.localIdentifier);
    hasher.update(machineLearningModel.name.value);
    machineLearningModel.trainingDataCutoff.ifJust((value) => {
      hasher.update(value);
    });
    machineLearningModel.url.ifJust((value) => {
      hasher.update(value);
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
            (object) =>
              new MachineLearningModelFamily.SparqlGraphPatterns(object),
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
}

export class LanguageModel extends MachineLearningModel {
  readonly contextWindow: number;
  readonly maxTokenOutput: purify.Maybe<number>;
  override readonly type = "LanguageModel" as const;

  constructor(
    parameters: {
      readonly contextWindow: number;
      readonly maxTokenOutput?: number | purify.Maybe<number>;
    } & ConstructorParameters<typeof MachineLearningModel>[0],
  ) {
    super(parameters);
    this.contextWindow = parameters.contextWindow;
    if (purify.Maybe.isMaybe(parameters.maxTokenOutput)) {
      this.maxTokenOutput = parameters.maxTokenOutput;
    } else if (typeof parameters.maxTokenOutput === "number") {
      this.maxTokenOutput = purify.Maybe.of(parameters.maxTokenOutput);
    } else if (typeof parameters.maxTokenOutput === "undefined") {
      this.maxTokenOutput = purify.Maybe.empty();
    } else {
      this.maxTokenOutput = parameters.maxTokenOutput; // never
    }
  }

  override equals(other: LanguageModel): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        contextWindow: purifyHelpers.Equatable.strictEquals,
        maxTokenOutput: purifyHelpers.Equatable.booleanEquals,
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return LanguageModel.hashLanguageModel(this, hasher);
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
          "http://purl.annotize.ai/ontology/mlm#LanguageModel",
        ),
      );
    }

    resource.add(
      dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#contextWindow",
      ),
      this.contextWindow,
    );
    resource.add(
      dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#maxTokenOutput",
      ),
      this.maxTokenOutput,
    );
    return resource;
  }
}

export namespace LanguageModel {
  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, LanguageModel> {
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
        .values(
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#contextWindow",
          ),
          { unique: true },
        )
        .head()
        .chain((value) => value.toNumber());
      if (_contextWindowEither.isLeft()) {
        return _contextWindowEither;
      }
      const contextWindow = _contextWindowEither.unsafeCoerce();
      const _maxTokenOutputEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        purify.Maybe<number>
      > = purify.Either.of(
        resource
          .values(
            dataFactory.namedNode(
              "http://purl.annotize.ai/ontology/mlm#maxTokenOutput",
            ),
            { unique: true },
          )
          .head()
          .chain((value) => value.toNumber())
          .toMaybe(),
      );
      if (_maxTokenOutputEither.isLeft()) {
        return _maxTokenOutputEither;
      }
      const maxTokenOutput = _maxTokenOutputEither.unsafeCoerce();
      return purify.Either.of(
        new LanguageModel({
          description: _super.description,
          identifier: _super.identifier,
          isVariantOf: _super.isVariantOf,
          localIdentifier: _super.localIdentifier,
          name: _super.name,
          trainingDataCutoff: _super.trainingDataCutoff,
          url: _super.url,
          contextWindow,
          maxTokenOutput,
        }),
      );
    });
  }

  export function hashLanguageModel<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    languageModel: Omit<
      LanguageModel,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    hasher: HasherT,
  ): HasherT {
    MachineLearningModel.hashMachineLearningModel(languageModel, hasher);
    hasher.update(languageModel.contextWindow.toString());
    languageModel.maxTokenOutput.ifJust((value) => {
      hasher.update(value.toString());
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
}

export class MachineLearningModelFamily {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly manufacturer: Organization;
  readonly name: rdfjs.Literal;
  readonly type = "MachineLearningModelFamily" as const;
  readonly url: purify.Maybe<string>;

  constructor(parameters: {
    readonly description?:
      | Date
      | boolean
      | number
      | purify.Maybe<rdfjs.Literal>
      | rdfjs.Literal
      | string;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization;
    readonly name: Date | boolean | number | rdfjs.Literal | string;
    readonly url?: purify.Maybe<string> | string;
  }) {
    if (purify.Maybe.isMaybe(parameters.description)) {
      this.description = parameters.description;
    } else if (typeof parameters.description === "boolean") {
      this.description = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.description),
      );
    } else if (
      typeof parameters.description === "object" &&
      parameters.description instanceof Date
    ) {
      this.description = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.description),
      );
    } else if (typeof parameters.description === "number") {
      this.description = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.description),
      );
    } else if (typeof parameters.description === "string") {
      this.description = purify.Maybe.of(
        dataFactory.literal(parameters.description),
      );
    } else if (typeof parameters.description === "object") {
      this.description = purify.Maybe.of(parameters.description);
    } else if (typeof parameters.description === "undefined") {
      this.description = purify.Maybe.empty();
    } else {
      this.description = parameters.description; // never
    }

    this.identifier = parameters.identifier;
    this.manufacturer = parameters.manufacturer;
    if (typeof parameters.name === "boolean") {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (
      typeof parameters.name === "object" &&
      parameters.name instanceof Date
    ) {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (typeof parameters.name === "number") {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (typeof parameters.name === "string") {
      this.name = dataFactory.literal(parameters.name);
    } else if (typeof parameters.name === "object") {
      this.name = parameters.name;
    } else {
      this.name = parameters.name; // never
    }

    if (purify.Maybe.isMaybe(parameters.url)) {
      this.url = parameters.url;
    } else if (typeof parameters.url === "string") {
      this.url = purify.Maybe.of(parameters.url);
    } else if (typeof parameters.url === "undefined") {
      this.url = purify.Maybe.empty();
    } else {
      this.url = parameters.url; // never
    }
  }

  equals(
    other: MachineLearningModelFamily,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      description: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
      manufacturer: purifyHelpers.Equatable.equals,
      name: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
      url: purifyHelpers.Equatable.booleanEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return MachineLearningModelFamily.hash(this, hasher);
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
          "http://purl.annotize.ai/ontology/mlm#MachineLearningModelFamily",
        ),
      );
    }

    resource.add(
      dataFactory.namedNode("https://schema.org/description"),
      this.description,
    );
    resource.add(
      dataFactory.namedNode("https://schema.org/manufacturer"),
      this.manufacturer.toRdf({
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(dataFactory.namedNode("https://schema.org/name"), this.name);
    resource.add(dataFactory.namedNode("https://schema.org/url"), this.url);
    return resource;
  }
}

export namespace MachineLearningModelFamily {
  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    MachineLearningModelFamily
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

    const _descriptionEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<rdfjs.Literal>
    > = purify.Either.of(
      resource
        .values(dataFactory.namedNode("https://schema.org/description"), {
          unique: true,
        })
        .head()
        .chain((value) => value.toLiteral())
        .toMaybe(),
    );
    if (_descriptionEither.isLeft()) {
      return _descriptionEither;
    }

    const description = _descriptionEither.unsafeCoerce();
    const identifier = resource.identifier;
    const _manufacturerEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      Organization
    > = resource
      .values(dataFactory.namedNode("https://schema.org/manufacturer"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toNamedResource())
      .chain((resource) => Organization.fromRdf(resource));
    if (_manufacturerEither.isLeft()) {
      return _manufacturerEither;
    }

    const manufacturer = _manufacturerEither.unsafeCoerce();
    const _nameEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      rdfjs.Literal
    > = resource
      .values(dataFactory.namedNode("https://schema.org/name"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toLiteral());
    if (_nameEither.isLeft()) {
      return _nameEither;
    }

    const name = _nameEither.unsafeCoerce();
    const _urlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<string>
    > = purify.Either.of(
      resource
        .values(dataFactory.namedNode("https://schema.org/url"), {
          unique: true,
        })
        .head()
        .chain((value) => value.toString())
        .toMaybe(),
    );
    if (_urlEither.isLeft()) {
      return _urlEither;
    }

    const url = _urlEither.unsafeCoerce();
    return purify.Either.of(
      new MachineLearningModelFamily({
        description,
        identifier,
        manufacturer,
        name,
        url,
      }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    machineLearningModelFamily: Omit<
      MachineLearningModelFamily,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    hasher: HasherT,
  ): HasherT {
    machineLearningModelFamily.description.ifJust((value) => {
      hasher.update(value.value);
    });
    Organization.hash(machineLearningModelFamily.manufacturer, hasher);
    hasher.update(machineLearningModelFamily.name.value);
    machineLearningModelFamily.url.ifJust((value) => {
      hasher.update(value);
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
            (object) => new Organization.SparqlGraphPatterns(object),
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
}

export class Organization {
  readonly identifier: rdfjs.NamedNode;
  readonly name: rdfjs.Literal;
  readonly type = "Organization" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.NamedNode;
    readonly name: Date | boolean | number | rdfjs.Literal | string;
  }) {
    this.identifier = parameters.identifier;
    if (typeof parameters.name === "boolean") {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (
      typeof parameters.name === "object" &&
      parameters.name instanceof Date
    ) {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (typeof parameters.name === "number") {
      this.name = rdfLiteral.toRdf(parameters.name);
    } else if (typeof parameters.name === "string") {
      this.name = dataFactory.literal(parameters.name);
    } else if (typeof parameters.name === "object") {
      this.name = parameters.name;
    } else {
      this.name = parameters.name; // never
    }
  }

  equals(other: Organization): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      name: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Organization.hash(this, hasher);
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
          "http://purl.annotize.ai/ontology/mlm#Organization",
        ),
      );
    }

    resource.add(dataFactory.namedNode("https://schema.org/name"), this.name);
    return resource;
  }
}

export namespace Organization {
  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Organization> {
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
      .values(dataFactory.namedNode("https://schema.org/name"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toLiteral());
    if (_nameEither.isLeft()) {
      return _nameEither;
    }

    const name = _nameEither.unsafeCoerce();
    return purify.Either.of(new Organization({ identifier, name }));
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    organization: Omit<
      Organization,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    hasher: HasherT,
  ): HasherT {
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
}
