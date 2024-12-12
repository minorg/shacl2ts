import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
// @ts-ignore
import * as rdfLiteral from "rdf-literal";
import * as rdfjsResource from "rdfjs-resource";
import { ImportedType } from "../ImportedType.js";
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty,
          right.stringProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty,
          right.stringProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty2,
          right.stringProperty2,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty1,
          right.stringProperty1,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
export interface NodeShapeWithPropertyVisibilities {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly privateProperty: string;
  readonly protectedProperty: string;
  readonly publicProperty: string;
  readonly type: "NodeShapeWithPropertyVisibilities";
}

export namespace NodeShapeWithPropertyVisibilities {
  export function equals(
    left: NodeShapeWithPropertyVisibilities,
    right: NodeShapeWithPropertyVisibilities,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.privateProperty,
          right.privateProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.protectedProperty,
          right.protectedProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.publicProperty,
          right.publicProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      privateProperty: string;
      protectedProperty: string;
      publicProperty: string;
      type: "NodeShapeWithPropertyVisibilities";
    }
  > {
    const identifier = _resource.identifier;
    const _privatePropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/privateProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_privatePropertyEither.isLeft()) {
      return _privatePropertyEither;
    }

    const privateProperty = _privatePropertyEither.unsafeCoerce();
    const _protectedPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/publicProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_protectedPropertyEither.isLeft()) {
      return _protectedPropertyEither;
    }

    const protectedProperty = _protectedPropertyEither.unsafeCoerce();
    const _publicPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      string
    > = _resource
      .values(dataFactory.namedNode("http://example.com/publicProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toString());
    if (_publicPropertyEither.isLeft()) {
      return _publicPropertyEither;
    }

    const publicProperty = _publicPropertyEither.unsafeCoerce();
    const type = "NodeShapeWithPropertyVisibilities" as const;
    return purify.Either.of({
      identifier,
      privateProperty,
      protectedProperty,
      publicProperty,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithPropertyVisibilities: NodeShapeWithPropertyVisibilities,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_nodeShapeWithPropertyVisibilities.privateProperty);
    _hasher.update(_nodeShapeWithPropertyVisibilities.protectedProperty);
    _hasher.update(_nodeShapeWithPropertyVisibilities.publicProperty);
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
          dataFactory.namedNode("http://example.com/privateProperty"),
          this.variable("PrivateProperty"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/publicProperty"),
          this.variable("ProtectedProperty"),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/publicProperty"),
          this.variable("PublicProperty"),
        ),
      );
    }
  }

  export function toRdf(
    nodeShapeWithPropertyVisibilities: NodeShapeWithPropertyVisibilities,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithPropertyVisibilities.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/privateProperty"),
      nodeShapeWithPropertyVisibilities.privateProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/publicProperty"),
      nodeShapeWithPropertyVisibilities.protectedProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/publicProperty"),
      nodeShapeWithPropertyVisibilities.publicProperty,
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.optionalStringProperty,
          right.optionalStringProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.requiredStringProperty,
          right.requiredStringProperty,
        ),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.strictEquals,
          ))(left.setStringProperty, right.setStringProperty),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
      (_value0) => {
        _hasher.update(_value0);
      },
    );
    _hasher.update(_nodeShapeWithPropertyCardinalities.requiredStringProperty);
    for (const _element0 of _nodeShapeWithPropertyCardinalities.setStringProperty) {
      _hasher.update(_element0);
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(left.orLiteralsProperty, right.orLiteralsProperty),
      )
      .chain(() =>
        ((left, right) =>
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
          ))(left.orTermsProperty, right.orTermsProperty),
      )
      .chain(() =>
        ((left, right) =>
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
          ))(left.orUnrelatedProperty, right.orUnrelatedProperty),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    _nodeShapeWithOrProperties.orLiteralsProperty.ifJust((_value0) => {
      _hasher.update(_value0.value);
    });
    _nodeShapeWithOrProperties.orTermsProperty.ifJust((_value0) => {
      switch (_value0.termType) {
        case "Literal": {
          _hasher.update(_value0.value);
          break;
        }
        case "NamedNode": {
          _hasher.update(rdfjsResource.Resource.Identifier.toString(_value0));
          break;
        }
      }
    });
    _nodeShapeWithOrProperties.orUnrelatedProperty.ifJust((_value0) => {
      switch (_value0.type) {
        case "0-number": {
          _hasher.update(_value0.value.toString());
          break;
        }
        case "1-rdfjs.NamedNode": {
          _hasher.update(
            rdfjsResource.Resource.Identifier.toString(_value0.value),
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
export interface NodeShapeWithImportedTypes {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly importedTypeProperty: ImportedType;
  readonly type: "NodeShapeWithImportedTypes";
}

export namespace NodeShapeWithImportedTypes {
  export function equals(
    left: NodeShapeWithImportedTypes,
    right: NodeShapeWithImportedTypes,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        ImportedType.equals(
          left.importedTypeProperty,
          right.importedTypeProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      importedTypeProperty: ImportedType;
      type: "NodeShapeWithImportedTypes";
    }
  > {
    const identifier = _resource.identifier;
    const _importedTypePropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      ImportedType
    > = _resource
      .values(
        dataFactory.namedNode("http://example.com/importedTypeProperty"),
        { unique: true },
      )
      .head()
      .chain((value) => value.toResource())
      .chain((_resource) => ImportedType.fromRdf(_resource));
    if (_importedTypePropertyEither.isLeft()) {
      return _importedTypePropertyEither;
    }

    const importedTypeProperty = _importedTypePropertyEither.unsafeCoerce();
    const type = "NodeShapeWithImportedTypes" as const;
    return purify.Either.of({ identifier, importedTypeProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithImportedTypes: NodeShapeWithImportedTypes,
    _hasher: HasherT,
  ): HasherT {
    ImportedType.hash(
      _nodeShapeWithImportedTypes.importedTypeProperty,
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
        sparqlBuilder.GraphPattern.group(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/importedTypeProperty"),
            this.variable("ImportedTypeProperty"),
          ).chainObject(
            (_object) => new ImportedType.SparqlGraphPatterns(_object),
          ),
        ),
      );
    }
  }

  export function toRdf(
    nodeShapeWithImportedTypes: NodeShapeWithImportedTypes,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithImportedTypes.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/importedTypeProperty"),
      ImportedType.toRdf(nodeShapeWithImportedTypes.importedTypeProperty, {
        mutateGraph: mutateGraph,
        resourceSet: resourceSet,
      }),
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.strictEquals,
          ))(left.listProperty, right.listProperty),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    for (const _element0 of _nodeShapeWithListProperty.listProperty) {
      _hasher.update(_element0);
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
  readonly inDateTimesProperty: purify.Maybe<Date>;
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.inBooleansProperty,
          right.inBooleansProperty,
        ),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(left, right, (left, right) =>
            purifyHelpers.Equatable.EqualsResult.fromBooleanEqualsResult(
              left,
              right,
              left.getTime() === right.getTime(),
            ),
          ))(left.inDateTimesProperty, right.inDateTimesProperty),
      )
      .chain(() =>
        ((left, right) =>
          purifyHelpers.Maybes.equals(
            left,
            right,
            purifyHelpers.Equatable.booleanEquals,
          ))(left.inIrisProperty, right.inIrisProperty),
      )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.inNumbersProperty,
          right.inNumbersProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.inStringsProperty,
          right.inStringsProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      inBooleansProperty: purify.Maybe<true>;
      inDateTimesProperty: purify.Maybe<Date>;
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
    const _inDateTimesPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<Date>
    > = purify.Either.of(
      _resource
        .values(
          dataFactory.namedNode("http://example.com/inDateTimesProperty"),
          { unique: true },
        )
        .head()
        .chain((_value) =>
          _value.toDate().chain((value) => {
            if (value.getTime() === 1523268000000) {
              return purify.Either.of(value);
            }
            return purify.Left(
              new rdfjsResource.Resource.MistypedValueError({
                actualValue: rdfLiteral.toRdf(value),
                expectedValueType: "Date",
                focusResource: _resource,
                predicate: dataFactory.namedNode(
                  "http://example.com/inDateTimesProperty",
                ),
              }),
            );
          }),
        )
        .toMaybe(),
    );
    if (_inDateTimesPropertyEither.isLeft()) {
      return _inDateTimesPropertyEither;
    }

    const inDateTimesProperty = _inDateTimesPropertyEither.unsafeCoerce();
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
      inDateTimesProperty,
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
    _nodeShapeWithInProperties.inBooleansProperty.ifJust((_value0) => {
      _hasher.update(_value0.toString());
    });
    _nodeShapeWithInProperties.inDateTimesProperty.ifJust((_value0) => {
      _hasher.update(_value0.toISOString());
    });
    _nodeShapeWithInProperties.inIrisProperty.ifJust((_value0) => {
      _hasher.update(rdfjsResource.Resource.Identifier.toString(_value0));
    });
    _nodeShapeWithInProperties.inNumbersProperty.ifJust((_value0) => {
      _hasher.update(_value0.toString());
    });
    _nodeShapeWithInProperties.inStringsProperty.ifJust((_value0) => {
      _hasher.update(_value0);
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
            dataFactory.namedNode("http://example.com/inDateTimesProperty"),
            this.variable("InDateTimesProperty"),
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
      dataFactory.namedNode("http://example.com/inDateTimesProperty"),
      nodeShapeWithInProperties.inDateTimesProperty,
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
export interface NodeShapeWithHasValueProperties {
  readonly hasIriProperty: purify.Maybe<rdfjs.NamedNode>;
  readonly hasLiteralProperty: purify.Maybe<string>;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "NodeShapeWithHasValueProperties";
}

export namespace NodeShapeWithHasValueProperties {
  export function equals(
    left: NodeShapeWithHasValueProperties,
    right: NodeShapeWithHasValueProperties,
  ): purifyHelpers.Equatable.EqualsResult {
    return ((left, right) =>
      purifyHelpers.Maybes.equals(
        left,
        right,
        purifyHelpers.Equatable.booleanEquals,
      ))(left.hasIriProperty, right.hasIriProperty)
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.hasLiteralProperty,
          right.hasLiteralProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.identifier,
          right.identifier,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      hasIriProperty: purify.Maybe<rdfjs.NamedNode>;
      hasLiteralProperty: purify.Maybe<string>;
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      type: "NodeShapeWithHasValueProperties";
    }
  > {
    const _hasIriPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<rdfjs.NamedNode>
    > = purify.Either.of(
      _resource
        .values(dataFactory.namedNode("http://example.com/hasIriProperty"), {
          unique: true,
        })
        .find((_value) =>
          _value
            .toTerm()
            .equals(
              dataFactory.namedNode(
                "http://example.com/NodeShapeWithHasValuePropertiesIri1",
              ),
            ),
        )
        .chain((_value) => _value.toIri())
        .toMaybe(),
    );
    if (_hasIriPropertyEither.isLeft()) {
      return _hasIriPropertyEither;
    }

    const hasIriProperty = _hasIriPropertyEither.unsafeCoerce();
    const _hasLiteralPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      purify.Maybe<string>
    > = purify.Either.of(
      _resource
        .values(
          dataFactory.namedNode("http://example.com/hasLiteralProperty"),
          { unique: true },
        )
        .find((_value) =>
          _value.toTerm().equals(dataFactory.literal("test", "")),
        )
        .chain((_value) => _value.toString())
        .toMaybe(),
    );
    if (_hasLiteralPropertyEither.isLeft()) {
      return _hasLiteralPropertyEither;
    }

    const hasLiteralProperty = _hasLiteralPropertyEither.unsafeCoerce();
    const identifier = _resource.identifier;
    const type = "NodeShapeWithHasValueProperties" as const;
    return purify.Either.of({
      hasIriProperty,
      hasLiteralProperty,
      identifier,
      type,
    });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _nodeShapeWithHasValueProperties: NodeShapeWithHasValueProperties,
    _hasher: HasherT,
  ): HasherT {
    _nodeShapeWithHasValueProperties.hasIriProperty.ifJust((_value0) => {
      _hasher.update(rdfjsResource.Resource.Identifier.toString(_value0));
    });
    _nodeShapeWithHasValueProperties.hasLiteralProperty.ifJust((_value0) => {
      _hasher.update(_value0);
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
            dataFactory.namedNode("http://example.com/hasIriProperty"),
            this.variable("HasIriProperty"),
          ),
        ),
      );
      this.add(
        sparqlBuilder.GraphPattern.optional(
          sparqlBuilder.GraphPattern.basic(
            this.subject,
            dataFactory.namedNode("http://example.com/hasLiteralProperty"),
            this.variable("HasLiteralProperty"),
          ),
        ),
      );
    }
  }

  export function toRdf(
    nodeShapeWithHasValueProperties: NodeShapeWithHasValueProperties,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithHasValueProperties.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/hasIriProperty"),
      nodeShapeWithHasValueProperties.hasIriProperty,
    );
    _resource.add(
      dataFactory.namedNode("http://example.com/hasLiteralProperty"),
      nodeShapeWithHasValueProperties.hasLiteralProperty,
    );
    return _resource;
  }
}
export interface NodeShapeWithDefaultValueProperties {
  readonly dateTimeProperty: Date;
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
    return ((left, right) =>
      purifyHelpers.Equatable.EqualsResult.fromBooleanEqualsResult(
        left,
        right,
        left.getTime() === right.getTime(),
      ))(left.dateTimeProperty, right.dateTimeProperty)
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.falseBooleanProperty,
          right.falseBooleanProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.identifier,
          right.identifier,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.numberProperty,
          right.numberProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty,
          right.stringProperty,
        ),
      )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.trueBooleanProperty,
          right.trueBooleanProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      dateTimeProperty: Date;
      falseBooleanProperty: boolean;
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      numberProperty: number;
      stringProperty: string;
      trueBooleanProperty: boolean;
      type: "NodeShapeWithDefaultValueProperties";
    }
  > {
    const _dateTimePropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      Date
    > = _resource
      .values(dataFactory.namedNode("http://example.com/dateTimeProperty"), {
        unique: true,
      })
      .head()
      .alt(
        purify.Either.of(
          new rdfjsResource.Resource.Value({
            subject: _resource,
            predicate: dataFactory.namedNode(
              "http://example.com/dateTimeProperty",
            ),
            object: dataFactory.literal(
              "2018-04-09T10:00:00Z",
              dataFactory.namedNode(
                "http://www.w3.org/2001/XMLSchema#dateTime",
              ),
            ),
          }),
        ),
      )
      .chain((_value) => _value.toDate());
    if (_dateTimePropertyEither.isLeft()) {
      return _dateTimePropertyEither;
    }

    const dateTimeProperty = _dateTimePropertyEither.unsafeCoerce();
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
      dateTimeProperty,
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
      _nodeShapeWithDefaultValueProperties.dateTimeProperty.toISOString(),
    );
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
            dataFactory.namedNode("http://example.com/dateTimeProperty"),
            this.variable("DateTimeProperty"),
          ),
        ),
      );
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
      dataFactory.namedNode("http://example.com/dateTimeProperty"),
      nodeShapeWithDefaultValueProperties.dateTimeProperty.getTime() !==
        1523268000000
        ? nodeShapeWithDefaultValueProperties.dateTimeProperty
        : undefined,
    );
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty,
          right.stringProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty,
          right.stringProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty,
          right.stringProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    return purifyHelpers.Equatable.booleanEquals(
      left.identifier,
      right.identifier,
    )
      .chain(() =>
        purifyHelpers.Equatable.strictEquals(
          left.stringProperty,
          right.stringProperty,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
    return purifyHelpers.Equatable.booleanEquals(
      left.externProperty,
      right.externProperty,
    )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.identifier,
          right.identifier,
        ),
      )
      .chain(() =>
        InlineNodeShape.equals(left.inlineProperty, right.inlineProperty),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
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
      }),
    );
    return _resource;
  }
}
export interface AbstractBaseClassWithPropertiesNodeShape {
  readonly abcStringProperty: string;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "ConcreteChildClassNodeShape" | "ConcreteParentClassNodeShape";
}

namespace AbstractBaseClassWithPropertiesNodeShape {
  export function equals(
    left: AbstractBaseClassWithPropertiesNodeShape,
    right: AbstractBaseClassWithPropertiesNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.strictEquals(
      left.abcStringProperty,
      right.abcStringProperty,
    )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.identifier,
          right.identifier,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: object,
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

  export function hashAbstractBaseClassWithPropertiesNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _abstractBaseClassWithPropertiesNodeShape: AbstractBaseClassWithPropertiesNodeShape,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_abstractBaseClassWithPropertiesNodeShape.abcStringProperty);
    return _hasher;
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
    const _resource = resourceSet.mutableResource({
      identifier: abstractBaseClassWithPropertiesNodeShape.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/abcStringProperty"),
      abstractBaseClassWithPropertiesNodeShape.abcStringProperty,
    );
    return _resource;
  }
}
export interface AbstractBaseClassWithoutPropertiesNodeShape
  extends AbstractBaseClassWithPropertiesNodeShape {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "ConcreteChildClassNodeShape" | "ConcreteParentClassNodeShape";
}

namespace AbstractBaseClassWithoutPropertiesNodeShape {
  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: object,
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { abcStringProperty: string; identifier: rdfjs.BlankNode | rdfjs.NamedNode }
  > {
    return AbstractBaseClassWithPropertiesNodeShape.fromRdf(_resource, {
      ignoreRdfType: true,
    }).chain((_super) => {
      const identifier = _resource.identifier;
      return purify.Either.of({
        abcStringProperty: _super.abcStringProperty,
        identifier,
      });
    });
  }

  export function hashAbstractBaseClassWithoutPropertiesNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _abstractBaseClassWithoutPropertiesNodeShape: AbstractBaseClassWithoutPropertiesNodeShape,
    _hasher: HasherT,
  ): HasherT {
    AbstractBaseClassWithPropertiesNodeShape.hashAbstractBaseClassWithPropertiesNodeShape(
      _abstractBaseClassWithoutPropertiesNodeShape,
      _hasher,
    );
    return _hasher;
  }

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
    const _resource = AbstractBaseClassWithPropertiesNodeShape.toRdf(
      abstractBaseClassWithoutPropertiesNodeShape,
      { mutateGraph, resourceSet },
    );
    return _resource;
  }
}
export interface ConcreteParentClassNodeShape
  extends AbstractBaseClassWithoutPropertiesNodeShape {
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
        purifyHelpers.Equatable.strictEquals(
          left.parentStringProperty,
          right.parentStringProperty,
        ),
    );
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      abcStringProperty: string;
      parentStringProperty: string;
      type: "ConcreteChildClassNodeShape" | "ConcreteParentClassNodeShape";
    }
  > {
    return AbstractBaseClassWithoutPropertiesNodeShape.fromRdf(_resource, {
      ignoreRdfType: true,
    }).chain((_super) => {
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
        identifier,
        abcStringProperty: _super.abcStringProperty,
        parentStringProperty,
        type,
      });
    });
  }

  export function hashConcreteParentClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _concreteParentClassNodeShape: ConcreteParentClassNodeShape,
    _hasher: HasherT,
  ): HasherT {
    AbstractBaseClassWithoutPropertiesNodeShape.hashAbstractBaseClassWithoutPropertiesNodeShape(
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
    const _resource = AbstractBaseClassWithoutPropertiesNodeShape.toRdf(
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
      purifyHelpers.Equatable.strictEquals(
        left.childStringProperty,
        right.childStringProperty,
      ),
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
export interface AbstractBaseClassForImportedType {
  readonly abcStringProperty: string;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "ImportedType";
}

export namespace AbstractBaseClassForImportedType {
  export function equals(
    left: AbstractBaseClassForImportedType,
    right: AbstractBaseClassForImportedType,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.strictEquals(
      left.abcStringProperty,
      right.abcStringProperty,
    )
      .chain(() =>
        purifyHelpers.Equatable.booleanEquals(
          left.identifier,
          right.identifier,
        ),
      )
      .chain(() => purifyHelpers.Equatable.strictEquals(left.type, right.type));
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: object,
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

  export function hashAbstractBaseClassForImportedType<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _abstractBaseClassForImportedType: AbstractBaseClassForImportedType,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(_abstractBaseClassForImportedType.abcStringProperty);
    return _hasher;
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

  export function toRdf(
    abstractBaseClassForImportedType: AbstractBaseClassForImportedType,
    {
      mutateGraph,
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: abstractBaseClassForImportedType.identifier,
      mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/abcStringProperty"),
      abstractBaseClassForImportedType.abcStringProperty,
    );
    return _resource;
  }
}

export type OrNodeShape =
  | OrNodeShapeMember1
  | OrNodeShapeMember2
  | ImportedType;

export namespace OrNodeShape {
  export function equals(
    left: OrNodeShape,
    right: OrNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.strictEquals(left.type, right.type).chain(
      () => {
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
          case "ImportedType":
            return ImportedType.equals(left, right as unknown as ImportedType);
        }
      },
    );
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
    )
      .altLazy(
        () =>
          OrNodeShapeMember2.fromRdf(_resource, _options) as purify.Either<
            rdfjsResource.Resource.ValueError,
            OrNodeShape
          >,
      )
      .altLazy(
        () =>
          ImportedType.fromRdf(_resource, _options) as purify.Either<
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
      case "ImportedType":
        return ImportedType.hash(orNodeShape, _hasher);
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
          new ImportedType.SparqlGraphPatterns(
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
      case "ImportedType":
        return OrNodeShape.toRdf(orNodeShape, _parameters);
    }
  }
}
