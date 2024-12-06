import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
// @ts-ignore
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";

export interface UuidV4IriNodeShape {
  readonly identifier: rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "UuidV4IriNodeShape";
}

export namespace UuidV4IriNodeShape {
  export function equals(
    left: UuidV4IriNodeShape,
    right: UuidV4IriNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.NamedNode;
      stringProperty: string;
      type: "UuidV4IriNodeShape";
    }
  > {
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
    const type = "UuidV4IriNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_uuidV4IriNodeShape: UuidV4IriNodeShape, _hasher: HasherT): HasherT {
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

  export function toRdf(
    uuidV4IriNodeShape: UuidV4IriNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: uuidV4IriNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      uuidV4IriNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface Sha256IriNodeShape {
  readonly identifier: rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "Sha256IriNodeShape";
}

export namespace Sha256IriNodeShape {
  export function equals(
    left: Sha256IriNodeShape,
    right: Sha256IriNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.NamedNode;
      stringProperty: string;
      type: "Sha256IriNodeShape";
    }
  > {
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
    const type = "Sha256IriNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_sha256IriNodeShape: Sha256IriNodeShape, _hasher: HasherT): HasherT {
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

  export function toRdf(
    sha256IriNodeShape: Sha256IriNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: sha256IriNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      sha256IriNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface OrNodeShapeMember2 {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty2: string;
  readonly type: "OrNodeShapeMember2";
}

export namespace OrNodeShapeMember2 {
  export function equals(
    left: OrNodeShapeMember2,
    right: OrNodeShapeMember2,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty2: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      stringProperty2: string;
      type: "OrNodeShapeMember2";
    }
  > {
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
    const type = "OrNodeShapeMember2" as const;
    return purify.Either.of({ identifier, stringProperty2, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_orNodeShapeMember2: OrNodeShapeMember2, _hasher: HasherT): HasherT {
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

  export function toRdf(
    orNodeShapeMember2: OrNodeShapeMember2,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: orNodeShapeMember2.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty2"),
      orNodeShapeMember2.stringProperty2,
    );
    return _resource;
  }
}

export interface OrNodeShapeMember1 {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty1: string;
  readonly type: "OrNodeShapeMember1";
}

export namespace OrNodeShapeMember1 {
  export function equals(
    left: OrNodeShapeMember1,
    right: OrNodeShapeMember1,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty1: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      stringProperty1: string;
      type: "OrNodeShapeMember1";
    }
  > {
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
    const type = "OrNodeShapeMember1" as const;
    return purify.Either.of({ identifier, stringProperty1, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_orNodeShapeMember1: OrNodeShapeMember1, _hasher: HasherT): HasherT {
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

  export function toRdf(
    orNodeShapeMember1: OrNodeShapeMember1,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: orNodeShapeMember1.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty1"),
      orNodeShapeMember1.stringProperty1,
    );
    return _resource;
  }
}

export interface NodeShapeWithPropertyCardinalities {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly optionalStringProperty: purify.Maybe<string>;
  readonly requiredStringProperty: string;
  readonly setStringProperty: readonly string[];
  readonly type: "NodeShapeWithPropertyCardinalities";
}

export namespace NodeShapeWithPropertyCardinalities {
  export function equals(
    left: NodeShapeWithPropertyCardinalities,
    right: NodeShapeWithPropertyCardinalities,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
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

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      optionalStringProperty: purify.Maybe<string>;
      requiredStringProperty: string;
      setStringProperty: readonly string[];
      type: "NodeShapeWithPropertyCardinalities";
    }
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
    const type = "NodeShapeWithPropertyCardinalities" as const;
    return purify.Either.of({
      identifier,
      optionalStringProperty,
      requiredStringProperty,
      setStringProperty,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithPropertyCardinalities: NodeShapeWithPropertyCardinalities,
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

  export function toRdf(
    nodeShapeWithPropertyCardinalities: NodeShapeWithPropertyCardinalities,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithPropertyCardinalities.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/optionalStringProperty"),
      nodeShapeWithPropertyCardinalities.optionalStringProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/requiredStringProperty"),
      nodeShapeWithPropertyCardinalities.requiredStringProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/setStringProperty"),
      nodeShapeWithPropertyCardinalities.setStringProperty,
    );
    return _resource;
  }
}

export interface NodeShapeWithOrProperties {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly orLiteralsProperty: purify.Maybe<rdfjs.Literal>;
  readonly orTermsProperty: purify.Maybe<rdfjs.Literal | rdfjs.NamedNode>;
  readonly orUnrelatedProperty: purify.Maybe<
    | { type: "0-number"; value: number }
    | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
  >;
  readonly type: "NodeShapeWithOrProperties";
}

export namespace NodeShapeWithOrProperties {
  export function equals(
    left: NodeShapeWithOrProperties,
    right: NodeShapeWithOrProperties,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
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

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      orLiteralsProperty: purify.Maybe<rdfjs.Literal>;
      orTermsProperty: purify.Maybe<rdfjs.Literal | rdfjs.NamedNode>;
      orUnrelatedProperty: purify.Maybe<
        | { type: "0-number"; value: number }
        | { type: "1-rdfjs.NamedNode"; value: rdfjs.NamedNode }
      >;
      type: "NodeShapeWithOrProperties";
    }
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
    const type = "NodeShapeWithOrProperties" as const;
    return purify.Either.of({
      identifier,
      orLiteralsProperty,
      orTermsProperty,
      orUnrelatedProperty,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithOrProperties: NodeShapeWithOrProperties,
    _hasher: HasherT,
  ): HasherT {
    _nodeShapeWithOrProperties.orLiteralsProperty.ifJust((_value) => {
      _hasher.update(_value.value);
    });
    _nodeShapeWithOrProperties.orTermsProperty.ifJust((_value) => {
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
    _nodeShapeWithOrProperties.orUnrelatedProperty.ifJust((_value) => {
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

  export function toRdf(
    nodeShapeWithOrProperties: NodeShapeWithOrProperties,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithOrProperties.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/orLiteralsProperty"),
      nodeShapeWithOrProperties.orLiteralsProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/orTermsProperty"),
      nodeShapeWithOrProperties.orTermsProperty.map((_value) =>
        _value.termType === "NamedNode" ? _value : _value,
      ),
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/orUnrelatedProperty"),
      nodeShapeWithOrProperties.orUnrelatedProperty.map((_value) =>
        _value.type === "1-rdfjs.NamedNode" ? _value.value : _value.value,
      ),
    );
    return _resource;
  }
}

export interface NodeShapeWithListProperty {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly listProperty: readonly string[];
  readonly type: "NodeShapeWithListProperty";
}

export namespace NodeShapeWithListProperty {
  export function equals(
    left: NodeShapeWithListProperty,
    right: NodeShapeWithListProperty,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
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

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      listProperty: readonly string[];
      type: "NodeShapeWithListProperty";
    }
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
    const type = "NodeShapeWithListProperty" as const;
    return purify.Either.of({ identifier, listProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithListProperty: NodeShapeWithListProperty,
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

  export function toRdf(
    nodeShapeWithListProperty: NodeShapeWithListProperty,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithListProperty.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/listProperty"),
      nodeShapeWithListProperty.listProperty.reduce(
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

          if (itemIndex + 1 === nodeShapeWithListProperty.listProperty.length) {
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

export interface NodeShapeWithInProperties {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly inBooleansProperty: purify.Maybe<true>;
  readonly inIrisProperty: purify.Maybe<
    rdfjs.NamedNode<
      | "http://example.com/NodeShapeWithInPropertiesIri1"
      | "http://example.com/NodeShapeWithInPropertiesIri2"
    >
  >;
  readonly inNumbersProperty: purify.Maybe<1 | 2>;
  readonly inStringsProperty: purify.Maybe<"text" | "html">;
  readonly type: "NodeShapeWithInProperties";
}

export namespace NodeShapeWithInProperties {
  export function equals(
    left: NodeShapeWithInProperties,
    right: NodeShapeWithInProperties,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
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

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      inBooleansProperty: purify.Maybe<true>;
      inIrisProperty: purify.Maybe<
        rdfjs.NamedNode<
          | "http://example.com/NodeShapeWithInPropertiesIri1"
          | "http://example.com/NodeShapeWithInPropertiesIri2"
        >
      >;
      inNumbersProperty: purify.Maybe<1 | 2>;
      inStringsProperty: purify.Maybe<"text" | "html">;
      type: "NodeShapeWithInProperties";
    }
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
    const type = "NodeShapeWithInProperties" as const;
    return purify.Either.of({
      identifier,
      inBooleansProperty,
      inIrisProperty,
      inNumbersProperty,
      inStringsProperty,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithInProperties: NodeShapeWithInProperties,
    _hasher: HasherT,
  ): HasherT {
    _nodeShapeWithInProperties.inBooleansProperty.ifJust((_value) => {
      _hasher.update(_value.toString());
    });
    _nodeShapeWithInProperties.inIrisProperty.ifJust((_value) => {
      _hasher.update(rdfjsResource.Resource.Identifier.toString(_value));
    });
    _nodeShapeWithInProperties.inNumbersProperty.ifJust((_value) => {
      _hasher.update(_value.toString());
    });
    _nodeShapeWithInProperties.inStringsProperty.ifJust((_value) => {
      _hasher.update(_value);
    });
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

  export function toRdf(
    nodeShapeWithInProperties: NodeShapeWithInProperties,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithInProperties.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/inBooleansProperty"),
      nodeShapeWithInProperties.inBooleansProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inIrisProperty"),
      nodeShapeWithInProperties.inIrisProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inNumbersProperty"),
      nodeShapeWithInProperties.inNumbersProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inStringsProperty"),
      nodeShapeWithInProperties.inStringsProperty,
    );
    return _resource;
  }
}

export interface NodeShapeWithDefaultValueProperties {
  readonly falseBooleanProperty: boolean;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly numberProperty: number;
  readonly stringProperty: string;
  readonly trueBooleanProperty: boolean;
  readonly type: "NodeShapeWithDefaultValueProperties";
}

export namespace NodeShapeWithDefaultValueProperties {
  export function equals(
    left: NodeShapeWithDefaultValueProperties,
    right: NodeShapeWithDefaultValueProperties,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      falseBooleanProperty: purifyHelpers.Equatable.strictEquals,
      identifier: purifyHelpers.Equatable.booleanEquals,
      numberProperty: purifyHelpers.Equatable.strictEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      trueBooleanProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      falseBooleanProperty: boolean;
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      numberProperty: number;
      stringProperty: string;
      trueBooleanProperty: boolean;
      type: "NodeShapeWithDefaultValueProperties";
    }
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
    const type = "NodeShapeWithDefaultValueProperties" as const;
    return purify.Either.of({
      falseBooleanProperty,
      identifier,
      numberProperty,
      stringProperty,
      trueBooleanProperty,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithDefaultValueProperties: NodeShapeWithDefaultValueProperties,
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

  export function toRdf(
    nodeShapeWithDefaultValueProperties: NodeShapeWithDefaultValueProperties,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithDefaultValueProperties.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/falseBooleanProperty"),
      nodeShapeWithDefaultValueProperties.falseBooleanProperty
        ? true
        : undefined,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/numberProperty"),
      nodeShapeWithDefaultValueProperties.numberProperty !== 0
        ? nodeShapeWithDefaultValueProperties.numberProperty
        : undefined,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      nodeShapeWithDefaultValueProperties.stringProperty !== ""
        ? nodeShapeWithDefaultValueProperties.stringProperty
        : undefined,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/trueBooleanProperty"),
      !nodeShapeWithDefaultValueProperties.trueBooleanProperty
        ? false
        : undefined,
    );
    return _resource;
  }
}

export interface NonClassNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "NonClassNodeShape";
}

export namespace NonClassNodeShape {
  export function equals(
    left: NonClassNodeShape,
    right: NonClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      stringProperty: string;
      type: "NonClassNodeShape";
    }
  > {
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
    const type = "NonClassNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_nonClassNodeShape: NonClassNodeShape, _hasher: HasherT): HasherT {
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

  export function toRdf(
    nonClassNodeShape: NonClassNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nonClassNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      nonClassNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface IriNodeShape {
  readonly identifier: rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "IriNodeShape";
}

export namespace IriNodeShape {
  export function equals(
    left: IriNodeShape,
    right: IriNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.NamedNode;
      stringProperty: string;
      type: "IriNodeShape";
    }
  > {
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
    const type = "IriNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_iriNodeShape: IriNodeShape, _hasher: HasherT): HasherT {
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

  export function toRdf(
    iriNodeShape: IriNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: iriNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      iriNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface InlineNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "InlineNodeShape";
}

export namespace InlineNodeShape {
  export function equals(
    left: InlineNodeShape,
    right: InlineNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      stringProperty: string;
      type: "InlineNodeShape";
    }
  > {
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
    const type = "InlineNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_inlineNodeShape: InlineNodeShape, _hasher: HasherT): HasherT {
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

  export function toRdf(
    inlineNodeShape: InlineNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: inlineNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      inlineNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface ExternNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "ExternNodeShape";
}

export namespace ExternNodeShape {
  export function equals(
    left: ExternNodeShape,
    right: ExternNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      stringProperty: purifyHelpers.Equatable.strictEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      stringProperty: string;
      type: "ExternNodeShape";
    }
  > {
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
    const type = "ExternNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_externNodeShape: ExternNodeShape, _hasher: HasherT): HasherT {
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

  export function toRdf(
    externNodeShape: ExternNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: externNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      externNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface ExterningAndInliningNodeShape {
  readonly externProperty: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly inlineProperty: InlineNodeShape;
  readonly type: "ExterningAndInliningNodeShape";
}

export namespace ExterningAndInliningNodeShape {
  export function equals(
    left: ExterningAndInliningNodeShape,
    right: ExterningAndInliningNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      externProperty: purifyHelpers.Equatable.booleanEquals,
      identifier: purifyHelpers.Equatable.booleanEquals,
      inlineProperty: InlineNodeShape.equals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      externProperty: rdfjs.BlankNode | rdfjs.NamedNode;
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      inlineProperty: InlineNodeShape;
      type: "ExterningAndInliningNodeShape";
    }
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
    const type = "ExterningAndInliningNodeShape" as const;
    return purify.Either.of({
      externProperty,
      identifier,
      inlineProperty,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _externingAndInliningNodeShape: ExterningAndInliningNodeShape,
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

  export function toRdf(
    externingAndInliningNodeShape: ExterningAndInliningNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: externingAndInliningNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/externProperty"),
      externingAndInliningNodeShape.externProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/inlineProperty"),
      InlineNodeShape.toRdf(externingAndInliningNodeShape.inlineProperty, {
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }).identifier,
    );
    return _resource;
  }
}

export interface AbstractBaseClassWithoutPropertiesNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "ConcreteChildClassNodeShape" | "ConcreteParentClassNodeShape";
}

namespace AbstractBaseClassWithoutPropertiesNodeShape {
  export function equals(
    left: AbstractBaseClassWithoutPropertiesNodeShape,
    right: AbstractBaseClassWithoutPropertiesNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

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
    _abstractBaseClassWithoutPropertiesNodeShape: AbstractBaseClassWithoutPropertiesNodeShape,
    _hasher: HasherT,
  ): HasherT {
    return _hasher;
  }

  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {}

  export function toRdf(
    abstractBaseClassWithoutPropertiesNodeShape: AbstractBaseClassWithoutPropertiesNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: abstractBaseClassWithoutPropertiesNodeShape.identifier,
      mutateGraph,
    });
    return _resource;
  }
}

export interface AbstractBaseClassWithPropertiesNodeShape
  extends AbstractBaseClassWithoutPropertiesNodeShape {
  readonly abcStringProperty: string;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "ConcreteChildClassNodeShape" | "ConcreteParentClassNodeShape";
}

namespace AbstractBaseClassWithPropertiesNodeShape {
  export function equals(
    left: AbstractBaseClassWithPropertiesNodeShape,
    right: AbstractBaseClassWithPropertiesNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return AbstractBaseClassWithoutPropertiesNodeShape.equals(
      left,
      right,
    ).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
        abcStringProperty: purifyHelpers.Equatable.strictEquals,
        identifier: purifyHelpers.Equatable.booleanEquals,
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

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
        const identifier = _resource.identifier;
        return purify.Either.of({ identifier, abcStringProperty });
      },
    );
  }

  export function hashAbstractBaseClassWithPropertiesNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _abstractBaseClassWithPropertiesNodeShape: AbstractBaseClassWithPropertiesNodeShape,
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

  export function toRdf(
    abstractBaseClassWithPropertiesNodeShape: AbstractBaseClassWithPropertiesNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = AbstractBaseClassWithoutPropertiesNodeShape.toRdf(
      abstractBaseClassWithPropertiesNodeShape,
      { mutateGraph, resourceSet },
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/abcStringProperty"),
      abstractBaseClassWithPropertiesNodeShape.abcStringProperty,
    );
    return _resource;
  }
}

export interface ConcreteParentClassNodeShape
  extends AbstractBaseClassWithPropertiesNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly parentStringProperty: string;
  readonly type: "ConcreteChildClassNodeShape" | "ConcreteParentClassNodeShape";
}

export namespace ConcreteParentClassNodeShape {
  export function equals(
    left: ConcreteParentClassNodeShape,
    right: ConcreteParentClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return AbstractBaseClassWithPropertiesNodeShape.equals(left, right).chain(
      () =>
        purifyHelpers.Equatable.objectEquals(left, right, {
          identifier: purifyHelpers.Equatable.booleanEquals,
          parentStringProperty: purifyHelpers.Equatable.strictEquals,
          type: purifyHelpers.Equatable.strictEquals,
        }),
    );
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      abcStringProperty: string;
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      parentStringProperty: string;
      type: "ConcreteChildClassNodeShape" | "ConcreteParentClassNodeShape";
    }
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
        const type = "ConcreteParentClassNodeShape" as const;
        return purify.Either.of({
          abcStringProperty: _super.abcStringProperty,
          identifier,
          parentStringProperty,
          type,
        });
      },
    );
  }

  export function hashConcreteParentClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _concreteParentClassNodeShape: ConcreteParentClassNodeShape,
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

  export function toRdf(
    concreteParentClassNodeShape: ConcreteParentClassNodeShape,
    {
      ignoreRdfType,
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = AbstractBaseClassWithPropertiesNodeShape.toRdf(
      concreteParentClassNodeShape,
      { mutateGraph, resourceSet },
    );
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
      concreteParentClassNodeShape.parentStringProperty,
    );
    return _resource;
  }
}

export interface ConcreteChildClassNodeShape
  extends ConcreteParentClassNodeShape {
  readonly childStringProperty: string;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "ConcreteChildClassNodeShape";
}

export namespace ConcreteChildClassNodeShape {
  export function equals(
    left: ConcreteChildClassNodeShape,
    right: ConcreteChildClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return ConcreteParentClassNodeShape.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
        childStringProperty: purifyHelpers.Equatable.strictEquals,
        identifier: purifyHelpers.Equatable.booleanEquals,
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      parentStringProperty: string;
      type: "ConcreteChildClassNodeShape";
      abcStringProperty: string;
      childStringProperty: string;
    }
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
      const type = "ConcreteChildClassNodeShape" as const;
      return purify.Either.of({
        identifier,
        parentStringProperty: _super.parentStringProperty,
        type,
        abcStringProperty: _super.abcStringProperty,
        childStringProperty,
      });
    });
  }

  export function hashConcreteChildClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _concreteChildClassNodeShape: ConcreteChildClassNodeShape,
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

  export function toRdf(
    concreteChildClassNodeShape: ConcreteChildClassNodeShape,
    {
      ignoreRdfType,
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = ConcreteParentClassNodeShape.toRdf(
      concreteChildClassNodeShape,
      { mutateGraph, ignoreRdfType: true, resourceSet },
    );
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
      concreteChildClassNodeShape.childStringProperty,
    );
    return _resource;
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
          return OrNodeShapeMember1.equals(
            left,
            right as unknown as OrNodeShapeMember1,
          );
        case "OrNodeShapeMember2":
          return OrNodeShapeMember2.equals(
            left,
            right as unknown as OrNodeShapeMember2,
          );
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
        return OrNodeShapeMember1.hash(orNodeShape, _hasher);
      case "OrNodeShapeMember2":
        return OrNodeShapeMember2.hash(orNodeShape, _hasher);
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
        return OrNodeShape.toRdf(orNodeShape, _parameters);
      case "OrNodeShapeMember2":
        return OrNodeShape.toRdf(orNodeShape, _parameters);
    }
  }
}
