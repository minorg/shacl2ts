import { rdf } from "@tpluscode/rdf-ns-builders";
import { sha256 } from "js-sha256";
import N3, { DataFactory as dataFactory } from "n3";
import type { Either } from "purify-ts";
import type { Equatable } from "purify-ts-helpers";
import {
  type MutableResource,
  MutableResourceSet,
  type Resource,
} from "rdfjs-resource";
import { type ExpectStatic, describe, it } from "vitest";
import { ExternObjectType } from "../../../../../examples/kitchen-sink/ExternObjectType.js";
import * as kitchenSink from "../../../../../examples/kitchen-sink/generated.js";

function testFromRdf<
  ModelT extends {
    equals: (other: ModelT) => Equatable.EqualsResult;
    toRdf: (kwds: {
      mutateGraph: MutableResource.MutateGraph;
      resourceSet: MutableResourceSet;
    }) => Resource;
  },
>({
  expect,
  modelFromRdf,
  model,
}: {
  expect: ExpectStatic;
  modelFromRdf: (parameters: { resource: Resource }) => Either<
    Resource.ValueError,
    ModelT
  >;
  model: ModelT;
}) {
  const fromRdfModel = modelFromRdf({
    resource: model.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({
        dataFactory,
        dataset: new N3.Store(),
      }),
    }),
  }).unsafeCoerce();
  expect(fromRdfModel.equals(model).extract()).toStrictEqual(true);
}

describe("TsGenerator", () => {
  it("interfaces: should generate valid TypeScript interfaces", ({
    expect,
  }) => {
    const instance: kitchenSink.InterfaceNodeShape = {
      identifier: dataFactory.blankNode(),
      stringProperty: "Test",
      type: "InterfaceNodeShape",
    };
    expect(instance.stringProperty).toStrictEqual("Test");
  });

  it("class constructor: construct a class instance from convertible parameters", ({
    expect,
  }) => {
    const instance = new kitchenSink.NodeShapeWithPropertyCardinalities({
      identifier: dataFactory.blankNode(),
      optionalStringProperty: undefined,
      requiredStringProperty: "test",
      setStringProperty: undefined,
    });
    expect(instance.optionalStringProperty.isNothing()).toStrictEqual(true);
    expect(instance.setStringProperty).toStrictEqual([]);
    expect(instance.requiredStringProperty).toStrictEqual("test");
  });

  it("class constructor: don't mint an IRI if one is supplied", ({
    expect,
  }) => {
    const instanceWithIdentifier = new kitchenSink.Sha256IriNodeShape({
      identifier: dataFactory.namedNode("http://example.com/instance"),
      stringProperty: "test",
    });
    expect(
      instanceWithIdentifier.identifier.equals(
        dataFactory.namedNode("http://example.com/instance"),
      ),
    ).toStrictEqual(true);
  });

  it("class constructor: mint an IRI with SHA-256 if none is supplied", ({
    expect,
  }) => {
    const instance = new kitchenSink.Sha256IriNodeShape({
      stringProperty: "test",
    });
    expect(
      instance.identifier.equals(
        dataFactory.namedNode(
          "urn:shaclmate:object:Sha256IriNodeShape:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        ),
      ),
    ).toStrictEqual(true);
  });

  it("class constructor: mint an IRI with UUIDv4 if none is supplied", ({
    expect,
  }) => {
    const instance = new kitchenSink.UuidV4IriNodeShape({
      stringProperty: "test",
    });
    expect(instance.identifier.value).toMatch(
      /urn:shaclmate:object:UuidV4IriNodeShape:[0-9A-Fa-f]{8}-/,
    );
  });

  it("class constructor: default values", ({ expect }) => {
    const model = new kitchenSink.NodeShapeWithDefaultValueProperties({
      identifier: dataFactory.blankNode(),
    });
    expect(model.falseBooleanProperty).toStrictEqual(false);
    expect(model.dateTimeProperty.getTime()).toStrictEqual(1523268000000);
    expect(model.numberProperty).toStrictEqual(0);
    expect(model.stringProperty).toStrictEqual("");
    expect(model.trueBooleanProperty).toStrictEqual(true);
  });

  it("class constructor: union of literals property", ({ expect }) => {
    expect(
      new kitchenSink.NodeShapeWithOrProperties({
        identifier: dataFactory.blankNode(),
        orLiteralsProperty: dataFactory.literal("test"),
      }).orLiteralsProperty.unsafeCoerce().value,
    ).toStrictEqual("test");
  });

  it("should generate a type alias", ({ expect }) => {
    const instance1: kitchenSink.OrNodeShape =
      new kitchenSink.OrNodeShapeMember1({
        identifier: dataFactory.blankNode(),
        stringProperty1: "test1",
      });
    const instance2: kitchenSink.OrNodeShape =
      new kitchenSink.OrNodeShapeMember2({
        identifier: dataFactory.blankNode(),
        stringProperty2: "test2",
      });
    expect(
      kitchenSink.OrNodeShape.equals(instance1, instance2).extract(),
    ).not.toStrictEqual(true);
  });

  it("equals: should return true when the two objects are equal", ({
    expect,
  }) => {
    const instance = new kitchenSink.NonClassNodeShape({
      identifier: dataFactory.blankNode(),
      stringProperty: "Test",
    });
    expect(instance.equals(instance).extract()).toStrictEqual(true);
  });

  it("equals: should return Unequals when the two objects are unequal", ({
    expect,
  }) => {
    expect(
      new kitchenSink.NonClassNodeShape({
        identifier: dataFactory.blankNode(),
        stringProperty: "Test",
      })
        .equals(
          new kitchenSink.NonClassNodeShape({
            identifier: dataFactory.blankNode(),
            stringProperty: "Test2",
          }),
        )
        .extract(),
    ).not.toStrictEqual(true);
  });

  it("equals: terms union type", ({ expect }) => {
    const identifier = dataFactory.blankNode();
    expect(
      new kitchenSink.NodeShapeWithOrProperties({
        identifier,
        orTermsProperty: dataFactory.namedNode("http://example.com/term"),
      })
        .equals(
          new kitchenSink.NodeShapeWithOrProperties({
            identifier,
            orTermsProperty: dataFactory.namedNode("http://example.com/term"),
          }),
        )
        .extract(),
    ).toStrictEqual(true);

    expect(
      new kitchenSink.NodeShapeWithOrProperties({
        identifier,
        orTermsProperty: dataFactory.namedNode("http://example.com/term"),
      })
        .equals(
          new kitchenSink.NodeShapeWithOrProperties({
            identifier,
            orTermsProperty: dataFactory.literal("test"),
          }),
        )
        .extract(),
    ).not.toStrictEqual(true);
  });

  it("equals: unrelated union type", ({ expect }) => {
    const identifier = dataFactory.blankNode();
    expect(
      new kitchenSink.NodeShapeWithOrProperties({
        identifier,
        orUnrelatedProperty: { type: "0-number", value: 1 },
      })
        .equals(
          new kitchenSink.NodeShapeWithOrProperties({
            identifier,
            orUnrelatedProperty: { type: "0-number", value: 1 },
          }),
        )
        .extract(),
    ).toStrictEqual(true);

    expect(
      new kitchenSink.NodeShapeWithOrProperties({
        identifier,
        orUnrelatedProperty: { type: "0-number", value: 1 },
      })
        .equals(
          new kitchenSink.NodeShapeWithOrProperties({
            identifier,
            orUnrelatedProperty: {
              type: "1-rdfjs.NamedNode",
              value: dataFactory.namedNode("http://example.com/term"),
            },
          }),
        )
        .extract(),
    ).not.toStrictEqual(true);
  });

  it("should extern and inline properties", ({ expect }) => {
    const instance = new kitchenSink.NodeShapeWithExternProperties({
      identifier: dataFactory.blankNode(),
      externProperty: dataFactory.blankNode(),
      inlineProperty: new kitchenSink.InlineNodeShape({
        identifier: dataFactory.blankNode(),
        stringProperty: "Test",
      }),
    });
    const instanceFromRdf = kitchenSink.NodeShapeWithExternProperties.fromRdf({
      resource: instance.toRdf({
        mutateGraph: dataFactory.defaultGraph(),
        resourceSet: new MutableResourceSet({
          dataFactory,
          dataset: new N3.Store(),
        }),
      }),
    }).unsafeCoerce();
    expect(instance.equals(instanceFromRdf).extract()).toStrictEqual(true);
  });

  it("fromRdf (child-parent)", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSink.ConcreteChildClassNodeShape({
        identifier: dataFactory.blankNode(),
        abcStringProperty: "abc",
        childStringProperty: "child",
        parentStringProperty: "parent",
      }),
      modelFromRdf: kitchenSink.ConcreteChildClassNodeShape.fromRdf,
    });
  });

  it("fromRdf: take on default values", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSink.NodeShapeWithDefaultValueProperties({
        falseBooleanProperty: false,
        dateTimeProperty: new Date(1523268000000),
        identifier: dataFactory.blankNode(),
        numberProperty: 0,
        stringProperty: "",
        trueBooleanProperty: true,
      }),
      modelFromRdf: kitchenSink.NodeShapeWithDefaultValueProperties.fromRdf,
    });
  });

  it("fromRdf: override default values", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSink.NodeShapeWithDefaultValueProperties({
        falseBooleanProperty: true,
        dateTimeProperty: new Date(),
        identifier: dataFactory.blankNode(),
        numberProperty: 1,
        stringProperty: "test",
        trueBooleanProperty: false,
      }),
      modelFromRdf: kitchenSink.NodeShapeWithDefaultValueProperties.fromRdf,
    });
  });

  it("fromRdf: explicit RDF types", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSink.NodeShapeWithExplicitRdfTypes({
        identifier: dataFactory.blankNode(),
        stringProperty: "test",
      }),
      modelFromRdf: kitchenSink.NodeShapeWithExplicitRdfTypes.fromRdf,
    });
  });

  it("fromRdf: ensure hasValue (sh:hasValue)", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSink.NodeShapeWithHasValueProperties({
        identifier: dataFactory.blankNode(),
        hasIriProperty: dataFactory.namedNode(
          "http://example.com/NodeShapeWithHasValuePropertiesIri1",
        ),
      }),
      modelFromRdf: kitchenSink.NodeShapeWithHasValueProperties.fromRdf,
    });

    const dataset = new N3.Store();
    const identifier = dataFactory.blankNode();
    const predicate = dataFactory.namedNode(
      "http://example.com/hasIriProperty",
    );
    const object = dataFactory.namedNode(
      "http://example.com/NodeShapeWithHasValuePropertiesIri1",
    );
    dataset.add(dataFactory.quad(identifier, predicate, object));
    // Add an extra object of the same predicate, which should be ignored
    dataset.add(
      dataFactory.quad(
        identifier,
        predicate,
        dataFactory.namedNode(
          "http://example.com/NodeShapeWithHasValuePropertiesIri2",
        ),
      ),
    );
    const instance = kitchenSink.NodeShapeWithHasValueProperties.fromRdf({
      resource: new MutableResourceSet({
        dataFactory,
        dataset: dataset,
      }).resource(identifier),
    }).unsafeCoerce();
    expect(instance.hasIriProperty.unsafeCoerce().equals(object));
  });

  it("fromRdf: ignore invalid values (sh:hasValue)", ({ expect }) => {
    const dataset = new N3.Store();
    const identifier = dataFactory.blankNode();
    dataset.add(
      dataFactory.quad(
        identifier,
        dataFactory.namedNode("http://example.com/hasLiteralProperty"),
        dataFactory.literal("nottest"),
      ),
    );
    const instance = kitchenSink.NodeShapeWithHasValueProperties.fromRdf({
      resource: new MutableResourceSet({
        dataFactory,
        dataset: dataset,
      }).resource(identifier),
    }).unsafeCoerce();
    expect(instance.hasLiteralProperty.isNothing()).toStrictEqual(true);
  });

  it("fromRdf: preserve valid IRI values (sh:in)", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSink.NodeShapeWithInProperties({
        identifier: dataFactory.blankNode(),
        inIrisProperty: dataFactory.namedNode(
          "http://example.com/NodeShapeWithInPropertiesIri1",
        ),
      }),
      modelFromRdf: kitchenSink.NodeShapeWithInProperties.fromRdf,
    });

    const dataset = new N3.Store();
    const identifier = dataFactory.blankNode();
    const object = dataFactory.namedNode(
      "http://example.com/NodeShapeWithInPropertiesIri1",
    );
    dataset.add(
      dataFactory.quad(
        identifier,
        dataFactory.namedNode("http://example.com/inIrisProperty"),
        object,
      ),
    );
    const instance = kitchenSink.NodeShapeWithInProperties.fromRdf({
      resource: new MutableResourceSet({
        dataFactory,
        dataset: dataset,
      }).resource(identifier),
    }).unsafeCoerce();
    expect(instance.inIrisProperty.unsafeCoerce().equals(object));
  });

  it("fromRdf: ignore invalid IRI values (sh:in)", ({ expect }) => {
    const dataset = new N3.Store();
    const identifier = dataFactory.blankNode();
    dataset.add(
      dataFactory.quad(
        identifier,
        dataFactory.namedNode("http://example.com/inIrisProperty"),
        dataFactory.namedNode(
          "http://example.com/NodeShapeWithInPropertiesIriInvalid",
        ),
      ),
    );
    const instance = kitchenSink.NodeShapeWithInProperties.fromRdf({
      resource: new MutableResourceSet({
        dataFactory,
        dataset: dataset,
      }).resource(identifier),
    }).unsafeCoerce();
    expect(instance.inIrisProperty.isNothing()).toStrictEqual(true);
  });

  it("fromRdf: preserve valid literal values (sh:in)", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSink.NodeShapeWithInProperties({
        identifier: dataFactory.blankNode(),
        inStringsProperty: "text",
      }),
      modelFromRdf: kitchenSink.NodeShapeWithInProperties.fromRdf,
    });

    const dataset = new N3.Store();
    const identifier = dataFactory.blankNode();
    dataset.add(
      dataFactory.quad(
        identifier,
        dataFactory.namedNode("http://example.com/inStringsProperty"),
        dataFactory.literal("text"),
      ),
    );
    const instance = kitchenSink.NodeShapeWithInProperties.fromRdf({
      resource: new MutableResourceSet({
        dataFactory,
        dataset: dataset,
      }).resource(identifier),
    }).unsafeCoerce();
    expect(instance.inStringsProperty.unsafeCoerce()).toStrictEqual("text");
  });

  it("fromRdf: ignore invalid literal values (sh:in)", ({ expect }) => {
    const dataset = new N3.Store();
    const identifier = dataFactory.blankNode();
    const predicate = dataFactory.namedNode(
      "http://example.com/inStringsProperty",
    );
    const object = dataFactory.literal("somethingelse");
    dataset.add(dataFactory.quad(identifier, predicate, object));
    const instance = kitchenSink.NodeShapeWithInProperties.fromRdf({
      resource: new MutableResourceSet({
        dataFactory,
        dataset: dataset,
      }).resource(identifier),
    }).unsafeCoerce();
    expect(instance.inStringsProperty.isNothing()).toStrictEqual(true);
  });

  it("hash", ({ expect }) => {
    expect(
      new kitchenSink.NonClassNodeShape({
        identifier: dataFactory.blankNode(),
        stringProperty: "Test",
      })
        .hash(sha256.create())
        .hex(),
    ).toStrictEqual(
      "532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25",
    );
  });

  it("should handle extern object types", ({ expect }) => {
    const instance = new kitchenSink.NodeShapeWithExternProperties({
      externObjectTypeProperty: new ExternObjectType(dataFactory.blankNode()),
    });
    testFromRdf({
      expect,
      model: instance,
      modelFromRdf: ({ resource }) =>
        kitchenSink.NodeShapeWithExternProperties.fromRdf({
          extra: 1,
          resource,
        }),
    });
    instance.hash(sha256.create());
  });

  it("toJson: or properties", ({ expect }) => {
    const instance = new kitchenSink.NodeShapeWithOrProperties({
      identifier: dataFactory.namedNode("http://example.com/instance"),
      orLiteralsProperty: 1,
      orUnrelatedProperty: { type: "0-number", value: 1 },
      orTermsProperty: dataFactory.literal("test"),
    });
    const jsonObject = instance.toJson();
    expect(jsonObject.identifier).toStrictEqual("http://example.com/instance");
    expect(jsonObject.type).toStrictEqual("NodeShapeWithOrProperties");
    expect(jsonObject.orLiteralsProperty).toStrictEqual({
      "@type": "http://www.w3.org/2001/XMLSchema#integer",
      "@value": "1",
    });
    expect(jsonObject.orTermsProperty).toStrictEqual("test");
  });

  it("toJson: child-parent", ({ expect }) => {
    const instance = new kitchenSink.ConcreteChildClassNodeShape({
      abcStringProperty: "abc",
      childStringProperty: "child",
      parentStringProperty: "parent",
    });
    const jsonObject = instance.toJson();
    expect(jsonObject.abcStringProperty).toStrictEqual("abc");
    expect(jsonObject.childStringProperty).toStrictEqual("child");
    expect(jsonObject.parentStringProperty).toStrictEqual("parent");
    expect(jsonObject.type).toStrictEqual("ConcreteChildClassNodeShape");
  });

  it("toRdf: should populate a dataset", ({ expect }) => {
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const identifier = dataFactory.blankNode();
    const model = new kitchenSink.ConcreteChildClassNodeShape({
      identifier,
      abcStringProperty: "abc",
      childStringProperty: "child",
      parentStringProperty: "parent",
    });
    const resource = model.toRdf({
      resourceSet,
      mutateGraph: dataFactory.defaultGraph(),
    });
    expect(dataset.size).toStrictEqual(4);
    expect(resource.identifier.equals(identifier)).toStrictEqual(true);
    expect(
      resource
        .value(rdf.type)
        .chain((value) => value.toIri())
        .unsafeCoerce()
        .equals(
          dataFactory.namedNode(
            "http://example.com/ConcreteChildClassNodeShape",
          ),
        ),
    ).toStrictEqual(true);
    expect(
      resource
        .value(dataFactory.namedNode("http://example.com/childStringProperty"))
        .chain((value) => value.toString())
        .unsafeCoerce(),
    ).toStrictEqual("child");
  });

  it("toRdf: should produce serializable RDF", ({ expect }) => {
    const dataset = new N3.Store();
    new kitchenSink.NonClassNodeShape({
      identifier: dataFactory.blankNode(),
      stringProperty: "Test",
    }).toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    const ttl = new N3.Writer({ format: "text/turtle" }).quadsToString([
      ...dataset,
    ]);
    expect(ttl).not.toHaveLength(0);
  });

  it("toRdf: explicit RDF types", ({ expect }) => {
    const dataset = new N3.Store();
    const resource = new kitchenSink.NodeShapeWithExplicitRdfTypes({
      identifier: dataFactory.blankNode(),
      stringProperty: "test",
    }).toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({
        dataFactory,
        dataset,
      }),
    });
    expect(dataset.size).toStrictEqual(3); // Two RDF types and the property
    expect(
      resource.isInstanceOf(
        dataFactory.namedNode("http://example.com/FromRdfType"),
      ),
    );
    expect(
      resource.isInstanceOf(
        dataFactory.namedNode("http://example.com/ToRdfType"),
      ),
    );
    expect(
      resource
        .value(dataFactory.namedNode("http://example.com/stringProperty"))
        .chain((value) => value.toString())
        .unsafeCoerce(),
    ).toStrictEqual("test");
  });

  it("toRdf: should serialize and deserialize a list", ({ expect }) => {
    const dataset = new N3.Store();
    const instance = new kitchenSink.NodeShapeWithListProperty({
      identifier: dataFactory.blankNode(),
      listProperty: ["Test1", "Test2"],
    });
    const resource = instance.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    const ttl = new N3.Writer({ format: "text/turtle" }).quadsToString([
      ...dataset,
    ]);
    expect(ttl).not.toHaveLength(0);

    const instanceFromRdf = kitchenSink.NodeShapeWithListProperty.fromRdf({
      resource,
    }).unsafeCoerce();
    expect(instance.equals(instanceFromRdf).extract()).toStrictEqual(true);
  });

  it("toRdf: should not serialize default values", ({ expect }) => {
    const dataset = new N3.Store();
    const instance = new kitchenSink.NodeShapeWithDefaultValueProperties({
      falseBooleanProperty: false,
      identifier: dataFactory.blankNode(),
      numberProperty: 0,
      stringProperty: "",
      trueBooleanProperty: true,
    });
    instance.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    expect(dataset.size).toStrictEqual(0);
  });

  it("toRdf: should serialize non-default values", ({ expect }) => {
    const dataset = new N3.Store();
    const instance = new kitchenSink.NodeShapeWithDefaultValueProperties({
      falseBooleanProperty: true,
      identifier: dataFactory.blankNode(),
      numberProperty: 1,
      stringProperty: "test",
      trueBooleanProperty: false,
    });
    const resource = instance.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    expect(dataset.size).toStrictEqual(4);
    expect(
      resource
        .value(dataFactory.namedNode("http://example.com/falseBooleanProperty"))
        .chain((value) => value.toBoolean())
        .unsafeCoerce(),
    ).toStrictEqual(true);
  });

  it("toString", ({ expect }) => {
    const instance = new kitchenSink.ConcreteChildClassNodeShape({
      abcStringProperty: "abc",
      childStringProperty: "child",
      identifier: dataFactory.namedNode("http://example.com/test"),
      parentStringProperty: "parent",
    });
    expect(instance.toString()).toStrictEqual(
      '{"abcStringProperty":"abc","identifier":"http://example.com/test","type":"ConcreteChildClassNodeShape","@type":"http://example.com/ConcreteChildClassNodeShape","parentStringProperty":"parent","childStringProperty":"child"}',
    );
  });
});
