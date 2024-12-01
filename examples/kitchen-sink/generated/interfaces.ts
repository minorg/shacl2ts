import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type * as rdfjs from "@rdfjs/types";
import { DataFactory as dataFactory } from "n3";
import * as purify from "purify-ts";
import * as purifyHelpers from "purify-ts-helpers";
import * as rdfjsResource from "rdfjs-resource";

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
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { identifier: rdfjs.BlankNode | rdfjs.NamedNode }
  > {
    if (
      !_options?.ignoreRdfType &&
      !_resource.isInstanceOf(
        dataFactory.namedNode(
          "http://example.com/AbstractBaseClassWithoutPropertiesNodeShape",
        ),
      )
    ) {
      return purify.Left(
        new rdfjsResource.Resource.ValueError({
          focusResource: _resource,
          message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
          predicate: dataFactory.namedNode(
            "http://example.com/AbstractBaseClassWithoutPropertiesNodeShape",
          ),
        }),
      );
    }

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
      "identifier" | "type"
    >,
    _hasher: HasherT,
  ): HasherT {
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
              "http://example.com/AbstractBaseClassWithoutPropertiesNodeShape",
            ),
          ),
        );
      }
    }
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
        type: purifyHelpers.Equatable.strictEquals,
      }),
    );
  }

  export function fromRdf(
    _resource: rdfjsResource.Resource,
    _options?: { ignoreRdfType?: boolean },
  ): purify.Either<
    rdfjsResource.Resource.ValueError,
    { identifier: rdfjs.BlankNode | rdfjs.NamedNode; abcStringProperty: string }
  > {
    return AbstractBaseClassWithoutPropertiesNodeShape.fromRdf(_resource, {
      ignoreRdfType: true,
    }).chain((_super) => {
      if (
        !_options?.ignoreRdfType &&
        !_resource.isInstanceOf(
          dataFactory.namedNode(
            "http://example.com/AbstractBaseClassWithPropertiesNodeShape",
          ),
        )
      ) {
        return purify.Left(
          new rdfjsResource.Resource.ValueError({
            focusResource: _resource,
            message: `${rdfjsResource.Resource.Identifier.toString(_resource.identifier)} has unexpected RDF type`,
            predicate: dataFactory.namedNode(
              "http://example.com/AbstractBaseClassWithPropertiesNodeShape",
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
      return purify.Either.of({
        identifier: _super.identifier,
        abcStringProperty,
      });
    });
  }

  export function hashAbstractBaseClassWithPropertiesNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _abstractBaseClassWithPropertiesNodeShape: Omit<
      AbstractBaseClassWithPropertiesNodeShape,
      "identifier" | "type"
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
              "http://example.com/AbstractBaseClassWithPropertiesNodeShape",
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
    return AbstractBaseClassWithPropertiesNodeShape.fromRdf(_resource, {
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
        identifier: _super.identifier,
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
    _concreteParentClassNodeShape: Omit<
      ConcreteParentClassNodeShape,
      "identifier" | "type"
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
      super(subject, { ignoreRdfType: true });
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
      parentStringProperty: string;
      type: "ConcreteChildClassNodeShape";
      abcStringProperty: string;
      identifier: rdfjs.BlankNode | rdfjs.NamedNode;
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
      const type = "ConcreteChildClassNodeShape" as const;
      return purify.Either.of({
        parentStringProperty: _super.parentStringProperty,
        type,
        abcStringProperty: _super.abcStringProperty,
        identifier: _super.identifier,
        childStringProperty,
      });
    });
  }

  export function hashConcreteChildClassNodeShape<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(
    _concreteChildClassNodeShape: Omit<
      ConcreteChildClassNodeShape,
      "identifier" | "type"
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
    _externingAndInliningNodeShape: Omit<
      ExterningAndInliningNodeShape,
      "identifier" | "type"
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
    _externNodeShape: Omit<ExternNodeShape, "identifier" | "type">,
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
    _inlineNodeShape: Omit<InlineNodeShape, "identifier" | "type">,
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
    _iriNodeShape: Omit<IriNodeShape, "identifier" | "type">,
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
    _nodeShapeWithListProperty: Omit<
      NodeShapeWithListProperty,
      "identifier" | "type"
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
    _nodeShapeWithPropertyCardinalities: Omit<
      NodeShapeWithPropertyCardinalities,
      "identifier" | "type"
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
    _nonClassNodeShape: Omit<NonClassNodeShape, "identifier" | "type">,
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
  >(
    _orNodeShapeMember1: Omit<OrNodeShapeMember1, "identifier" | "type">,
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
  >(
    _orNodeShapeMember2: Omit<OrNodeShapeMember2, "identifier" | "type">,
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
  >(
    _sha256IriNodeShape: Omit<Sha256IriNodeShape, "identifier" | "type">,
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
  >(
    _uuidV4IriNodeShape: Omit<UuidV4IriNodeShape, "identifier" | "type">,
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
