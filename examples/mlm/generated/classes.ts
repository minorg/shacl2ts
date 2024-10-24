import type * as rdfjs from "@rdfjs/types";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

export class MachineLearningModel {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly isVariantOf: MachineLearningModelFamily;
  readonly localIdentifier: string;
  readonly name: rdfjs.Literal;
  readonly trainingDataCutoff: purify.Maybe<string>;
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModel.Parameters) {
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
      trainingDataCutoff: (left, right) => left.equals(right),
      url: (left, right) => left.equals(right),
    });
  }

  static fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<rdfjsResource.Resource.ValueError, MachineLearningModel> {
    if (
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
        value.toNamedResource().chain((resource) =>
          MachineLearningModelFamily.fromRdf({
            dataFactory: dataFactory,
            resource,
          }),
        ),
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
    const url = resource
      .value(dataFactory.namedNode("https://schema.org/url"))
      .chain((value) => value.toString())
      .toMaybe();
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

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    resource.add(
      resource.dataFactory.namedNode(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      ),
      resource.dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#MachineLearningModel",
      ),
    );
    this.description.ifJust((descriptionValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/description"),
        descriptionValue,
      );
    });
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/isVariantOf"),
      this.isVariantOf.toRdf({
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/identifier"),
      this.localIdentifier,
    );
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/name"),
      this.name,
    );
    this.trainingDataCutoff.ifJust((trainingDataCutoffValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
        ),
        trainingDataCutoffValue,
      );
    });
    this.url.ifJust((urlValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/url"),
        urlValue,
      );
    });
    return resource;
  }
}

export namespace MachineLearningModel {
  export interface Parameters {
    readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily;
    readonly localIdentifier: string;
    readonly name: rdfjs.Literal;
    readonly trainingDataCutoff?: purify.Maybe<string> | string;
    readonly url?: purify.Maybe<string> | string;
  }
}

export class LanguageModel extends MachineLearningModel {
  readonly contextWindow: number;
  readonly maxTokenOutput: purify.Maybe<number>;

  constructor(parameters: LanguageModel.Parameters) {
    super(parameters);
    this.contextWindow = parameters.contextWindow;
    this.maxTokenOutput = purify.Maybe.isMaybe(parameters.maxTokenOutput)
      ? parameters.maxTokenOutput
      : purify.Maybe.fromNullable(parameters.maxTokenOutput);
  }

  override equals(other: LanguageModel): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        contextWindow: purifyHelpers.Equatable.strictEquals,
        maxTokenOutput: (left, right) => left.equals(right),
      }),
    );
  }

  static override fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<rdfjsResource.Resource.ValueError, LanguageModel> {
    return MachineLearningModel.fromRdf({ dataFactory, resource }).chain(
      (_super) => {
        if (
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
        return purify.Either.of(
          new LanguageModel({
            contextWindow,
            description: _super.description,
            identifier: _super.identifier,
            isVariantOf: _super.isVariantOf,
            localIdentifier: _super.localIdentifier,
            maxTokenOutput,
            name: _super.name,
            trainingDataCutoff: _super.trainingDataCutoff,
            url: _super.url,
          }),
        );
      },
    );
  }

  override toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = super.toRdf({ mutateGraph, resourceSet });
    resource.add(
      resource.dataFactory.namedNode(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      ),
      resource.dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#LanguageModel",
      ),
    );
    resource.add(
      resourceSet.dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#contextWindow",
      ),
      this.contextWindow,
    );
    this.maxTokenOutput.ifJust((maxTokenOutputValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode(
          "http://purl.annotize.ai/ontology/mlm#maxTokenOutput",
        ),
        maxTokenOutputValue,
      );
    });
    return resource;
  }
}

export namespace LanguageModel {
  export interface Parameters extends MachineLearningModel.Parameters {
    readonly contextWindow: number;
    readonly maxTokenOutput?: purify.Maybe<number> | number;
  }
}

export class MachineLearningModelFamily {
  readonly description: purify.Maybe<rdfjs.Literal>;
  readonly identifier: rdfjs.NamedNode;
  readonly manufacturer: Organization;
  readonly name: rdfjs.Literal;
  readonly url: purify.Maybe<string>;

  constructor(parameters: MachineLearningModelFamily.Parameters) {
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
      url: (left, right) => left.equals(right),
    });
  }

  static fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    MachineLearningModelFamily
  > {
    if (
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
          .chain((resource) =>
            Organization.fromRdf({ dataFactory: dataFactory, resource }),
          ),
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
    const url = resource
      .value(dataFactory.namedNode("https://schema.org/url"))
      .chain((value) => value.toString())
      .toMaybe();
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

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    resource.add(
      resource.dataFactory.namedNode(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      ),
      resource.dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#MachineLearningModelFamily",
      ),
    );
    this.description.ifJust((descriptionValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/description"),
        descriptionValue,
      );
    });
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/manufacturer"),
      this.manufacturer.toRdf({
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/name"),
      this.name,
    );
    this.url.ifJust((urlValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/url"),
        urlValue,
      );
    });
    return resource;
  }
}

export namespace MachineLearningModelFamily {
  export interface Parameters {
    readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization;
    readonly name: rdfjs.Literal;
    readonly url?: purify.Maybe<string> | string;
  }
}

export class Organization {
  readonly identifier: rdfjs.NamedNode;
  readonly name: rdfjs.Literal;

  constructor(parameters: Organization.Parameters) {
    this.identifier = parameters.identifier;
    this.name = parameters.name;
  }

  equals(other: Organization): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      name: purifyHelpers.Equatable.booleanEquals,
    });
  }

  static fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<rdfjsResource.Resource.ValueError, Organization> {
    if (
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
    return purify.Either.of(new Organization({ identifier, name }));
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    resource.add(
      resource.dataFactory.namedNode(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      ),
      resource.dataFactory.namedNode(
        "http://purl.annotize.ai/ontology/mlm#Organization",
      ),
    );
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/name"),
      this.name,
    );
    return resource;
  }
}

export namespace Organization {
  export interface Parameters {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;
  }
}
