import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { sha256 } from "js-sha256";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";
import * as uuid from "uuid";

abstract class AbstractBaseClassWithoutPropertiesNodeShape {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  abstract readonly type:
    | "ConcreteChildClassNodeShape"
    | "ConcreteParentClassNodeShape";

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
  }) {
    this._identifier = parameters.identifier;
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  equals(
    other: AbstractBaseClassWithoutPropertiesNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return AbstractBaseClassWithoutPropertiesNodeShape.hashAbstractBaseClassWithoutPropertiesNodeShape(
      this,
      hasher,
    );
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    return _resource;
  }
}

namespace AbstractBaseClassWithoutPropertiesNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { identifier: rdfjs.BlankNode | rdfjs.NamedNode }
  > {
    const identifier = _resource.identifier;
    return purify.Either.of({ identifier });
  }

  export function hashAbstractBaseClassWithoutPropertiesNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _abstractBaseClassWithoutPropertiesNodeShape: Omit<
      AbstractBaseClassWithoutPropertiesNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    return _hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {}
}

abstract class AbstractBaseClassWithPropertiesNodeShape extends AbstractBaseClassWithoutPropertiesNodeShape {
  readonly abcStringProperty: string;
  abstract override readonly type:
    | "ConcreteChildClassNodeShape"
    | "ConcreteParentClassNodeShape";

  constructor(
    parameters: { readonly abcStringProperty: string } & ConstructorParameters<
      typeof AbstractBaseClassWithoutPropertiesNodeShape
    >[0],
  ) {
    super(parameters);
    this.abcStringProperty = parameters.abcStringProperty;
  }

  override equals(
    other: AbstractBaseClassWithPropertiesNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        abcStringProperty: purifyHelpers.Equatable.strictEquals,
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return AbstractBaseClassWithPropertiesNodeShape.hashAbstractBaseClassWithPropertiesNodeShape(
      this,
      hasher,
    );
  }

  override toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = super.toRdf({ mutateGraph, resourceSet });
    _resource.add(
      dataFactory.namedNode("http://example.com/abcStringProperty"),
      this.abcStringProperty,
    );
    return _resource;
  }
}

namespace AbstractBaseClassWithPropertiesNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { identifier: rdfjs.BlankNode | rdfjs.NamedNode; abcStringProperty: string }
  > {
    return AbstractBaseClassWithoutPropertiesNodeShape.fromRdf(_resource).chain(
      (_super) => {
        const _abcStringPropertyEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          string
        > = _resource
          .values(
            dataFactory.namedNode("http://example.com/abcStringProperty"),
            { unique: true },
          )
          .head()
          .chain((_value) => _value.toString());
        if (_abcStringPropertyEither.isLeft()) {
          return _abcStringPropertyEither;
        }
        const abcStringProperty = _abcStringPropertyEither.unsafeCoerce();
        return purify.Either.of({
          identifier: _super.identifier,
          abcStringProperty,
        });
      },
    );
  }

  export function hashAbstractBaseClassWithPropertiesNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _abstractBaseClassWithPropertiesNodeShape: Omit<
      AbstractBaseClassWithPropertiesNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    AbstractBaseClassWithoutPropertiesNodeShape.hashAbstractBaseClassWithoutPropertiesNodeShape(
      _abstractBaseClassWithPropertiesNodeShape,
      _hasher,
    );
    _hasher.update(_abstractBaseClassWithPropertiesNodeShape.abcStringProperty);
    return _hasher;
  }

  export class SparqlGraphPatterns extends AbstractBaseClassWithoutPropertiesNodeShape.SparqlGraphPatterns {
    constructor(subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter) {
      super(subject);
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/abcStringProperty"),
          this.variable("AbcStringProperty"),
        ),
      );
    }
  }
}

export class ConcreteParentClassNodeShape extends AbstractBaseClassWithPropertiesNodeShape {
  readonly parentStringProperty: string;
  override readonly type:
    | "ConcreteChildClassNodeShape"
    | "ConcreteParentClassNodeShape" = "ConcreteParentClassNodeShape";

  constructor(
    parameters: {
      readonly parentStringProperty: string;
    } & ConstructorParameters<
      typeof AbstractBaseClassWithPropertiesNodeShape
    >[0],
  ) {
    super(parameters);
    this.parentStringProperty = parameters.parentStringProperty;
  }

  override equals(
    other: ConcreteParentClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        parentStringProperty: purifyHelpers.Equatable.strictEquals,
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return ConcreteParentClassNodeShape.hashConcreteParentClassNodeShape(
      this,
      hasher,
    );
  }

  override toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = super.toRdf({ mutateGraph, resourceSet });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://example.com/ConcreteParentClassNodeShape",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://example.com/parentStringProperty"),
      this.parentStringProperty,
    );
    return _resource;
  }
}

export namespace ConcreteParentClassNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    ConcreteParentClassNodeShape
  > {
    return AbstractBaseClassWithPropertiesNodeShape.fromRdf(_resource).chain(
      (_super) => {
        if (
          !_options?.ignoreRdfType &&
          !_resource.isInstanceOf(
            dataFactory.namedNode(
              "http://example.com/ConcreteParentClassNodeShape",
            ),
          )
        ) {
          return purify.Left(
            new rdfjsResource.Resource.ValueError({
              focusResource: _resource,
              message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
              predicate: dataFactory.namedNode(
                "http://example.com/ConcreteParentClassNodeShape",
              ),
            }),
          );
        }
        const _parentStringPropertyEither: purify.Either<
          rdfjsResource.Resource.ValueError,
          string
        > = _resource
          .values(
            dataFactory.namedNode("http://example.com/parentStringProperty"),
            { unique: true },
          )
          .head()
          .chain((_value) => _value.toString());
        if (_parentStringPropertyEither.isLeft()) {
          return _parentStringPropertyEither;
        }
        const parentStringProperty = _parentStringPropertyEither.unsafeCoerce();
        return purify.Either.of(
          new ConcreteParentClassNodeShape({
            abcStringProperty: _super.abcStringProperty,
            identifier: _super.identifier,
            parentStringProperty,
          }),
        );
      },
    );
  }

  export function hashConcreteParentClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _concreteParentClassNodeShape: Omit<
      ConcreteParentClassNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    AbstractBaseClassWithPropertiesNodeShape.hashAbstractBaseClassWithPropertiesNodeShape(
      _concreteParentClassNodeShape,
      _hasher,
    );
    _hasher.update(_concreteParentClassNodeShape.parentStringProperty);
    return _hasher;
  }

  export class SparqlGraphPatterns extends AbstractBaseClassWithPropertiesNodeShape.SparqlGraphPatterns {
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
              "http://example.com/ConcreteParentClassNodeShape",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/parentStringProperty"),
          this.variable("ParentStringProperty"),
        ),
      );
    }
  }
}

export class ConcreteChildClassNodeShape extends ConcreteParentClassNodeShape {
  readonly childStringProperty: string;
  override readonly type = "ConcreteChildClassNodeShape" as const;

  constructor(
    parameters: {
      readonly childStringProperty: string;
    } & ConstructorParameters<typeof ConcreteParentClassNodeShape>[0],
  ) {
    super(parameters);
    this.childStringProperty = parameters.childStringProperty;
  }

  override equals(
    other: ConcreteChildClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        childStringProperty: purifyHelpers.Equatable.strictEquals,
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return ConcreteChildClassNodeShape.hashConcreteChildClassNodeShape(
      this,
      hasher,
    );
  }

  override toRdf({
    ignoreRdfType,
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
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
          "http://example.com/ConcreteChildClassNodeShape",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://example.com/childStringProperty"),
      this.childStringProperty,
    );
    return _resource;
  }
}

export namespace ConcreteChildClassNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    ConcreteChildClassNodeShape
  > {
    return ConcreteParentClassNodeShape.fromRdf(_resource, {
      ignoreRdfType: true,
    }).chain((_super) => {
      if (
        !_options?.ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode(
            "http://example.com/ConcreteChildClassNodeShape",
          ),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://example.com/ConcreteChildClassNodeShape",
            ),
          }),
        );
      }
      const _childStringPropertyEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        string
      > = _resource
        .values(
          dataFactory.namedNode("http://example.com/childStringProperty"),
          { unique: true },
        )
        .head()
        .chain((_value) => _value.toString());
      if (_childStringPropertyEither.isLeft()) {
        return _childStringPropertyEither;
      }
      const childStringProperty = _childStringPropertyEither.unsafeCoerce();
      return purify.Either.of(
        new ConcreteChildClassNodeShape({
          parentStringProperty: _super.parentStringProperty,
          abcStringProperty: _super.abcStringProperty,
          identifier: _super.identifier,
          childStringProperty,
        }),
      );
    });
  }

  export function hashConcreteChildClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _concreteChildClassNodeShape: Omit<
      ConcreteChildClassNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    ConcreteParentClassNodeShape.hashConcreteParentClassNodeShape(
      _concreteChildClassNodeShape,
      _hasher,
    );
    _hasher.update(_concreteChildClassNodeShape.childStringProperty);
    return _hasher;
  }

  export class SparqlGraphPatterns extends ConcreteParentClassNodeShape.SparqlGraphPatterns {
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
              "http://example.com/ConcreteChildClassNodeShape",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/childStringProperty"),
          this.variable("ChildStringProperty"),
        ),
      );
    }
  }
}

export class ExterningAndInliningNodeShape {
  readonly externProperty: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly inlineProperty: InlineNodeShape;
  readonly type = "ExterningAndInliningNodeShape" as const;

  constructor(parameters: {
    readonly externProperty: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly inlineProperty: InlineNodeShape;
  }) {
    this.externProperty = parameters.externProperty;
    this.identifier = parameters.identifier;
    this.inlineProperty = parameters.inlineProperty;
  }

  equals(
    other: ExterningAndInliningNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      externProperty: purifyHelpers.Equatable.booleanEquals,
      identifier: purifyHelpers.Equatable.booleanEquals,
      inlineProperty: purifyHelpers.Equatable.equals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return ExterningAndInliningNodeShape.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/externProperty"),
      this.externProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inlineProperty"),
      this.inlineProperty.toRdf({
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    return _resource;
  }
}

export namespace ExterningAndInliningNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    ExterningAndInliningNodeShape
  > {
    const _externPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      rdfjs.BlankNode | rdfjs.NamedNode
    > = _resource
      .values(dataFactory.namedNode("http://example.com/externProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toIdentifier());
    if (_externPropertyEither.isLeft()) {
      return _externPropertyEither;
    }

    const externProperty = _externPropertyEither.unsafeCoerce();
    const identifier = _resource.identifier;
    const _inlinePropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      InlineNodeShape
    > = _resource
      .values(dataFactory.namedNode("http://example.com/inlineProperty"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toResource())
      .chain((_resource) => InlineNodeShape.fromRdf(_resource));
    if (_inlinePropertyEither.isLeft()) {
      return _inlinePropertyEither;
    }

    const inlineProperty = _inlinePropertyEither.unsafeCoerce();
    return purify.Either.of(
      new ExterningAndInliningNodeShape({
        externProperty,
        identifier,
        inlineProperty,
      }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _externingAndInliningNodeShape: Omit<
      ExterningAndInliningNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(
      rdfjsResource.Resource.Identifier.toString(
        _externingAndInliningNodeShape.externProperty,
      ),
    );
    InlineNodeShape.hash(
      _externingAndInliningNodeShape.inlineProperty,
      _hasher,
    );
    return _hasher;
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
          dataFactory.namedNode("http://example.com/externProperty"),
          this.variable("ExternProperty"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.group(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/inlineProperty"),
            this.variable("InlineProperty"),
          ).chainObject(
            (_object) => new InlineNodeShape.SparqlGraphPatterns(_object),
          ),
        ),
      );
    }
  }
}

export class ExternNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type = "ExternNodeShape" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this.identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  equals(other: ExternNodeShape): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return ExternNodeShape.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty,
    );
    return _resource;
  }
}

export namespace ExternNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, ExternNodeShape> {
    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new ExternNodeShape({ identifier, stringProperty }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _externNodeShape: Omit<
      ExternNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_externNodeShape.stringProperty);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty"),
          this.variable("StringProperty"),
        ),
      );
    }
  }
}

export class InlineNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type = "InlineNodeShape" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this.identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  equals(other: InlineNodeShape): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return InlineNodeShape.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty,
    );
    return _resource;
  }
}

export namespace InlineNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, InlineNodeShape> {
    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new InlineNodeShape({ identifier, stringProperty }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _inlineNodeShape: Omit<
      InlineNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_inlineNodeShape.stringProperty);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty"),
          this.variable("StringProperty"),
        ),
      );
    }
  }
}

export class IriNodeShape {
  readonly identifier: rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type = "IriNodeShape" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this.identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  equals(other: IriNodeShape): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return IriNodeShape.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty,
    );
    return _resource;
  }
}

export namespace IriNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, IriNodeShape> {
    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of(new IriNodeShape({ identifier, stringProperty }));
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _iriNodeShape: Omit<
      IriNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_iriNodeShape.stringProperty);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty"),
          this.variable("StringProperty"),
        ),
      );
    }
  }
}

export class NonClassNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type = "NonClassNodeShape" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this.identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  equals(other: NonClassNodeShape): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return NonClassNodeShape.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty,
    );
    return _resource;
  }
}

export namespace NonClassNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, NonClassNodeShape> {
    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new NonClassNodeShape({ identifier, stringProperty }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nonClassNodeShape: Omit<
      NonClassNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_nonClassNodeShape.stringProperty);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty"),
          this.variable("StringProperty"),
        ),
      );
    }
  }
}

export class NodeShapeWithDefaultValueProperties {
  readonly falseBooleanProperty: boolean;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly numberProperty: number;
  readonly stringProperty: string;
  readonly trueBooleanProperty: boolean;
  readonly type = "NodeShapeWithDefaultValueProperties" as const;

  constructor(parameters: {
    readonly falseBooleanProperty?: boolean;
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly numberProperty?: number;
    readonly stringProperty?: string;
    readonly trueBooleanProperty?: boolean;
  }) {
    if (typeof parameters.falseBooleanProperty === "boolean") {
      this.falseBooleanProperty = parameters.falseBooleanProperty;
    } else if (typeof parameters.falseBooleanProperty === "undefined") {
      this.falseBooleanProperty = false;
    } else {
      this.falseBooleanProperty = parameters.falseBooleanProperty; // never
    }

    this.identifier = parameters.identifier;
    if (typeof parameters.numberProperty === "number") {
      this.numberProperty = parameters.numberProperty;
    } else if (typeof parameters.numberProperty === "undefined") {
      this.numberProperty = 0;
    } else {
      this.numberProperty = parameters.numberProperty; // never
    }

    if (typeof parameters.stringProperty === "string") {
      this.stringProperty = parameters.stringProperty;
    } else if (typeof parameters.stringProperty === "undefined") {
      this.stringProperty = "";
    } else {
      this.stringProperty = parameters.stringProperty; // never
    }

    if (typeof parameters.trueBooleanProperty === "boolean") {
      this.trueBooleanProperty = parameters.trueBooleanProperty;
    } else if (typeof parameters.trueBooleanProperty === "undefined") {
      this.trueBooleanProperty = true;
    } else {
      this.trueBooleanProperty = parameters.trueBooleanProperty; // never
    }
  }

  equals(
    other: NodeShapeWithDefaultValueProperties,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      falseBooleanProperty: purifyHelpers.Equatable.strictEquals,
      identifier: purifyHelpers.Equatable.booleanEquals,
      numberProperty: purifyHelpers.Equatable.strictEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      trueBooleanProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return NodeShapeWithDefaultValueProperties.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/falseBooleanProperty"),
      this.falseBooleanProperty ? true : undefined,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/numberProperty"),
      this.numberProperty !== 0 ? this.numberProperty : undefined,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty !== "" ? this.stringProperty : undefined,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/trueBooleanProperty"),
      !this.trueBooleanProperty ? false : undefined,
    );
    return _resource;
  }
}

export namespace NodeShapeWithDefaultValueProperties {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    NodeShapeWithDefaultValueProperties
  > {
    const _falseBooleanPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      boolean
    > = _resource
      .values(
        dataFactory.namedNode("http://example.com/falseBooleanProperty"),
        { unique: true },
      )
      .head()
      .alt(
        purify.Either.of(
          new rdfjsResource.Resource.Value({
            subject: _resource,
            predicate: dataFactory.namedNode(
              "http://example.com/falseBooleanProperty",
            ),
            object: dataFactory.literal(
              "false",
              dataFactory.namedNode("http://www.w3.org/2001/XMLSchema#boolean"),
            ),
          }),
        ),
      )
      .chain((_value) => _value.toBoolean());
    if (_falseBooleanPropertyEither.isLeft()) {
      return _falseBooleanPropertyEither;
    }

    const falseBooleanProperty = _falseBooleanPropertyEither.unsafeCoerce();
    const identifier = _resource.identifier;
    const _numberPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      number
    > = _resource
      .values(dataFactory.namedNode("http://example.com/numberProperty"), {
        unique: true,
      })
      .head()
      .alt(
        purify.Either.of(
          new rdfjsResource.Resource.Value({
            subject: _resource,
            predicate: dataFactory.namedNode(
              "http://example.com/numberProperty",
            ),
            object: dataFactory.literal(
              "0",
              dataFactory.namedNode("http://www.w3.org/2001/XMLSchema#integer"),
            ),
          }),
        ),
      )
      .chain((_value) => _value.toNumber());
    if (_numberPropertyEither.isLeft()) {
      return _numberPropertyEither;
    }

    const numberProperty = _numberPropertyEither.unsafeCoerce();
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty"), {
        unique: true,
      })
      .head()
      .alt(
        purify.Either.of(
          new rdfjsResource.Resource.Value({
            subject: _resource,
            predicate: dataFactory.namedNode(
              "http://example.com/stringProperty",
            ),
            object: dataFactory.literal("", ""),
          }),
        ),
      )
      .chain((_value) => _value.toString());
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    const _trueBooleanPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      boolean
    > = _resource
      .values(dataFactory.namedNode("http://example.com/trueBooleanProperty"), {
        unique: true,
      })
      .head()
      .alt(
        purify.Either.of(
          new rdfjsResource.Resource.Value({
            subject: _resource,
            predicate: dataFactory.namedNode(
              "http://example.com/trueBooleanProperty",
            ),
            object: dataFactory.literal(
              "true",
              dataFactory.namedNode("http://www.w3.org/2001/XMLSchema#boolean"),
            ),
          }),
        ),
      )
      .chain((_value) => _value.toBoolean());
    if (_trueBooleanPropertyEither.isLeft()) {
      return _trueBooleanPropertyEither;
    }

    const trueBooleanProperty = _trueBooleanPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new NodeShapeWithDefaultValueProperties({
        falseBooleanProperty,
        identifier,
        numberProperty,
        stringProperty,
        trueBooleanProperty,
      }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithDefaultValueProperties: Omit<
      NodeShapeWithDefaultValueProperties,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(
      _nodeShapeWithDefaultValueProperties.falseBooleanProperty.toString(),
    );
    _hasher.update(
      _nodeShapeWithDefaultValueProperties.numberProperty.toString(),
    );
    _hasher.update(_nodeShapeWithDefaultValueProperties.stringProperty);
    _hasher.update(
      _nodeShapeWithDefaultValueProperties.trueBooleanProperty.toString(),
    );
    return _hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/falseBooleanProperty"),
            this.variable("FalseBooleanProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/numberProperty"),
            this.variable("NumberProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/stringProperty"),
            this.variable("StringProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/trueBooleanProperty"),
            this.variable("TrueBooleanProperty"),
          ),
        ),
      );
    }
  }
}

export class NodeShapeWithListProperty {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly listProperty: readonly string[];
  readonly type = "NodeShapeWithListProperty" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly listProperty: readonly string[];
  }) {
    this.identifier = parameters.identifier;
    this.listProperty = parameters.listProperty;
  }

  equals(
    other: NodeShapeWithListProperty,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      listProperty: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.strictEquals,
        ),
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return NodeShapeWithListProperty.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/listProperty"),
      this.listProperty.reduce(
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
            dataFactory.namedNode("http://example.com/ListShape"),
          );

          currentSubListResource.add(
            dataFactory.namedNode(
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
            ),
            item,
          );

          if (itemIndex + 1 === this.listProperty.length) {
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

export namespace NodeShapeWithListProperty {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    NodeShapeWithListProperty
  > {
    const identifier = _resource.identifier;
    const _listPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly string[]
    > = _resource
      .values(dataFactory.namedNode("http://example.com/listProperty"), {
        unique: true,
      })
      .head()
      .chain((value) => value.toList())
      .map((values) =>
        values.flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toString())
            .toMaybe()
            .toList(),
        ),
      );
    if (_listPropertyEither.isLeft()) {
      return _listPropertyEither;
    }

    const listProperty = _listPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new NodeShapeWithListProperty({ identifier, listProperty }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithListProperty: Omit<
      NodeShapeWithListProperty,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    for (const _element of _nodeShapeWithListProperty.listProperty) {
      _hasher.update(_element);
    }

    return _hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      this.add(
        sparqlBuilder.GraphPattern.group(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/listProperty"),
            this.variable("ListProperty"),
          ).chainObject(
            (_object) =>
              new sparqlBuilder.RdfListGraphPatterns({ rdfList: _object }),
          ),
        ),
      );
    }
  }
}

export class NodeShapeWithPropertyCardinalities {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly optionalStringProperty: purify.Maybe<string>;
  readonly requiredStringProperty: string;
  readonly setStringProperty: readonly string[];
  readonly type = "NodeShapeWithPropertyCardinalities" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly optionalStringProperty?: purify.Maybe<string> | string;
    readonly requiredStringProperty: string;
    readonly setStringProperty?: readonly string[];
  }) {
    this.identifier = parameters.identifier;
    if (purify.Maybe.isMaybe(parameters.optionalStringProperty)) {
      this.optionalStringProperty = parameters.optionalStringProperty;
    } else if (typeof parameters.optionalStringProperty === "string") {
      this.optionalStringProperty = purify.Maybe.of(
        parameters.optionalStringProperty,
      );
    } else if (typeof parameters.optionalStringProperty === "undefined") {
      this.optionalStringProperty = purify.Maybe.empty();
    } else {
      this.optionalStringProperty = parameters.optionalStringProperty; // never
    }

    this.requiredStringProperty = parameters.requiredStringProperty;
    if (typeof parameters.setStringProperty === "undefined") {
      this.setStringProperty = [];
    } else if (Array.isArray(parameters.setStringProperty)) {
      this.setStringProperty = parameters.setStringProperty;
    } else {
      this.setStringProperty = parameters.setStringProperty; // never
    }
  }

  equals(
    other: NodeShapeWithPropertyCardinalities,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      optionalStringProperty: purifyHelpers.Equatable.booleanEquals,
      requiredStringProperty: purifyHelpers.Equatable.strictEquals,
      setStringProperty: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.strictEquals,
        ),
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return NodeShapeWithPropertyCardinalities.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/optionalStringProperty"),
      this.optionalStringProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/requiredStringProperty"),
      this.requiredStringProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/setStringProperty"),
      this.setStringProperty,
    );
    return _resource;
  }
}

export namespace NodeShapeWithPropertyCardinalities {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    NodeShapeWithPropertyCardinalities
  > {
    const identifier = _resource.identifier;
    const _optionalStringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<string>
    > = purify.Either.of(
      _resource
        .values(
          dataFactory.namedNode("http://example.com/optionalStringProperty"),
          { unique: true },
        )
        .head()
        .chain((_value) => _value.toString())
        .toMaybe(),
    );
    if (_optionalStringPropertyEither.isLeft()) {
      return _optionalStringPropertyEither;
    }

    const optionalStringProperty = _optionalStringPropertyEither.unsafeCoerce();
    const _requiredStringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(
        dataFactory.namedNode("http://example.com/requiredStringProperty"),
        { unique: true },
      )
      .head()
      .chain((_value) => _value.toString());
    if (_requiredStringPropertyEither.isLeft()) {
      return _requiredStringPropertyEither;
    }

    const requiredStringProperty = _requiredStringPropertyEither.unsafeCoerce();
    const _setStringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly string[]
    > = purify.Either.of([
      ..._resource
        .values(dataFactory.namedNode("http://example.com/setStringProperty"), {
          unique: true,
        })
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toString())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_setStringPropertyEither.isLeft()) {
      return _setStringPropertyEither;
    }

    const setStringProperty = _setStringPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new NodeShapeWithPropertyCardinalities({
        identifier,
        optionalStringProperty,
        requiredStringProperty,
        setStringProperty,
      }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithPropertyCardinalities: Omit<
      NodeShapeWithPropertyCardinalities,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _nodeShapeWithPropertyCardinalities.optionalStringProperty.ifJust(
      (_value) => {
        _hasher.update(_value);
      },
    );
    _hasher.update(_nodeShapeWithPropertyCardinalities.requiredStringProperty);
    for (const _element of _nodeShapeWithPropertyCardinalities.setStringProperty) {
      _hasher.update(_element);
    }

    return _hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject);
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/optionalStringProperty"),
            this.variable("OptionalStringProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/requiredStringProperty"),
          this.variable("RequiredStringProperty"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/setStringProperty"),
          this.variable("SetStringProperty"),
        ),
      );
    }
  }
}

export class OrNodeShapeMember1 {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty1: string;
  readonly type = "OrNodeShapeMember1" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty1: string;
  }) {
    this.identifier = parameters.identifier;
    this.stringProperty1 = parameters.stringProperty1;
  }

  equals(other: OrNodeShapeMember1): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty1: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return OrNodeShapeMember1.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty1"),
      this.stringProperty1,
    );
    return _resource;
  }
}

export namespace OrNodeShapeMember1 {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, OrNodeShapeMember1> {
    const identifier = _resource.identifier;
    const _stringProperty1Either: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty1"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringProperty1Either.isLeft()) {
      return _stringProperty1Either;
    }

    const stringProperty1 = _stringProperty1Either.unsafeCoerce();
    return purify.Either.of(
      new OrNodeShapeMember1({ identifier, stringProperty1 }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _orNodeShapeMember1: Omit<
      OrNodeShapeMember1,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_orNodeShapeMember1.stringProperty1);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty1"),
          this.variable("StringProperty1"),
        ),
      );
    }
  }
}

export class OrNodeShapeMember2 {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty2: string;
  readonly type = "OrNodeShapeMember2" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty2: string;
  }) {
    this.identifier = parameters.identifier;
    this.stringProperty2 = parameters.stringProperty2;
  }

  equals(other: OrNodeShapeMember2): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty2: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return OrNodeShapeMember2.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty2"),
      this.stringProperty2,
    );
    return _resource;
  }
}

export namespace OrNodeShapeMember2 {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, OrNodeShapeMember2> {
    const identifier = _resource.identifier;
    const _stringProperty2Either: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty2"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringProperty2Either.isLeft()) {
      return _stringProperty2Either;
    }

    const stringProperty2 = _stringProperty2Either.unsafeCoerce();
    return purify.Either.of(
      new OrNodeShapeMember2({ identifier, stringProperty2 }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _orNodeShapeMember2: Omit<
      OrNodeShapeMember2,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_orNodeShapeMember2.stringProperty2);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty2"),
          this.variable("StringProperty2"),
        ),
      );
    }
  }
}

export class Sha256IriNodeShape {
  private _identifier: rdfjs.NamedNode | undefined;
  readonly stringProperty: string;
  readonly type = "Sha256IriNodeShape" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this._identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  get identifier(): rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  equals(other: Sha256IriNodeShape): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return Sha256IriNodeShape.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty,
    );
    return _resource;
  }
}

export namespace Sha256IriNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, Sha256IriNodeShape> {
    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new Sha256IriNodeShape({ identifier, stringProperty }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _sha256IriNodeShape: Omit<
      Sha256IriNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_sha256IriNodeShape.stringProperty);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty"),
          this.variable("StringProperty"),
        ),
      );
    }
  }
}

export class UuidV4IriNodeShape {
  private _identifier: rdfjs.NamedNode | undefined;
  readonly stringProperty: string;
  readonly type = "UuidV4IriNodeShape" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this._identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  get identifier(): rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${uuid.v4()}`,
      );
    }
    return this._identifier;
  }

  equals(other: UuidV4IriNodeShape): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(hasher: HasherT): HasherT {
    return UuidV4IriNodeShape.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty,
    );
    return _resource;
  }
}

export namespace UuidV4IriNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, UuidV4IriNodeShape> {
    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/stringProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new UuidV4IriNodeShape({ identifier, stringProperty }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _uuidV4IriNodeShape: Omit<
      UuidV4IriNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_uuidV4IriNodeShape.stringProperty);
    return _hasher;
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
          dataFactory.namedNode("http://example.com/stringProperty"),
          this.variable("StringProperty"),
        ),
      );
    }
  }
}

export type OrNodeShape = OrNodeShapeMember1 | OrNodeShapeMember2;

export namespace OrNodeShape {
  export function equals(
    left: OrNodeShape,
    right: OrNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      type: purifyHelpers.Equatable.strictEquals,
    }).chain(() => {
      switch (left.type) {
        case "OrNodeShapeMember1":
          return left.equals(right as unknown as OrNodeShapeMember1);
        case "OrNodeShapeMember2":
          return left.equals(right as unknown as OrNodeShapeMember2);
      }
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, OrNodeShape> {
    return (
      OrNodeShapeMember1.fromRdf(_resource, _options) as purify.Either<
        rdfjsResource.Resource.ValueError,
        OrNodeShape
      >
    ).altLazy(
      () =>
        OrNodeShapeMember2.fromRdf(_resource, _options) as purify.Either<
          rdfjsResource.Resource.ValueError,
          OrNodeShape
        >,
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(orNodeShape: OrNodeShape, _hasher: HasherT): HasherT {
    switch (orNodeShape.type) {
      case "OrNodeShapeMember1":
        return orNodeShape.hash(_hasher);
      case "OrNodeShapeMember2":
        return orNodeShape.hash(_hasher);
    }
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
    constructor(subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter) {
      super(subject);
      this.add(
        sparqlBuilder.GraphPattern.union(
          new OrNodeShapeMember1.SparqlGraphPatterns(
            this.subject,
          ).toGroupGraphPattern(),
          new OrNodeShapeMember2.SparqlGraphPatterns(
            this.subject,
          ).toGroupGraphPattern(),
        ),
      );
    }
  }

  export function toRdf(
    orNodeShape: OrNodeShape,
    _parameters: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    switch (orNodeShape.type) {
      case "OrNodeShapeMember1":
        return orNodeShape.toRdf(_parameters);
      case "OrNodeShapeMember2":
        return orNodeShape.toRdf(_parameters);
    }
  }
}
