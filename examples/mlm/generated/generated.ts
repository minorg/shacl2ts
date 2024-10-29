import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
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
  export class Class implements MachineLearningModel {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily;
    readonly localIdentifier: string;
    readonly name: rdfjs.Literal;
    readonly trainingDataCutoff: purify.Maybe<string>;
    readonly type: "LanguageModel" | "MachineLearningModel" =
      "MachineLearningModel";
    readonly url: purify.Maybe<string>;

    constructor(parameters: MachineLearningModel.Class.ConstructorParameters) {
      this.description = purify.Maybe.isMaybe(parameters.description)
        ? parameters.description
        : purify.Maybe.fromNullable(parameters.description);
      this.identifier = parameters.identifier;
      this.isVariantOf = parameters.isVariantOf;
      this.localIdentifier = parameters.localIdentifier;
      this.name = parameters.name;
      this.trainingDataCutoff = purify.Maybe.isMaybe(
        parameters.trainingDataCutoff,
      )
        ? parameters.trainingDataCutoff
        : purify.Maybe.fromNullable(parameters.trainingDataCutoff);
      this.url = purify.Maybe.isMaybe(parameters.url)
        ? parameters.url
        : purify.Maybe.fromNullable(parameters.url);
    }

    equals(other: MachineLearningModel): purifyHelpers.Equatable.EqualsResult {
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

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return MachineLearningModel.toRdf(this, kwds);
    }
  }

  export namespace Class {
    export interface ConstructorParameters {
      readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
      readonly identifier: rdfjs.NamedNode;
      readonly isVariantOf: MachineLearningModelFamily;
      readonly localIdentifier: string;
      readonly name: rdfjs.Literal;
      readonly trainingDataCutoff?: purify.Maybe<string> | string;
      readonly url?: purify.Maybe<string> | string;
    }
  }

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
      trainingDataCutoff: (left, right) => left.equals(right),
      type: purifyHelpers.Equatable.strictEquals,
      url: (left, right) => left.equals(right),
    });
  }

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

    const description = resource
      .value(dataFactory.namedNode("https://schema.org/description"))
      .chain((value) => value.toLiteral())
      .toMaybe();
    const identifier = resource.identifier;
    const _isVariantOfEither = resource
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
    const _localIdentifierEither = resource
      .value(dataFactory.namedNode("https://schema.org/identifier"))
      .chain((value) => value.toString());
    if (_localIdentifierEither.isLeft()) {
      return _localIdentifierEither;
    }
    const localIdentifier = _localIdentifierEither.unsafeCoerce();
    const _nameEither = resource
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
          ).chainObject((isVariantOf) => [
            ...new MachineLearningModelFamily.SparqlGraphPatterns(isVariantOf),
          ]),
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

export interface LanguageModel extends MachineLearningModel {
  readonly contextWindow: number;
  readonly maxTokenOutput: purify.Maybe<number>;
  readonly type: "LanguageModel";
}

export namespace LanguageModel {
  export class Class
    extends MachineLearningModel.Class
    implements LanguageModel
  {
    readonly contextWindow: number;
    readonly maxTokenOutput: purify.Maybe<number>;
    override readonly type = "LanguageModel" as const;

    constructor(parameters: LanguageModel.Class.ConstructorParameters) {
      super(parameters);
      this.contextWindow = parameters.contextWindow;
      this.maxTokenOutput = purify.Maybe.isMaybe(parameters.maxTokenOutput)
        ? parameters.maxTokenOutput
        : purify.Maybe.fromNullable(parameters.maxTokenOutput);
    }

    override equals(
      other: LanguageModel,
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

    override toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return LanguageModel.toRdf(this, kwds);
    }
  }

  export namespace Class {
    export interface ConstructorParameters
      extends MachineLearningModel.Class.ConstructorParameters {
      readonly contextWindow: number;
      readonly maxTokenOutput?: purify.Maybe<number> | number;
    }
  }

  export function equals(
    left: LanguageModel,
    right: LanguageModel,
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
      const _contextWindowEither = resource
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

export interface MachineLearningModelFamily {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly manufacturer: Organization;
  readonly name: rdfjs.Literal;
  readonly type: "MachineLearningModelFamily";
  readonly url: purify.Maybe<string>;
}

export namespace MachineLearningModelFamily {
  export class Class implements MachineLearningModelFamily {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization;
    readonly name: rdfjs.Literal;
    readonly type = "MachineLearningModelFamily" as const;
    readonly url: purify.Maybe<string>;

    constructor(
      parameters: MachineLearningModelFamily.Class.ConstructorParameters,
    ) {
      this.description = purify.Maybe.isMaybe(parameters.description)
        ? parameters.description
        : purify.Maybe.fromNullable(parameters.description);
      this.identifier = parameters.identifier;
      this.manufacturer = parameters.manufacturer;
      this.name = parameters.name;
      this.url = purify.Maybe.isMaybe(parameters.url)
        ? parameters.url
        : purify.Maybe.fromNullable(parameters.url);
    }

    equals(
      other: MachineLearningModelFamily,
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

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return MachineLearningModelFamily.toRdf(this, kwds);
    }
  }

  export namespace Class {
    export interface ConstructorParameters {
      readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
      readonly identifier: rdfjs.NamedNode;
      readonly manufacturer: Organization;
      readonly name: rdfjs.Literal;
      readonly url?: purify.Maybe<string> | string;
    }
  }

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
      url: (left, right) => left.equals(right),
    });
  }

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

    const description = resource
      .value(dataFactory.namedNode("https://schema.org/description"))
      .chain((value) => value.toLiteral())
      .toMaybe();
    const identifier = resource.identifier;
    const _manufacturerEither = resource
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
    const _nameEither = resource
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
          ).chainObject((manufacturer) => [
            ...new Organization.SparqlGraphPatterns(manufacturer),
          ]),
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

export interface Organization {
  readonly identifier: rdfjs.NamedNode;
  readonly name: rdfjs.Literal;
  readonly type: "Organization";
}

export namespace Organization {
  export class Class implements Organization {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;
    readonly type = "Organization" as const;

    constructor(parameters: Organization.Class.ConstructorParameters) {
      this.identifier = parameters.identifier;
      this.name = parameters.name;
    }

    equals(other: Organization): purifyHelpers.Equatable.EqualsResult {
      return Organization.equals(this, other);
    }

    static fromRdf(
      resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    ): purify.Either<rdfjsResource.Resource.ValueError, Organization.Class> {
      return Organization.fromRdf(resource).map(
        (properties) => new Organization.Class(properties),
      );
    }

    toRdf(kwds: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
      return Organization.toRdf(this, kwds);
    }
  }

  export namespace Class {
    export interface ConstructorParameters {
      readonly identifier: rdfjs.NamedNode;
      readonly name: rdfjs.Literal;
    }
  }

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
    const _nameEither = resource
      .value(dataFactory.namedNode("https://schema.org/name"))
      .chain((value) => value.toLiteral());
    if (_nameEither.isLeft()) {
      return _nameEither;
    }
    const name = _nameEither.unsafeCoerce();
    const type = "Organization" as const;
    return purify.Either.of({ identifier, name, type });
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
