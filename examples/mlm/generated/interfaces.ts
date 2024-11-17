import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
// @ts-ignore
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";

export interface MachineLearningModel {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: MachineLearningModelFamily;
  readonly localIdentifier: string;
  readonly name: rdfjs.Literal;
  readonly trainingDataCutoff: purify.Maybe<string>;
  readonly type: "LanguageModel" | "MachineLearningModel";
  readonly url: purify.Maybe<string>;
}

export namespace MachineLearningModel {
  export function equals(
    left: MachineLearningModel,
    right: MachineLearningModel,
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
      trainingDataCutoff: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
      url: purifyHelpers.Equatable.booleanEquals,
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      description: purify.Maybe<rdfjs.Literal>;
      identifier: rdfjs.NamedNode;
      isVariantOf: MachineLearningModelFamily;
      localIdentifier: string;
      name: rdfjs.Literal;
      trainingDataCutoff: purify.Maybe<string>;
      type: "LanguageModel" | "MachineLearningModel";
      url: purify.Maybe<string>;
    }
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
      .chain((value) => valuetoString());
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
        .chain((value) => valuetoString())
        .toMaybe(),
    );
    if (_trainingDataCutoffEither.isLeft()) {
      return _trainingDataCutoffEither;
    }

    const trainingDataCutoff = _trainingDataCutoffEither.unsafeCoerce();
    const type = "MachineLearningModel" as const;
    const _urlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<string>
    > = purify.Either.of(
      resource
        .values(dataFactory.namedNode("https://schema.org/url"), {
          unique: true,
        })
        .head()
        .chain((value) => valuetoString())
        .toMaybe(),
    );
    if (_urlEither.isLeft()) {
      return _urlEither;
    }

    const url = _urlEither.unsafeCoerce();
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

  export function hashMachineLearningModel<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    machineLearningModel: Omit<MachineLearningModel, "identifier" | "type">,
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

  export function toRdf(
    machineLearningModel: MachineLearningModel,
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

    resource.add(
      dataFactory.namedNode("https://schema.org/description"),
      machineLearningModel.description,
    );
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
    resource.add(
      dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
      ),
      machineLearningModel.trainingDataCutoff,
    );
    resource.add(
      dataFactory.namedNode("https://schema.org/url"),
      machineLearningModel.url,
    );
    return resource;
  }
}

export interface LanguageModel extends MachineLearningModel {
  readonly contextWindow: number;
  readonly maxTokenOutput: purify.Maybe<number>;
  readonly type: "LanguageModel";
}

export namespace LanguageModel {
  export function equals(
    left: LanguageModel,
    right: LanguageModel,
  ): purifyHelpers.Equatable.EqualsResult {
    return MachineLearningModel.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
        contextWindow: purifyHelpers.Equatable.strictEquals,
        maxTokenOutput: purifyHelpers.Equatable.booleanEquals,
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
      description: purify.Maybe<rdfjs.Literal>;
      identifier: rdfjs.NamedNode;
      isVariantOf: MachineLearningModelFamily;
      localIdentifier: string;
      name: rdfjs.Literal;
      trainingDataCutoff: purify.Maybe<string>;
      type: "LanguageModel";
      url: purify.Maybe<string>;
      contextWindow: number;
      maxTokenOutput: purify.Maybe<number>;
    }
  > {
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
      const type = "LanguageModel" as const;
      return purify.Either.of({
        description: _super.description,
        identifier: _super.identifier,
        isVariantOf: _super.isVariantOf,
        localIdentifier: _super.localIdentifier,
        name: _super.name,
        trainingDataCutoff: _super.trainingDataCutoff,
        type,
        url: _super.url,
        contextWindow,
        maxTokenOutput,
      });
    });
  }

  export function hashLanguageModel<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    languageModel: Omit<LanguageModel, "identifier" | "type">,
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

  export function toRdf(
    languageModel: LanguageModel,
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
    resource.add(
      dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#maxTokenOutput",
      ),
      languageModel.maxTokenOutput,
    );
    return resource;
  }
}

export interface MachineLearningModelFamily {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly manufacturer: Organization;
  readonly name: rdfjs.Literal;
  readonly type: "MachineLearningModelFamily";
  readonly url: purify.Maybe<string>;
}

export namespace MachineLearningModelFamily {
  export function equals(
    left: MachineLearningModelFamily,
    right: MachineLearningModelFamily,
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
      url: purifyHelpers.Equatable.booleanEquals,
    });
  }

  export function fromRdf(
    resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      description: purify.Maybe<rdfjs.Literal>;
      identifier: rdfjs.NamedNode;
      manufacturer: Organization;
      name: rdfjs.Literal;
      type: "MachineLearningModelFamily";
      url: purify.Maybe<string>;
    }
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
    const type = "MachineLearningModelFamily" as const;
    const _urlEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<string>
    > = purify.Either.of(
      resource
        .values(dataFactory.namedNode("https://schema.org/url"), {
          unique: true,
        })
        .head()
        .chain((value) => valuetoString())
        .toMaybe(),
    );
    if (_urlEither.isLeft()) {
      return _urlEither;
    }

    const url = _urlEither.unsafeCoerce();
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
      MachineLearningModelFamily,
      "identifier" | "type"
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

  export function toRdf(
    machineLearningModelFamily: MachineLearningModelFamily,
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

    resource.add(
      dataFactory.namedNode("https://schema.org/description"),
      machineLearningModelFamily.description,
    );
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
    resource.add(
      dataFactory.namedNode("https://schema.org/url"),
      machineLearningModelFamily.url,
    );
    return resource;
  }
}

export interface Organization {
  readonly identifier: rdfjs.NamedNode;
  readonly name: rdfjs.Literal;
  readonly type: "Organization";
}

export namespace Organization {
  export function equals(
    left: Organization,
    right: Organization,
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
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { identifier: rdfjs.NamedNode; name: rdfjs.Literal; type: "Organization" }
  > {
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
    const type = "Organization" as const;
    return purify.Either.of({ identifier, name, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    organization: Omit<Organization, "identifier" | "type">,
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

  export function toRdf(
    organization: Organization,
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
