import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

export interface AbstractBaseClassNodeShape {
  readonly abcStringProperty: string;
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "ChildClassNodeShape" | "ParentClassNodeShape";
}

namespace AbstractBaseClassNodeShape {
  export function equals(
    left: AbstractBaseClassNodeShape,
    right: AbstractBaseClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      abcStringProperty: purifyHelpers.Equatable.strictEquals,
      identifier: purifyHelpers.Equatable.booleanEquals,
      type: purifyHelpers.Equatable.strictEquals,
    });
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { abcStringProperty: string; identifier: rdfjs.BlankNode | rdfjs.NamedNode }
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

  export function hashAbstractBaseClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    abstractBaseClassNodeShape: Omit<
      AbstractBaseClassNodeShape,
      "identifier" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(abstractBaseClassNodeShape.abcStringProperty);
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
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/abcStringProperty"),
          this.variable("AbcStringProperty"),
        ),
      );
    }
  }

  export function toRdf(
    abstractBaseClassNodeShape: AbstractBaseClassNodeShape,
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
    const _resource = resourceSet.mutableResource({
      identifier: abstractBaseClassNodeShape.identifier,
      mutateGraph: mutateGraph,
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
      dataFactory.namedNode("http://example.com/abcStringProperty"),
      abstractBaseClassNodeShape.abcStringProperty,
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
    externingAndInliningNodeShape: Omit<
      ExterningAndInliningNodeShape,
      "identifier" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(
      rdfjsResource.Resource.Identifier.toString(
        externingAndInliningNodeShape.externProperty,
      ),
    );
    InlineNodeShape.hash(externingAndInliningNodeShape.inlineProperty, _hasher);
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
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: externingAndInliningNodeShape.identifier,
      mutateGraph: mutateGraph,
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
  >(
    externNodeShape: Omit<ExternNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(externNodeShape.stringProperty);
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
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: externNodeShape.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      externNodeShape.stringProperty,
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
  >(
    iriNodeShape: Omit<IriNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(iriNodeShape.stringProperty);
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
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: iriNodeShape.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      iriNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface NodeShapeWithListProperty {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly listProperty: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly type: "NodeShapeWithListProperty";
}

export namespace NodeShapeWithListProperty {
  export function equals(
    left: NodeShapeWithListProperty,
    right: NodeShapeWithListProperty,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
      identifier: purifyHelpers.Equatable.booleanEquals,
      listProperty: purifyHelpers.Equatable.booleanEquals,
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
      listProperty: rdfjs.BlankNode | rdfjs.NamedNode;
      type: "NodeShapeWithListProperty";
    }
  > {
    const identifier = _resource.identifier;
    const _listPropertyEither: purify.Either<
      rdfjsResource.Resource.ValueError,
      rdfjs.BlankNode | rdfjs.NamedNode
    > = _resource
      .values(dataFactory.namedNode("http://example.com/listProperty"), {
        unique: true,
      })
      .head()
      .chain((_value) => _value.toIdentifier());
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
    nodeShapeWithListProperty: Omit<
      NodeShapeWithListProperty,
      "identifier" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(
      rdfjsResource.Resource.Identifier.toString(
        nodeShapeWithListProperty.listProperty,
      ),
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
          dataFactory.namedNode("http://example.com/listProperty"),
          this.variable("ListProperty"),
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
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithListProperty.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/listProperty"),
      nodeShapeWithListProperty.listProperty,
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
    nodeShapeWithPropertyCardinalities: Omit<
      NodeShapeWithPropertyCardinalities,
      "identifier" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
    nodeShapeWithPropertyCardinalities.optionalStringProperty.ifJust(
      (_value) => {
        _hasher.update(_value);
      },
    );
    _hasher.update(nodeShapeWithPropertyCardinalities.requiredStringProperty);
    for (const _element of nodeShapeWithPropertyCardinalities.setStringProperty) {
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
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nodeShapeWithPropertyCardinalities.identifier,
      mutateGraph: mutateGraph,
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
  >(
    nonClassNodeShape: Omit<NonClassNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(nonClassNodeShape.stringProperty);
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
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: nonClassNodeShape.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      nonClassNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface ParentClassNodeShape extends AbstractBaseClassNodeShape {
  readonly parentStringProperty: readonly string[];
  readonly type: "ChildClassNodeShape" | "ParentClassNodeShape";
}

export namespace ParentClassNodeShape {
  export function equals(
    left: ParentClassNodeShape,
    right: ParentClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return AbstractBaseClassNodeShape.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
        parentStringProperty: (left, right) =>
          purifyHelpers.Arrays.equals(
            left,
            right,
            purifyHelpers.Equatable.strictEquals,
          ),
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
      parentStringProperty: readonly string[];
      type: "ChildClassNodeShape" | "ParentClassNodeShape";
    }
  > {
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
      const _parentStringPropertyEither: purify.Either<
        rdfjsResource.Resource.ValueError,
        readonly string[]
      > = purify.Either.of([
        ..._resource
          .values(
            dataFactory.namedNode("http://example.com/parentStringProperty"),
            { unique: true },
          )
          .flatMap((_value) =>
            _value
              .toValues()
              .head()
              .chain((_value) => _value.toString())
              .toMaybe()
              .toList(),
          ),
      ]);
      if (_parentStringPropertyEither.isLeft()) {
        return _parentStringPropertyEither;
      }
      const parentStringProperty = _parentStringPropertyEither.unsafeCoerce();
      const type = "ParentClassNodeShape" as const;
      return purify.Either.of({
        abcStringProperty: _super.abcStringProperty,
        identifier: _super.identifier,
        parentStringProperty,
        type,
      });
    });
  }

  export function hashParentClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    parentClassNodeShape: Omit<ParentClassNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    AbstractBaseClassNodeShape.hashAbstractBaseClassNodeShape(
      parentClassNodeShape,
      _hasher,
    );
    for (const _element of parentClassNodeShape.parentStringProperty) {
      _hasher.update(_element);
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
            dataFactory.namedNode("http://example.com/parentStringProperty"),
            this.variable("ParentStringProperty"),
          ),
        ),
      );
    }
  }

  export function toRdf(
    parentClassNodeShape: ParentClassNodeShape,
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
    const _resource = AbstractBaseClassNodeShape.toRdf(parentClassNodeShape, {
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
      dataFactory.namedNode("http://example.com/parentStringProperty"),
      parentClassNodeShape.parentStringProperty,
    );
    return _resource;
  }
}

export interface ChildClassNodeShape extends ParentClassNodeShape {
  readonly childStringProperty: string;
  readonly type: "ChildClassNodeShape";
}

export namespace ChildClassNodeShape {
  export function equals(
    left: ChildClassNodeShape,
    right: ChildClassNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return ParentClassNodeShape.equals(left, right).chain(() =>
      purifyHelpers.Equatable.objectEquals(left, right, {
        childStringProperty: purifyHelpers.Equatable.strictEquals,
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
      parentStringProperty: readonly string[];
      type: "ChildClassNodeShape";
      abcStringProperty: string;
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
      childStringProperty: string;
    }
  > {
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
      const type = "ChildClassNodeShape" as const;
      return purify.Either.of({
        parentStringProperty: _super.parentStringProperty,
        type,
        abcStringProperty: _super.abcStringProperty,
        identifier: _super.identifier,
        childStringProperty,
      });
    });
  }

  export function hashChildClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    childClassNodeShape: Omit<ChildClassNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    ParentClassNodeShape.hashParentClassNodeShape(childClassNodeShape, _hasher);
    _hasher.update(childClassNodeShape.childStringProperty);
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
        sparqlBuilder.GraphPattern.basic(
          this.subject,
          dataFactory.namedNode("http://example.com/childStringProperty"),
          this.variable("ChildStringProperty"),
        ),
      );
    }
  }

  export function toRdf(
    childClassNodeShape: ChildClassNodeShape,
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
    const _resource = ParentClassNodeShape.toRdf(childClassNodeShape, {
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
      dataFactory.namedNode("http://example.com/childStringProperty"),
      childClassNodeShape.childStringProperty,
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
  >(
    inlineNodeShape: Omit<InlineNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(inlineNodeShape.stringProperty);
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
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: inlineNodeShape.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      inlineNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface OrNodeShapeMember1 {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "OrNodeShapeMember1";
}

export namespace OrNodeShapeMember1 {
  export function equals(
    left: OrNodeShapeMember1,
    right: OrNodeShapeMember1,
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
      type: "OrNodeShapeMember1";
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
    const type = "OrNodeShapeMember1" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    orNodeShapeMember1: Omit<OrNodeShapeMember1, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(orNodeShapeMember1.stringProperty);
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
    orNodeShapeMember1: OrNodeShapeMember1,
    {
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: orNodeShapeMember1.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      orNodeShapeMember1.stringProperty,
    );
    return _resource;
  }
}

export interface OrNodeShapeMember2 {
  readonly identifier: rdfjs.BlankNode | rdfjs.NamedNode;
  readonly stringProperty: string;
  readonly type: "OrNodeShapeMember2";
}

export namespace OrNodeShapeMember2 {
  export function equals(
    left: OrNodeShapeMember2,
    right: OrNodeShapeMember2,
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
      type: "OrNodeShapeMember2";
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
    const type = "OrNodeShapeMember2" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    orNodeShapeMember2: Omit<OrNodeShapeMember2, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    _hasher.update(orNodeShapeMember2.stringProperty);
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
    orNodeShapeMember2: OrNodeShapeMember2,
    {
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource {
    const _resource = resourceSet.mutableResource({
      identifier: orNodeShapeMember2.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      orNodeShapeMember2.stringProperty,
    );
    return _resource;
  }
}

export interface Sha256IriNodeShape {
  readonly identifier: rdfjs.NamedNode;
  readonly stringProperty: readonly string[];
  readonly type: "Sha256IriNodeShape";
}

export namespace Sha256IriNodeShape {
  export function equals(
    left: Sha256IriNodeShape,
    right: Sha256IriNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
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

  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.NamedNode;
      stringProperty: readonly string[];
      type: "Sha256IriNodeShape";
    }
  > {
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
    const type = "Sha256IriNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    sha256IriNodeShape: Omit<Sha256IriNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    for (const _element of sha256IriNodeShape.stringProperty) {
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

  export function toRdf(
    sha256IriNodeShape: Sha256IriNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: sha256IriNodeShape.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      sha256IriNodeShape.stringProperty,
    );
    return _resource;
  }
}

export interface UuidV4IriNodeShape {
  readonly identifier: rdfjs.NamedNode;
  readonly stringProperty: readonly string[];
  readonly type: "UuidV4IriNodeShape";
}

export namespace UuidV4IriNodeShape {
  export function equals(
    left: UuidV4IriNodeShape,
    right: UuidV4IriNodeShape,
  ): purifyHelpers.Equatable.EqualsResult {
    return purifyHelpers.Equatable.objectEquals(left, right, {
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

  export function fromRdf(
    _resource: rdfjsResource.Resource<rdfjs.NamedNode>,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    {
      identifier: rdfjs.NamedNode;
      stringProperty: readonly string[];
      type: "UuidV4IriNodeShape";
    }
  > {
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
    const type = "UuidV4IriNodeShape" as const;
    return purify.Either.of({ identifier, stringProperty, type });
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    uuidV4IriNodeShape: Omit<UuidV4IriNodeShape, "identifier" | "type">,
    _hasher: HasherT,
  ): HasherT {
    for (const _element of uuidV4IriNodeShape.stringProperty) {
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

  export function toRdf(
    uuidV4IriNodeShape: UuidV4IriNodeShape,
    {
      mutateGraph,
      resourceSet,
    }: {
      ignoreRdfType?: boolean;
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ): rdfjsResource.MutableResource<rdfjs.NamedNode> {
    const _resource = resourceSet.mutableNamedResource({
      identifier: uuidV4IriNodeShape.identifier,
      mutateGraph: mutateGraph,
    });
    _resource.add(
      dataFactory.namedNode("http://example.com/stringProperty"),
      uuidV4IriNodeShape.stringProperty,
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
