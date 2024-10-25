import type * as rdfjs from "@rdfjs/types";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

export namespace MachineLearningModel {
  export interface Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily.Interface;
    readonly localIdentifier: string;
    readonly name: rdfjs.Literal;
    readonly trainingDataCutoff: purify.Maybe<string>;
    readonly url: purify.Maybe<string>;
  }

  export class Class implements MachineLearningModel.Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly isVariantOf: MachineLearningModelFamily.Interface;
    readonly localIdentifier: string;
    readonly name: rdfjs.Literal;
    readonly trainingDataCutoff: purify.Maybe<string>;
    readonly url: purify.Maybe<string>;

    constructor(parameters: MachineLearningModel.Class.Parameters) {
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

    equals(
      other: MachineLearningModel.Interface,
    ): purifyHelpers.Equatable.EqualsResult {
      return MachineLearningModel.equals(this, other);
    }

    static fromRdf(kwds: {
      dataFactory: rdfjs.DataFactory;
      resource: rdfjsResource.Resource<rdfjs.NamedNode>;
    }): purify.Either<
      rdfjsResource.Resource.ValueError,
      MachineLearningModel.Class
    > {
      return MachineLearningModel.fromRdf(kwds).map(
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
    export interface Parameters {
      readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
      readonly identifier: rdfjs.NamedNode;
      readonly isVariantOf: MachineLearningModelFamily.Interface;
      readonly localIdentifier: string;
      readonly name: rdfjs.Literal;
      readonly trainingDataCutoff?: purify.Maybe<string> | string;
      readonly url?: purify.Maybe<string> | string;
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
      url: (left, right) => left.equals(right),
    });
  }

  export function fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    MachineLearningModel.Interface
  > {
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
    return purify.Either.of({
      description,
      identifier,
      isVariantOf,
      localIdentifier,
      name,
      trainingDataCutoff,
      url,
    });
  }

  export function toRdf(
    machineLearningModel: MachineLearningModel.Interface,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: machineLearningModel.identifier,
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
    machineLearningModel.description.ifJust((descriptionValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/description"),
        descriptionValue,
      );
    });
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/isVariantOf"),
      MachineLearningModelFamily.toRdf(machineLearningModel.isVariantOf, {
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/identifier"),
      machineLearningModel.localIdentifier,
    );
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/name"),
      machineLearningModel.name,
    );
    machineLearningModel.trainingDataCutoff.ifJust(
      (trainingDataCutoffValue) => {
        resource.add(
          resourceSet.dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#trainingDataCutoff",
          ),
          trainingDataCutoffValue,
        );
      },
    );
    machineLearningModel.url.ifJust((urlValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/url"),
        urlValue,
      );
    });
    return resource;
  }
}

export namespace LanguageModel {
  export interface Interface extends MachineLearningModel.Interface {
    readonly contextWindow: number;
    readonly maxTokenOutput: purify.Maybe<number>;
  }

  export class Class
    extends MachineLearningModel.Class
    implements LanguageModel.Interface
  {
    readonly contextWindow: number;
    readonly maxTokenOutput: purify.Maybe<number>;

    constructor(parameters: LanguageModel.Class.Parameters) {
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

    static override fromRdf(kwds: {
      dataFactory: rdfjs.DataFactory;
      resource: rdfjsResource.Resource<rdfjs.NamedNode>;
    }): purify.Either<rdfjsResource.Resource.ValueError, LanguageModel.Class> {
      return LanguageModel.fromRdf(kwds).map(
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
    export interface Parameters extends MachineLearningModel.Class.Parameters {
      readonly contextWindow: number;
      readonly maxTokenOutput?: purify.Maybe<number> | number;
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
      }),
    );
  }

  export function fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    LanguageModel.Interface
  > {
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
        return purify.Either.of({
          contextWindow,
          description: _super.description,
          identifier: _super.identifier,
          isVariantOf: _super.isVariantOf,
          localIdentifier: _super.localIdentifier,
          maxTokenOutput,
          name: _super.name,
          trainingDataCutoff: _super.trainingDataCutoff,
          url: _super.url,
        });
      },
    );
  }

  export function toRdf(
    languageModel: LanguageModel.Interface,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = MachineLearningModel.toRdf(languageModel, {
      mutateGraph,
      resourceSet,
    });
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
      languageModel.contextWindow,
    );
    languageModel.maxTokenOutput.ifJust((maxTokenOutputValue) => {
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

export namespace MachineLearningModelFamily {
  export interface Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization.Interface;
    readonly name: rdfjs.Literal;
    readonly url: purify.Maybe<string>;
  }

  export class Class implements MachineLearningModelFamily.Interface {
    readonly description: purify.Maybe<rdfjs.Literal>;
    readonly identifier: rdfjs.NamedNode;
    readonly manufacturer: Organization.Interface;
    readonly name: rdfjs.Literal;
    readonly url: purify.Maybe<string>;

    constructor(parameters: MachineLearningModelFamily.Class.Parameters) {
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
      other: MachineLearningModelFamily.Interface,
    ): purifyHelpers.Equatable.EqualsResult {
      return MachineLearningModelFamily.equals(this, other);
    }

    static fromRdf(kwds: {
      dataFactory: rdfjs.DataFactory;
      resource: rdfjsResource.Resource<rdfjs.NamedNode>;
    }): purify.Either<
      rdfjsResource.Resource.ValueError,
      MachineLearningModelFamily.Class
    > {
      return MachineLearningModelFamily.fromRdf(kwds).map(
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
    export interface Parameters {
      readonly description?: purify.Maybe<rdfjs.Literal> | rdfjs.Literal;
      readonly identifier: rdfjs.NamedNode;
      readonly manufacturer: Organization.Interface;
      readonly name: rdfjs.Literal;
      readonly url?: purify.Maybe<string> | string;
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
      url: (left, right) => left.equals(right),
    });
  }

  export function fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<
    rdfjsResource.Resource.ValueError,
    MachineLearningModelFamily.Interface
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
    return purify.Either.of({
      description,
      identifier,
      manufacturer,
      name,
      url,
    });
  }

  export function toRdf(
    machineLearningModelFamily: MachineLearningModelFamily.Interface,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: machineLearningModelFamily.identifier,
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
    machineLearningModelFamily.description.ifJust((descriptionValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/description"),
        descriptionValue,
      );
    });
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/manufacturer"),
      Organization.toRdf(machineLearningModelFamily.manufacturer, {
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    resource.add(
      resourceSet.dataFactory.namedNode("https://schema.org/name"),
      machineLearningModelFamily.name,
    );
    machineLearningModelFamily.url.ifJust((urlValue) => {
      resource.add(
        resourceSet.dataFactory.namedNode("https://schema.org/url"),
        urlValue,
      );
    });
    return resource;
  }
}

export namespace Organization {
  export interface Interface {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;
  }

  export class Class implements Organization.Interface {
    readonly identifier: rdfjs.NamedNode;
    readonly name: rdfjs.Literal;

    constructor(parameters: Organization.Class.Parameters) {
      this.identifier = parameters.identifier;
      this.name = parameters.name;
    }

    equals(
      other: Organization.Interface,
    ): purifyHelpers.Equatable.EqualsResult {
      return Organization.equals(this, other);
    }

    static fromRdf(kwds: {
      dataFactory: rdfjs.DataFactory;
      resource: rdfjsResource.Resource<rdfjs.NamedNode>;
    }): purify.Either<rdfjsResource.Resource.ValueError, Organization.Class> {
      return Organization.fromRdf(kwds).map(
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
    export interface Parameters {
      readonly identifier: rdfjs.NamedNode;
      readonly name: rdfjs.Literal;
    }
  }

  export function equals(
    left: Organization.Interface,
    right: Organization.Interface,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      name: purifyHelpers.Equatable.booleanEquals,
    });
  }

  export function fromRdf({
    dataFactory,
    resource,
  }: {
    dataFactory: rdfjs.DataFactory;
    resource: rdfjsResource.Resource<rdfjs.NamedNode>;
  }): purify.Either<rdfjsResource.Resource.ValueError, Organization.Interface> {
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
    return purify.Either.of({ identifier, name });
  }

  export function toRdf(
    organization: Organization.Interface,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const resource = resourceSet.mutableNamedResource({
      identifier: organization.identifier,
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
      organization.name,
    );
    return resource;
  }
}
