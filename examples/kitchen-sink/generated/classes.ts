import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { sha256 } from "js-sha256";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
// @ts-ignore
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";
import * as uuid from "uuid";

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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty);
    return _hasher;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty);
    return _hasher;
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

export class OrNodeShapeMember2 {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly stringProperty2: string;
  readonly type = "OrNodeShapeMember2" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty2: string;
  }) {
    this._identifier = parameters.identifier;
    this.stringProperty2 = parameters.stringProperty2;
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty2);
    return _hasher;
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

export class OrNodeShapeMember1 {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly stringProperty1: string;
  readonly type = "OrNodeShapeMember1" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty1: string;
  }) {
    this._identifier = parameters.identifier;
    this.stringProperty1 = parameters.stringProperty1;
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty1);
    return _hasher;
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

export class NodeShapeWithPropertyCardinalities {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly optionalStringProperty: purify.Maybe<string>;
  readonly requiredStringProperty: string;
  readonly setStringProperty: readonly string[];
  readonly type = "NodeShapeWithPropertyCardinalities" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly optionalStringProperty?: purify.Maybe<string> | string;
    readonly requiredStringProperty: string;
    readonly setStringProperty?: readonly string[];
  }) {
    this._identifier = parameters.identifier;
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
    if (Array.isArray(parameters.setStringProperty)) {
      this.setStringProperty = parameters.setStringProperty;
    } else if (typeof parameters.setStringProperty === "undefined") {
      this.setStringProperty = [];
    } else {
      this.setStringProperty = parameters.setStringProperty; // never
    }
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
  >(_hasher: HasherT): HasherT {
    this.optionalStringProperty.ifJust((_value) => {
      _hasher.update(_value);
    });
    _hasher.update(this.requiredStringProperty);
    for (const _element of this.setStringProperty) {
      _hasher.update(_element);
    }

    return _hasher;
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

export class NodeShapeWithOrProperties {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly orLiteralsProperty: purify.Maybe<rdfjs.Literal>;
  readonly orTermsProperty: purify.Maybe<rdfjs.Literal | rdfjs.NamedNode>;
  readonly orUnrelatedProperty: purify.Maybe<
    | { type: "0-number"; value: number }
    | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
  >;
  readonly type = "NodeShapeWithOrProperties" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly orLiteralsProperty?:
      | Date
      | boolean
      | number
      | purify.Maybe<rdfjs.Literal>
      | rdfjs.Literal
      | string;
    readonly orTermsProperty?:
      | (rdfjs.Literal | rdfjs.NamedNode)
      | purify.Maybe<rdfjs.Literal | rdfjs.NamedNode>;
    readonly orUnrelatedProperty?:
      | (
          | { type: "0-number"; value: number }
          | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
        )
      | purify.Maybe<
          | { type: "0-number"; value: number }
          | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
        >;
  }) {
    this._identifier = parameters.identifier;
    if (purify.Maybe.isMaybe(parameters.orLiteralsProperty)) {
      this.orLiteralsProperty = parameters.orLiteralsProperty;
    } else if (typeof parameters.orLiteralsProperty === "boolean") {
      this.orLiteralsProperty = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.orLiteralsProperty),
      );
    } else if (
      typeof parameters.orLiteralsProperty === "object" &&
      parameters.orLiteralsProperty instanceof Date
    ) {
      this.orLiteralsProperty = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.orLiteralsProperty),
      );
    } else if (typeof parameters.orLiteralsProperty === "number") {
      this.orLiteralsProperty = purify.Maybe.of(
        rdfLiteral.toRdf(parameters.orLiteralsProperty),
      );
    } else if (typeof parameters.orLiteralsProperty === "string") {
      this.orLiteralsProperty = purify.Maybe.of(
        dataFactory.literal(parameters.orLiteralsProperty),
      );
    } else if (typeof parameters.orLiteralsProperty === "object") {
      this.orLiteralsProperty = purify.Maybe.of(parameters.orLiteralsProperty);
    } else if (typeof parameters.orLiteralsProperty === "undefined") {
      this.orLiteralsProperty = purify.Maybe.empty();
    } else {
      this.orLiteralsProperty = parameters.orLiteralsProperty; // never
    }

    if (purify.Maybe.isMaybe(parameters.orTermsProperty)) {
      this.orTermsProperty = parameters.orTermsProperty;
    } else if (typeof parameters.orTermsProperty === "object") {
      this.orTermsProperty = purify.Maybe.of(parameters.orTermsProperty);
    } else if (typeof parameters.orTermsProperty === "undefined") {
      this.orTermsProperty = purify.Maybe.empty();
    } else {
      this.orTermsProperty = parameters.orTermsProperty; // never
    }

    if (purify.Maybe.isMaybe(parameters.orUnrelatedProperty)) {
      this.orUnrelatedProperty = parameters.orUnrelatedProperty;
    } else if (typeof parameters.orUnrelatedProperty === "object") {
      this.orUnrelatedProperty = purify.Maybe.of(
        parameters.orUnrelatedProperty,
      );
    } else if (typeof parameters.orUnrelatedProperty === "undefined") {
      this.orUnrelatedProperty = purify.Maybe.empty();
    } else {
      this.orUnrelatedProperty = parameters.orUnrelatedProperty; // never
    }
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
    other: NodeShapeWithOrProperties,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      orLiteralsProperty: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      orTermsProperty: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          (
            left: rdfjs.Literal | rdfjs.NamedNode,
            right: rdfjs.Literal | rdfjs.NamedNode,
          ) => {
            if (left.termType === "Literal" && right.termType === "Literal") {
              return purifyHelpers.Equatable.booleanEquals(left, right);
            }
            if (
              left.termType === "NamedNode" &&
              right.termType === "NamedNode"
            ) {
              return purifyHelpers.Equatable.booleanEquals(left, right);
            }

            return purify.Left({
              left,
              right,
              propertyName: "type",
              propertyValuesUnequal: {
                left: typeof left,
                right: typeof right,
                type: "BooleanEquals",
              },
              type: "Property",
            });
          },
        ),
      orUnrelatedProperty: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          (
            left:
              | { type: "0-number"; value: number }
              | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode },
            right:
              | { type: "0-number"; value: number }
              | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode },
          ) => {
            if (left.type === "0-number" && right.type === "0-number") {
              return purifyHelpers.Equatable.strictEquals(
                left.value,
                right.value,
              );
            }
            if (
              left.type === "1-rdfjs.NamedNode" &&
              right.type === "1-rdfjs.NamedNode"
            ) {
              return purifyHelpers.Equatable.booleanEquals(
                left.value,
                right.value,
              );
            }

            return purify.Left({
              left,
              right,
              propertyName: "type",
              propertyValuesUnequal: {
                left: typeof left,
                right: typeof right,
                type: "BooleanEquals",
              },
              type: "Property",
            });
          },
        ),
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    this.orLiteralsProperty.ifJust((_value) => {
      _hasher.update(_value.value);
    });
    this.orTermsProperty.ifJust((_value) => {
      switch (_value.termType) {
        case "Literal": {
          _hasher.update(_value.value);
          break;
        }
        case "NamedNode": {
          _hasher.update(rdfjsResource.Resource.Identifier.toString(_value));
          break;
        }
      }
    });
    this.orUnrelatedProperty.ifJust((_value) => {
      switch (_value.type) {
        case "0-number": {
          _hasher.update(_value.value.toString());
          break;
        }
        case "1-rdfjs.NamedNode": {
          _hasher.update(
            rdfjsResource.Resource.Identifier.toString(_value.value),
          );
          break;
        }
      }
    });
    return _hasher;
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
      dataFactory.namedNode("http://example.com/orLiteralsProperty"),
      this.orLiteralsProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/orTermsProperty"),
      this.orTermsProperty.map((_value) =>
        _value.termType === "NamedNode" ? _value : _value,
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/orUnrelatedProperty"),
      this.orUnrelatedProperty.map((_value) =>
        _value.type === "1-rdfjs.NamedNode" ? _value.value : _value.value,
      ),
    );
    return _resource;
  }
}

export namespace NodeShapeWithOrProperties {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    NodeShapeWithOrProperties
  > {
    const identifier = _resource.identifier;
    const _orLiteralsPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<rdfjs.Literal>
    > = purify.Either.of(
      _resource
        .values(
          dataFactory.namedNode("http://example.com/orLiteralsProperty"),
          { unique: true },
        )
        .head()
        .chain((_value) => _value.toLiteral())
        .toMaybe(),
    );
    if (_orLiteralsPropertyEither.isLeft()) {
      return _orLiteralsPropertyEither;
    }

    const orLiteralsProperty = _orLiteralsPropertyEither.unsafeCoerce();
    const _orTermsPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<rdfjs.Literal | rdfjs.NamedNode>
    > = purify.Either.of(
      (
        _resource
          .values(dataFactory.namedNode("http://example.com/orTermsProperty"), {
            unique: true,
          })
          .head()
          .chain((_value) => _value.toLiteral()) as purify.Either<
          rdfjsResource.Resource.ValueError,
          rdfjs.Literal | rdfjs.NamedNode
        >
      )
        .altLazy(
          () =>
            _resource
              .values(
                dataFactory.namedNode("http://example.com/orTermsProperty"),
                { unique: true },
              )
              .head()
              .chain((_value) => _value.toIri()) as purify.Either<
              rdfjsResource.Resource.ValueError,
              rdfjs.Literal | rdfjs.NamedNode
            >,
        )
        .toMaybe(),
    );
    if (_orTermsPropertyEither.isLeft()) {
      return _orTermsPropertyEither;
    }

    const orTermsProperty = _orTermsPropertyEither.unsafeCoerce();
    const _orUnrelatedPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<
        | { type: "0-number"; value: number }
        | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
      >
    > = purify.Either.of(
      (
        _resource
          .values(
            dataFactory.namedNode("http://example.com/orUnrelatedProperty"),
            { unique: true },
          )
          .head()
          .chain((_value) => _value.toNumber())
          .map(
            (value) =>
              ({ type: "0-number" as const, value }) as
                | { type: "0-number"; value: number }
                | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode },
          ) as purify.Either<
          rdfjsResource.Resource.ValueError,
          | { type: "0-number"; value: number }
          | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
        >
      )
        .altLazy(
          () =>
            _resource
              .values(
                dataFactory.namedNode("http://example.com/orUnrelatedProperty"),
                { unique: true },
              )
              .head()
              .chain((_value) => _value.toIri())
              .map(
                (value) =>
                  ({ type: "1-rdfjs.NamedNode" as const, value }) as
                    | { type: "0-number"; value: number }
                    | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode },
              ) as purify.Either<
              rdfjsResource.Resource.ValueError,
              | { type: "0-number"; value: number }
              | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
            >,
        )
        .toMaybe(),
    );
    if (_orUnrelatedPropertyEither.isLeft()) {
      return _orUnrelatedPropertyEither;
    }

    const orUnrelatedProperty = _orUnrelatedPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new NodeShapeWithOrProperties({
        identifier,
        orLiteralsProperty,
        orTermsProperty,
        orUnrelatedProperty,
      }),
    );
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
            dataFactory.namedNode("http://example.com/orLiteralsProperty"),
            this.variable("OrLiteralsProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.union(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode("http://example.com/orTermsProperty"),
              this.variable("OrTermsProperty"),
            ),
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode("http://example.com/orTermsProperty"),
              this.variable("OrTermsProperty"),
            ),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.union(
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode("http://example.com/orUnrelatedProperty"),
              this.variable("OrUnrelatedProperty"),
            ),
            sparqlBuilder.GraphPattern.basic(
              this.subject,
              dataFactory.namedNode("http://example.com/orUnrelatedProperty"),
              this.variable("OrUnrelatedProperty"),
            ),
          ),
        ),
      );
    }
  }
}

export class NodeShapeWithListProperty {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly listProperty: readonly string[];
  readonly type = "NodeShapeWithListProperty" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly listProperty: readonly string[];
  }) {
    this._identifier = parameters.identifier;
    this.listProperty = parameters.listProperty;
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
  >(_hasher: HasherT): HasherT {
    for (const _element of this.listProperty) {
      _hasher.update(_element);
    }

    return _hasher;
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

export class NodeShapeWithInProperties {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly inBooleansProperty: purify.Maybe<true>;
  readonly inIrisProperty: purify.Maybe<
    rdfjs.NamedNode<
      | "http://example.com/NodeShapeWithInPropertiesIri1"
      | "http://example.com/NodeShapeWithInPropertiesIri2"
    >
  >;
  readonly inNumbersProperty: purify.Maybe<1 | 2>;
  readonly inStringsProperty: purify.Maybe<"text" | "html">;
  readonly type = "NodeShapeWithInProperties" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly inBooleansProperty?: purify.Maybe<true> | true;
    readonly inIrisProperty?:
      | purify.Maybe<
          rdfjs.NamedNode<
            | "http://example.com/NodeShapeWithInPropertiesIri1"
            | "http://example.com/NodeShapeWithInPropertiesIri2"
          >
        >
      | rdfjs.NamedNode<
          | "http://example.com/NodeShapeWithInPropertiesIri1"
          | "http://example.com/NodeShapeWithInPropertiesIri2"
        >;
    readonly inNumbersProperty?: 1 | 2 | purify.Maybe<1 | 2>;
    readonly inStringsProperty?:
      | "text"
      | "html"
      | purify.Maybe<"text" | "html">;
  }) {
    this._identifier = parameters.identifier;
    if (purify.Maybe.isMaybe(parameters.inBooleansProperty)) {
      this.inBooleansProperty = parameters.inBooleansProperty;
    } else if (typeof parameters.inBooleansProperty === "boolean") {
      this.inBooleansProperty = purify.Maybe.of(parameters.inBooleansProperty);
    } else if (typeof parameters.inBooleansProperty === "undefined") {
      this.inBooleansProperty = purify.Maybe.empty();
    } else {
      this.inBooleansProperty = parameters.inBooleansProperty; // never
    }

    if (purify.Maybe.isMaybe(parameters.inIrisProperty)) {
      this.inIrisProperty = parameters.inIrisProperty;
    } else if (typeof parameters.inIrisProperty === "object") {
      this.inIrisProperty = purify.Maybe.of(parameters.inIrisProperty);
    } else if (typeof parameters.inIrisProperty === "undefined") {
      this.inIrisProperty = purify.Maybe.empty();
    } else {
      this.inIrisProperty = parameters.inIrisProperty; // never
    }

    if (purify.Maybe.isMaybe(parameters.inNumbersProperty)) {
      this.inNumbersProperty = parameters.inNumbersProperty;
    } else if (typeof parameters.inNumbersProperty === "number") {
      this.inNumbersProperty = purify.Maybe.of(parameters.inNumbersProperty);
    } else if (typeof parameters.inNumbersProperty === "undefined") {
      this.inNumbersProperty = purify.Maybe.empty();
    } else {
      this.inNumbersProperty = parameters.inNumbersProperty; // never
    }

    if (purify.Maybe.isMaybe(parameters.inStringsProperty)) {
      this.inStringsProperty = parameters.inStringsProperty;
    } else if (typeof parameters.inStringsProperty === "string") {
      this.inStringsProperty = purify.Maybe.of(parameters.inStringsProperty);
    } else if (typeof parameters.inStringsProperty === "undefined") {
      this.inStringsProperty = purify.Maybe.empty();
    } else {
      this.inStringsProperty = parameters.inStringsProperty; // never
    }
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
    other: NodeShapeWithInProperties,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      inBooleansProperty: purifyHelpers.Equatable.booleanEquals,
      inIrisProperty: (left, right) =>
        purifyHelpers.Maybes.equals(
          left,
          right,
          purifyHelpers.Equatable.booleanEquals,
        ),
      inNumbersProperty: purifyHelpers.Equatable.booleanEquals,
      inStringsProperty: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    this.inBooleansProperty.ifJust((_value) => {
      _hasher.update(_value.toString());
    });
    this.inIrisProperty.ifJust((_value) => {
      _hasher.update(rdfjsResource.Resource.Identifier.toString(_value));
    });
    this.inNumbersProperty.ifJust((_value) => {
      _hasher.update(_value.toString());
    });
    this.inStringsProperty.ifJust((_value) => {
      _hasher.update(_value);
    });
    return _hasher;
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
      dataFactory.namedNode("http://example.com/inBooleansProperty"),
      this.inBooleansProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inIrisProperty"),
      this.inIrisProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inNumbersProperty"),
      this.inNumbersProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inStringsProperty"),
      this.inStringsProperty,
    );
    return _resource;
  }
}

export namespace NodeShapeWithInProperties {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    NodeShapeWithInProperties
  > {
    const identifier = _resource.identifier;
    const _inBooleansPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<true>
    > = purify.Either.of(
      _resource
        .values(
          dataFactory.namedNode("http://example.com/inBooleansProperty"),
          { unique: true },
        )
        .head()
        .chain((_value) =>
          _value.toBoolean().chain((value) =>
            value === true
              ? purify.Either.of(value)
              : purify.Left(
                  new rdfjsResource.Resource.MistypedValueError({
                    actualValue: rdfLiteral.toRdf(value),
                    expectedValueType: "true",
                    focusResource: _resource,
                    predicate: dataFactory.namedNode(
                      "http://example.com/inBooleansProperty",
                    ),
                  }),
                ),
          ),
        )
        .toMaybe(),
    );
    if (_inBooleansPropertyEither.isLeft()) {
      return _inBooleansPropertyEither;
    }

    const inBooleansProperty = _inBooleansPropertyEither.unsafeCoerce();
    const _inIrisPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<
        rdfjs.NamedNode<
          | "http://example.com/NodeShapeWithInPropertiesIri1"
          | "http://example.com/NodeShapeWithInPropertiesIri2"
        >
      >
    > = purify.Either.of(
      _resource
        .values(dataFactory.namedNode("http://example.com/inIrisProperty"), {
          unique: true,
        })
        .head()
        .chain((_value) =>
          _value.toIri().chain((iri) => {
            switch (iri.value) {
              case "http://example.com/NodeShapeWithInPropertiesIri1":
                return purify.Either.of<
                  rdfjsResource.Resource.ValueError,
                  rdfjs.NamedNode<
                    | "http://example.com/NodeShapeWithInPropertiesIri1"
                    | "http://example.com/NodeShapeWithInPropertiesIri2"
                  >
                >(
                  iri as rdfjs.NamedNode<"http://example.com/NodeShapeWithInPropertiesIri1">,
                );
              case "http://example.com/NodeShapeWithInPropertiesIri2":
                return purify.Either.of<
                  rdfjsResource.Resource.ValueError,
                  rdfjs.NamedNode<
                    | "http://example.com/NodeShapeWithInPropertiesIri1"
                    | "http://example.com/NodeShapeWithInPropertiesIri2"
                  >
                >(
                  iri as rdfjs.NamedNode<"http://example.com/NodeShapeWithInPropertiesIri2">,
                );
              default:
                return purify.Left(
                  new rdfjsResource.Resource.MistypedValueError({
                    actualValue: iri,
                    expectedValueType:
                      'rdfjs.NamedNode<"http://example.com/NodeShapeWithInPropertiesIri1" | "http://example.com/NodeShapeWithInPropertiesIri2">',
                    focusResource: _resource,
                    predicate: dataFactory.namedNode(
                      "http://example.com/inIrisProperty",
                    ),
                  }),
                );
            }
          }),
        )
        .toMaybe(),
    );
    if (_inIrisPropertyEither.isLeft()) {
      return _inIrisPropertyEither;
    }

    const inIrisProperty = _inIrisPropertyEither.unsafeCoerce();
    const _inNumbersPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<1 | 2>
    > = purify.Either.of(
      _resource
        .values(dataFactory.namedNode("http://example.com/inNumbersProperty"), {
          unique: true,
        })
        .head()
        .chain((_value) =>
          _value.toNumber().chain((value) => {
            switch (value) {
              case 1:
              case 2:
                return purify.Either.of(value);
              default:
                return purify.Left(
                  new rdfjsResource.Resource.MistypedValueError({
                    actualValue: rdfLiteral.toRdf(value),
                    expectedValueType: "1 | 2",
                    focusResource: _resource,
                    predicate: dataFactory.namedNode(
                      "http://example.com/inNumbersProperty",
                    ),
                  }),
                );
            }
          }),
        )
        .toMaybe(),
    );
    if (_inNumbersPropertyEither.isLeft()) {
      return _inNumbersPropertyEither;
    }

    const inNumbersProperty = _inNumbersPropertyEither.unsafeCoerce();
    const _inStringsPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<"text" | "html">
    > = purify.Either.of(
      _resource
        .values(dataFactory.namedNode("http://example.com/inStringsProperty"), {
          unique: true,
        })
        .head()
        .chain((_value) =>
          _value.toString().chain((value) => {
            switch (value) {
              case "text":
              case "html":
                return purify.Either.of(value);
              default:
                return purify.Left(
                  new rdfjsResource.Resource.MistypedValueError({
                    actualValue: rdfLiteral.toRdf(value),
                    expectedValueType: '"text" | "html"',
                    focusResource: _resource,
                    predicate: dataFactory.namedNode(
                      "http://example.com/inStringsProperty",
                    ),
                  }),
                );
            }
          }),
        )
        .toMaybe(),
    );
    if (_inStringsPropertyEither.isLeft()) {
      return _inStringsPropertyEither;
    }

    const inStringsProperty = _inStringsPropertyEither.unsafeCoerce();
    return purify.Either.of(
      new NodeShapeWithInProperties({
        identifier,
        inBooleansProperty,
        inIrisProperty,
        inNumbersProperty,
        inStringsProperty,
      }),
    );
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
            dataFactory.namedNode("http://example.com/inBooleansProperty"),
            this.variable("InBooleansProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/inIrisProperty"),
            this.variable("InIrisProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/inNumbersProperty"),
            this.variable("InNumbersProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/inStringsProperty"),
            this.variable("InStringsProperty"),
          ),
        ),
      );
    }
  }
}

export class NodeShapeWithDefaultValueProperties {
  readonly falseBooleanProperty: boolean;
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly numberProperty: number;
  readonly stringProperty: string;
  readonly trueBooleanProperty: boolean;
  readonly type = "NodeShapeWithDefaultValueProperties" as const;

  constructor(parameters: {
    readonly falseBooleanProperty?: boolean;
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
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

    this._identifier = parameters.identifier;
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

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.falseBooleanProperty.toString());
    _hasher.update(this.numberProperty.toString());
    _hasher.update(this.stringProperty);
    _hasher.update(this.trueBooleanProperty.toString());
    return _hasher;
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

export class NonClassNodeShape {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly stringProperty: string;
  readonly type = "NonClassNodeShape" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this._identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty);
    return _hasher;
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
  private _identifier: rdfjs.NamedNode | undefined;
  readonly stringProperty: string;
  readonly type = "IriNodeShape" as const;

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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty);
    return _hasher;
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
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly stringProperty: string;
  readonly type = "InlineNodeShape" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this._identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty);
    return _hasher;
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

export class ExternNodeShape {
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly stringProperty: string;
  readonly type = "ExternNodeShape" as const;

  constructor(parameters: {
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly stringProperty: string;
  }) {
    this._identifier = parameters.identifier;
    this.stringProperty = parameters.stringProperty;
  }

  get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.stringProperty);
    return _hasher;
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

export class ExterningAndInliningNodeShape {
  readonly externProperty: rdfjs.BlankNode | rdfjs.NamedNode;
  private _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly inlineProperty: InlineNodeShape;
  readonly type = "ExterningAndInliningNodeShape" as const;

  constructor(parameters: {
    readonly externProperty: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    readonly inlineProperty: InlineNodeShape;
  }) {
    this.externProperty = parameters.externProperty;
    this._identifier = parameters.identifier;
    this.inlineProperty = parameters.inlineProperty;
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
  >(_hasher: HasherT): HasherT {
    _hasher.update(
      rdfjsResource.Resource.Identifier.toString(this.externProperty),
    );
    this.inlineProperty.hash(_hasher);
    return _hasher;
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

abstract class AbstractBaseClassWithPropertiesNodeShape {
  readonly abcStringProperty: string;
  abstract readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  abstract readonly type:
    | "ConcreteChildClassNodeShape"
    | "ConcreteParentClassNodeShape";

  constructor(parameters: { readonly abcStringProperty: string }) {
    this.abcStringProperty = parameters.abcStringProperty;
  }

  equals(
    other: AbstractBaseClassWithPropertiesNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(this, other, {
      abcStringProperty: purifyHelpers.Equatable.strictEquals,
      identifier: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    _hasher.update(this.abcStringProperty);
    return _hasher;
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
    { abcStringProperty: string; identifier: rdfjs.BlankNode | rdfjs.NamedNode }
  > {
    const _abcStringPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/abcStringProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_abcStringPropertyEither.isLeft()) {
      return _abcStringPropertyEither;
    }

    const abcStringProperty = _abcStringPropertyEither.unsafeCoerce();
    const identifier = _resource.identifier;
    return purify.Either.of({ abcStringProperty, identifier });
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {
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

abstract class AbstractBaseClassWithoutPropertiesNodeShape extends AbstractBaseClassWithPropertiesNodeShape {
  abstract override readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  abstract override readonly type:
    | "ConcreteChildClassNodeShape"
    | "ConcreteParentClassNodeShape";

  override toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }): rdfjsResource.MutableResource {
    const _resource = super.toRdf({ mutateGraph, resourceSet });
    return _resource;
  }
}

namespace AbstractBaseClassWithoutPropertiesNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { abcStringProperty: string; identifier: rdfjs.BlankNode | rdfjs.NamedNode }
  > {
    return AbstractBaseClassWithPropertiesNodeShape.fromRdf(_resource).chain(
      (_super) => {
        const identifier = _resource.identifier;
        return purify.Either.of({
          abcStringProperty: _super.abcStringProperty,
          identifier,
        });
      },
    );
  }

  export class SparqlGraphPatterns extends AbstractBaseClassWithPropertiesNodeShape.SparqlGraphPatterns {}
}

export class ConcreteParentClassNodeShape extends AbstractBaseClassWithoutPropertiesNodeShape {
  protected _identifier: rdfjs.BlankNode | rdfjs.NamedNode | undefined;
  readonly parentStringProperty: string;
  override readonly type:
    | "ConcreteChildClassNodeShape"
    | "ConcreteParentClassNodeShape" = "ConcreteParentClassNodeShape";

  constructor(
    parameters: {
      readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
      readonly parentStringProperty: string;
    } & ConstructorParameters<
      typeof AbstractBaseClassWithoutPropertiesNodeShape
    >[0],
  ) {
    super(parameters);
    this._identifier = parameters.identifier;
    this.parentStringProperty = parameters.parentStringProperty;
  }

  override get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  override equals(
    other: ConcreteParentClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        parentStringProperty: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    super.hash(_hasher);
    _hasher.update(this.parentStringProperty);
    return _hasher;
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
    return AbstractBaseClassWithoutPropertiesNodeShape.fromRdf(_resource).chain(
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
        const identifier = _resource.identifier;
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
            identifier,
            abcStringProperty: _super.abcStringProperty,
            parentStringProperty,
          }),
        );
      },
    );
  }

  export class SparqlGraphPatterns extends AbstractBaseClassWithoutPropertiesNodeShape.SparqlGraphPatterns {
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
      readonly identifier?: rdfjs.BlankNode | rdfjs.NamedNode;
    } & ConstructorParameters<typeof ConcreteParentClassNodeShape>[0],
  ) {
    super(parameters);
    this.childStringProperty = parameters.childStringProperty;
  }

  override get identifier(): rdfjs.BlankNode | rdfjs.NamedNode {
    if (typeof this._identifier === "undefined") {
      this._identifier = dataFactory.namedNode(
        `urn:shaclmate:object:${this.type}:${this.hash(sha256.create())}`,
      );
    }
    return this._identifier;
  }

  override equals(
    other: ConcreteChildClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return super.equals(other).chain(() =>
      purifyHelpers.Equatable.objectEquals(this, other, {
        childStringProperty: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    super.hash(_hasher);
    _hasher.update(this.childStringProperty);
    return _hasher;
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
      const identifier = _resource.identifier;
      return purify.Either.of(
        new ConcreteChildClassNodeShape({
          identifier,
          parentStringProperty: _super.parentStringProperty,
          abcStringProperty: _super.abcStringProperty,
          childStringProperty,
        }),
      );
    });
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
