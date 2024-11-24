import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

abstract class AbstractBaseClassNodeShape {
  readonly identifier: rdfjs.NamedNode;
  readonly stringProperty: readonly string[];
  abstract readonly type: "ChildClassNodeShape" | "ParentClassNodeShape";

  constructor(parameters: {
    readonly identifier: rdfjs.NamedNode;
    readonly stringProperty?: readonly string[];
  }) {
    this.identifier = parameters.identifier;
    if (typeof parameters.stringProperty === "undefined") {
      this.stringProperty = [];
    } else if (Array.isArray(parameters.stringProperty)) {
      this.stringProperty = parameters.stringProperty;
    } else {
      this.stringProperty = parameters.stringProperty; // never
    }
  }

  equals(
    other: AbstractBaseClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: (left, right) =>
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
    return AbstractBaseClassNodeShape.hashAbstractBaseClassNodeShape(
      this,
      hasher,
    );
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
    const _resource = resourceSet.mutableNamedResource({
      identifier: this.identifier,
      mutateGraph,
    });
    if (!ignoreRdfType) {
      _resource.add(
        _resource.dataFactory.namedNode(
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        ),
        _resource.dataFactory.namedNode(
          "http://example.com/AbstractBaseClassNodeShape",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      this.stringProperty,
    );
    return _resource;
  }
}

namespace AbstractBaseClassNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { identifier: rdfjs.NamedNode; stringProperty: readonly string[] }
  > {
    if (
      !_options?.ignoreRdfType &&
      !_resource.isInstanceOf(
        dataFactory.namedNode("http://example.com/AbstractBaseClassNodeShape"),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: _resource,
          message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://example.com/AbstractBaseClassNodeShape",
          ),
        }),
      );
    }

    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly string[]
    > = purify.Either.of([
      ..._resource
        .values(dataFactory.namedNode("http://example.com/stringProperty"), {
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
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of({ identifier, stringProperty });
  }

  export function hashAbstractBaseClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    abstractBaseClassNodeShape: Omit<
      AbstractBaseClassNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    for (const _element of abstractBaseClassNodeShape.stringProperty) {
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
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode(
              "http://example.com/AbstractBaseClassNodeShape",
            ),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/stringProperty"),
            this.variable("StringProperty"),
          ),
        ),
      );
    }
  }
}

export class NonClassNodeShape {
  readonly decimalProperty: readonly rdfjs.Literal[];
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type = "NonClassNodeShape" as const;

  constructor(parameters: {
    readonly decimalProperty?: readonly rdfjs.Literal[];
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  }) {
    if (typeof parameters.decimalProperty === "undefined") {
      this.decimalProperty = [];
    } else if (Array.isArray(parameters.decimalProperty)) {
      this.decimalProperty = parameters.decimalProperty;
    } else {
      this.decimalProperty = parameters.decimalProperty; // never
    }

    this.identifier = parameters.identifier;
  }

  equals(other: NonClassNodeShape): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      decimalProperty: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
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
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/decimalProperty"),
      this.decimalProperty,
    );
    return _resource;
  }
}

export namespace NonClassNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, NonClassNodeShape> {
    const _decimalPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(dataFactory.namedNode("http://example.com/decimalProperty"), {
          unique: true,
        })
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_decimalPropertyEither.isLeft()) {
      return _decimalPropertyEither;
    }

    const decimalProperty = _decimalPropertyEither.unsafeCoerce();
    const identifier = _resource.identifier;
    return purify.Either.of(
      new NonClassNodeShape({ decimalProperty, identifier }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    nonClassNodeShape: Omit<
      NonClassNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    for (const _element of nonClassNodeShape.decimalProperty) {
      _hasher.update(_element.value);
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
            dataFactory.namedNode("http://example.com/decimalProperty"),
            this.variable("DecimalProperty"),
          ),
        ),
      );
    }
  }
}

export class OrNodeShapeMember1 {
  readonly decimalProperty: readonly rdfjs.Literal[];
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type = "OrNodeShapeMember1" as const;

  constructor(parameters: {
    readonly decimalProperty?: readonly rdfjs.Literal[];
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  }) {
    if (typeof parameters.decimalProperty === "undefined") {
      this.decimalProperty = [];
    } else if (Array.isArray(parameters.decimalProperty)) {
      this.decimalProperty = parameters.decimalProperty;
    } else {
      this.decimalProperty = parameters.decimalProperty; // never
    }

    this.identifier = parameters.identifier;
  }

  equals(other: OrNodeShapeMember1): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      decimalProperty: (left, right) =>
        purifyHelpers.Arrays.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      identifier: purifyHelpers.Equatable.booleanEquals,
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
    ignoreRdfType?: boolean;
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: this.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/decimalProperty"),
      this.decimalProperty,
    );
    return _resource;
  }
}

export namespace OrNodeShapeMember1 {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, OrNodeShapeMember1> {
    const _decimalPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly rdfjs.Literal[]
    > = purify.Either.of([
      ..._resource
        .values(dataFactory.namedNode("http://example.com/decimalProperty"), {
          unique: true,
        })
        .flatMap((_value) =>
          _value
            .toValues()
            .head()
            .chain((_value) => _value.toLiteral())
            .toMaybe()
            .toList(),
        ),
    ]);
    if (_decimalPropertyEither.isLeft()) {
      return _decimalPropertyEither;
    }

    const decimalProperty = _decimalPropertyEither.unsafeCoerce();
    const identifier = _resource.identifier;
    return purify.Either.of(
      new OrNodeShapeMember1({ decimalProperty, identifier }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    orNodeShapeMember1: Omit<
      OrNodeShapeMember1,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    for (const _element of orNodeShapeMember1.decimalProperty) {
      _hasher.update(_element.value);
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
            dataFactory.namedNode("http://example.com/decimalProperty"),
            this.variable("DecimalProperty"),
          ),
        ),
      );
    }
  }
}

export class ParentClassNodeShape extends AbstractBaseClassNodeShape {
  readonly integerProperty: readonly number[];
  readonly type: "ChildClassNodeShape" | "ParentClassNodeShape" =
    "ParentClassNodeShape";

  constructor(
    parameters: {
      readonly integerProperty?: readonly number[];
    } & ConstructorParameters<typeof AbstractBaseClassNodeShape>[0],
  ) {
    super(parameters);
    if (typeof parameters.integerProperty === "undefined") {
      this.integerProperty = [];
    } else if (Array.isArray(parameters.integerProperty)) {
      this.integerProperty = parameters.integerProperty;
    } else {
      this.integerProperty = parameters.integerProperty; // never
    }
  }

  override equals(
    other: ParentClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return super
      .equals(other)
      .chain(() =>
        purifyHelpers.Equatable.objectEquals(this, other, {
          integerProperty: (left, right) =>
            purifyHelpers.Arrays.equals(
              left,
              right,
              purifyHelpers.Equatable.strictEquals,
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
    return ParentClassNodeShape.hashParentClassNodeShape(this, hasher);
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
          "http://example.com/ParentClassNodeShape",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://example.com/integerProperty"),
      this.integerProperty,
    );
    return _resource;
  }
}

export namespace ParentClassNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, ParentClassNodeShape> {
    return AbstractBaseClassNodeShape.fromRdf(_resource, {
      ignoreRdfType: true,
    }).chain((_super) => {
      if (
        !_options?.ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode("http://example.com/ParentClassNodeShape"),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://example.com/ParentClassNodeShape",
            ),
          }),
        );
      }
      const _integerPropertyEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly number[]
      > = purify.Either.of([
        ..._resource
          .values(dataFactory.namedNode("http://example.com/integerProperty"), {
            unique: true,
          })
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((_value) => _value.toNumber())
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_integerPropertyEither.isLeft()) {
        return _integerPropertyEither;
      }
      const integerProperty = _integerPropertyEither.unsafeCoerce();
      return purify.Either.of(
        new ParentClassNodeShape({
          identifier: _super.identifier,
          stringProperty: _super.stringProperty,
          integerProperty,
        }),
      );
    });
  }

  export function hashParentClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    parentClassNodeShape: Omit<
      ParentClassNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    AbstractBaseClassNodeShape.hashAbstractBaseClassNodeShape(
      parentClassNodeShape,
      _hasher,
    );
    for (const _element of parentClassNodeShape.integerProperty) {
      _hasher.update(_element.toString());
    }

    return _hasher;
  }

  export class SparqlGraphPatterns extends AbstractBaseClassNodeShape.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode("http://example.com/ParentClassNodeShape"),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/integerProperty"),
            this.variable("IntegerProperty"),
          ),
        ),
      );
    }
  }
}

export class ChildClassNodeShape extends ParentClassNodeShape {
  readonly decimalProperty: readonly rdfjs.Literal[];
  override readonly type = "ChildClassNodeShape" as const;

  constructor(
    parameters: {
      readonly decimalProperty?: readonly rdfjs.Literal[];
    } & ConstructorParameters<typeof ParentClassNodeShape>[0],
  ) {
    super(parameters);
    if (typeof parameters.decimalProperty === "undefined") {
      this.decimalProperty = [];
    } else if (Array.isArray(parameters.decimalProperty)) {
      this.decimalProperty = parameters.decimalProperty;
    } else {
      this.decimalProperty = parameters.decimalProperty; // never
    }
  }

  override equals(
    other: ChildClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return super
      .equals(other)
      .chain(() =>
        purifyHelpers.Equatable.objectEquals(this, other, {
          decimalProperty: (left, right) =>
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
    return ChildClassNodeShape.hashChildClassNodeShape(this, hasher);
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
          "http://example.com/ChildClassNodeShape",
        ),
      );
    }

    _resource.add(
      dataFactory.namedNode("http://example.com/decimalProperty"),
      this.decimalProperty,
    );
    return _resource;
  }
}

export namespace ChildClassNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, ChildClassNodeShape> {
    return ParentClassNodeShape.fromRdf(_resource, {
      ignoreRdfType: true,
    }).chain((_super) => {
      if (
        !_options?.ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode("http://example.com/ChildClassNodeShape"),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://example.com/ChildClassNodeShape",
            ),
          }),
        );
      }
      const _decimalPropertyEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly rdfjs.Literal[]
      > = purify.Either.of([
        ..._resource
          .values(dataFactory.namedNode("http://example.com/decimalProperty"), {
            unique: true,
          })
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((_value) => _value.toLiteral())
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_decimalPropertyEither.isLeft()) {
        return _decimalPropertyEither;
      }
      const decimalProperty = _decimalPropertyEither.unsafeCoerce();
      return purify.Either.of(
        new ChildClassNodeShape({
          integerProperty: _super.integerProperty,
          identifier: _super.identifier,
          stringProperty: _super.stringProperty,
          decimalProperty,
        }),
      );
    });
  }

  export function hashChildClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    childClassNodeShape: Omit<
      ChildClassNodeShape,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    ParentClassNodeShape.hashParentClassNodeShape(childClassNodeShape, _hasher);
    for (const _element of childClassNodeShape.decimalProperty) {
      _hasher.update(_element.value);
    }

    return _hasher;
  }

  export class SparqlGraphPatterns extends ParentClassNodeShape.SparqlGraphPatterns {
    constructor(
      subject: sparqlBuilder.ResourceGraphPatterns.SubjectParameter,
      _options?: { ignoreRdfType?: boolean },
    ) {
      super(subject, { ignoreRdfType: true });
      if (!_options?.ignoreRdfType) {
        this.add(
          ...new sparqlBuilder.RdfTypeGraphPatterns(
            subject,
            dataFactory.namedNode("http://example.com/ChildClassNodeShape"),
          ),
        );
      }

      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/decimalProperty"),
            this.variable("DecimalProperty"),
          ),
        ),
      );
    }
  }
}

export class OrNodeShapeMember2 {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: readonly string[];
  readonly type = "OrNodeShapeMember2" as const;

  constructor(parameters: {
    readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty?: readonly string[];
  }) {
    this.identifier = parameters.identifier;
    if (typeof parameters.stringProperty === "undefined") {
      this.stringProperty = [];
    } else if (Array.isArray(parameters.stringProperty)) {
      this.stringProperty = parameters.stringProperty;
    } else {
      this.stringProperty = parameters.stringProperty; // never
    }
  }

  equals(other: OrNodeShapeMember2): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: (left, right) =>
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
    return OrNodeShapeMember2.hash(this, hasher);
  }

  toRdf({
    mutateGraph,
    resourceSet,
  }: {
    ignoreRdfType?: boolean;
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

export namespace OrNodeShapeMember2 {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<rdfjsResource.Resource.ValueError, OrNodeShapeMember2> {
    const identifier = _resource.identifier;
    const _stringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      readonly string[]
    > = purify.Either.of([
      ..._resource
        .values(dataFactory.namedNode("http://example.com/stringProperty"), {
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
    if (_stringPropertyEither.isLeft()) {
      return _stringPropertyEither;
    }

    const stringProperty = _stringPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new OrNodeShapeMember2({ identifier, stringProperty }),
    );
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    orNodeShapeMember2: Omit<
      OrNodeShapeMember2,
      "equals" | "hash" | "identifier" | "toRdf" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    for (const _element of orNodeShapeMember2.stringProperty) {
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
            dataFactory.namedNode("http://example.com/stringProperty"),
            this.variable("StringProperty"),
          ),
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
