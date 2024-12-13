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
import { ImportedType } from "../../../../../examples/kitchen-sink/ImportedType.js";
import * as kitchenSinkClasses from "../../../../../examples/kitchen-sink/generated/classes.js";
import * as kitchenSinkInterfaces from "../../../../../examples/kitchen-sink/generated/interfaces.js";

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
    const instance: kitchenSinkInterfaces.NonClassNodeShape = {
      identifier: dataFactory.blankNode(),
      stringProperty: "Test",
      type: "NonClassNodeShape",
    };
    expect(instance.stringProperty).toStrictEqual("Test");
  });

  it("class constructor: construct a class instance from convertible parameters", ({
    expect,
  }) => {
    const instance = new kitchenSinkClasses.NodeShapeWithPropertyCardinalities({
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
    const instanceWithIdentifier = new kitchenSinkClasses.Sha256IriNodeShape({
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
    const instance = new kitchenSinkClasses.Sha256IriNodeShape({
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
    const instance = new kitchenSinkClasses.UuidV4IriNodeShape({
      stringProperty: "test",
    });
    expect(instance.identifier.value).toMatch(
      /urn:shaclmate:object:UuidV4IriNodeShape:[0-9A-Fa-f]{8}-/,
    );
  });

  it("class constructor: default values", ({ expect }) => {
    const model = new kitchenSinkClasses.NodeShapeWithDefaultValueProperties({
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
      new kitchenSinkClasses.NodeShapeWithOrProperties({
        identifier: dataFactory.blankNode(),
        orLiteralsProperty: dataFactory.literal("test"),
      }).orLiteralsProperty.unsafeCoerce().value,
    ).toStrictEqual("test");
  });

  it("should generate a type alias", ({ expect }) => {
    const instance1: kitchenSinkInterfaces.OrNodeShape = {
      identifier: dataFactory.blankNode(),
      stringProperty1: "test1",
      type: "OrNodeShapeMember1",
    };
    const instance2: kitchenSinkInterfaces.OrNodeShape = {
      identifier: dataFactory.blankNode(),
      stringProperty2: "test2",
      type: "OrNodeShapeMember2",
    };
    expect(
      kitchenSinkInterfaces.OrNodeShape.equals(instance1, instance2).extract(),
    ).not.toStrictEqual(true);
  });

  it("equals: should return true when the two objects are equal", ({
    expect,
  }) => {
    const instance = new kitchenSinkClasses.NonClassNodeShape({
      identifier: dataFactory.blankNode(),
      stringProperty: "Test",
    });
    expect(instance.equals(instance).extract()).toStrictEqual(true);
  });

  it("equals: should return Unequals when the two objects are unequal", ({
    expect,
  }) => {
    expect(
      new kitchenSinkClasses.NonClassNodeShape({
        identifier: dataFactory.blankNode(),
        stringProperty: "Test",
      })
        .equals(
          new kitchenSinkClasses.NonClassNodeShape({
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
      new kitchenSinkClasses.NodeShapeWithOrProperties({
        identifier,
        orTermsProperty: dataFactory.namedNode("http://example.com/term"),
      })
        .equals(
          new kitchenSinkClasses.NodeShapeWithOrProperties({
            identifier,
            orTermsProperty: dataFactory.namedNode("http://example.com/term"),
          }),
        )
        .extract(),
    ).toStrictEqual(true);

    expect(
      new kitchenSinkClasses.NodeShapeWithOrProperties({
        identifier,
        orTermsProperty: dataFactory.namedNode("http://example.com/term"),
      })
        .equals(
          new kitchenSinkClasses.NodeShapeWithOrProperties({
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
      new kitchenSinkClasses.NodeShapeWithOrProperties({
        identifier,
        orUnrelatedProperty: { type: "0-number", value: 1 },
      })
        .equals(
          new kitchenSinkClasses.NodeShapeWithOrProperties({
            identifier,
            orUnrelatedProperty: { type: "0-number", value: 1 },
          }),
        )
        .extract(),
    ).toStrictEqual(true);

    expect(
      new kitchenSinkClasses.NodeShapeWithOrProperties({
        identifier,
        orUnrelatedProperty: { type: "0-number", value: 1 },
      })
        .equals(
          new kitchenSinkClasses.NodeShapeWithOrProperties({
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

  it("should extern and inline node shapes", ({ expect }) => {
    const instance = new kitchenSinkClasses.ExterningAndInliningNodeShape({
      identifier: dataFactory.blankNode(),
      externProperty: dataFactory.blankNode(),
      inlineProperty: new kitchenSinkClasses.InlineNodeShape({
        identifier: dataFactory.blankNode(),
        stringProperty: "Test",
      }),
    });
    const instanceFromRdf =
      kitchenSinkClasses.ExterningAndInliningNodeShape.fromRdf({
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
      model: new kitchenSinkClasses.ConcreteChildClassNodeShape({
        identifier: dataFactory.blankNode(),
        abcStringProperty: "abc",
        childStringProperty: "child",
        parentStringProperty: "parent",
      }),
      modelFromRdf: kitchenSinkClasses.ConcreteChildClassNodeShape.fromRdf,
    });
  });

  it("fromRdf: take on default values", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSinkClasses.NodeShapeWithDefaultValueProperties({
        falseBooleanProperty: false,
        dateTimeProperty: new Date(1523268000000),
        identifier: dataFactory.blankNode(),
        numberProperty: 0,
        stringProperty: "",
        trueBooleanProperty: true,
      }),
      modelFromRdf:
        kitchenSinkClasses.NodeShapeWithDefaultValueProperties.fromRdf,
    });
  });

  it("fromRdf: override default values", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSinkClasses.NodeShapeWithDefaultValueProperties({
        falseBooleanProperty: true,
        dateTimeProperty: new Date(),
        identifier: dataFactory.blankNode(),
        numberProperty: 1,
        stringProperty: "test",
        trueBooleanProperty: false,
      }),
      modelFromRdf:
        kitchenSinkClasses.NodeShapeWithDefaultValueProperties.fromRdf,
    });
  });

  it("fromRdf: ensure hasValue (sh:hasValue)", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSinkClasses.NodeShapeWithHasValueProperties({
        identifier: dataFactory.blankNode(),
        hasIriProperty: dataFactory.namedNode(
          "http://example.com/NodeShapeWithHasValuePropertiesIri1",
        ),
      }),
      modelFromRdf: kitchenSinkClasses.NodeShapeWithHasValueProperties.fromRdf,
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
    const instance = kitchenSinkClasses.NodeShapeWithHasValueProperties.fromRdf(
      {
        resource: new MutableResourceSet({
          dataFactory,
          dataset: dataset,
        }).resource(identifier),
      },
    ).unsafeCoerce();
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
    const instance = kitchenSinkClasses.NodeShapeWithHasValueProperties.fromRdf(
      {
        resource: new MutableResourceSet({
          dataFactory,
          dataset: dataset,
        }).resource(identifier),
      },
    ).unsafeCoerce();
    expect(instance.hasLiteralProperty.isNothing()).toStrictEqual(true);
  });

  it("fromRdf: preserve valid IRI values (sh:in)", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSinkClasses.NodeShapeWithInProperties({
        identifier: dataFactory.blankNode(),
        inIrisProperty: dataFactory.namedNode(
          "http://example.com/NodeShapeWithInPropertiesIri1",
        ),
      }),
      modelFromRdf: kitchenSinkClasses.NodeShapeWithInProperties.fromRdf,
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
    const instance = kitchenSinkClasses.NodeShapeWithInProperties.fromRdf({
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
    const instance = kitchenSinkClasses.NodeShapeWithInProperties.fromRdf({
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
      model: new kitchenSinkClasses.NodeShapeWithInProperties({
        identifier: dataFactory.blankNode(),
        inStringsProperty: "text",
      }),
      modelFromRdf: kitchenSinkClasses.NodeShapeWithInProperties.fromRdf,
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
    const instance = kitchenSinkClasses.NodeShapeWithInProperties.fromRdf({
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
    const instance = kitchenSinkClasses.NodeShapeWithInProperties.fromRdf({
      resource: new MutableResourceSet({
        dataFactory,
        dataset: dataset,
      }).resource(identifier),
    }).unsafeCoerce();
    expect(instance.inStringsProperty.isNothing()).toStrictEqual(true);
  });

  it("hash", ({ expect }) => {
    expect(
      new kitchenSinkClasses.NonClassNodeShape({
        identifier: dataFactory.blankNode(),
        stringProperty: "Test",
      })
        .hash(sha256.create())
        .hex(),
    ).toStrictEqual(
      "532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25",
    );
  });

  it("should handle imported types", ({ expect }) => {
    const instance = new kitchenSinkClasses.NodeShapeWithImportedTypes({
      importedTypeProperty: new ImportedType(dataFactory.blankNode()),
    });
    testFromRdf({
      expect,
      model: instance,
      modelFromRdf: ({ resource }) =>
        kitchenSinkClasses.NodeShapeWithImportedTypes.fromRdf({
          extra: 1,
          resource,
        }),
    });
    instance.hash(sha256.create());
  });

  it("toRdf: should populate a dataset", ({ expect }) => {
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const identifier = dataFactory.blankNode();
    const model = new kitchenSinkClasses.ConcreteChildClassNodeShape({
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
    new kitchenSinkClasses.NonClassNodeShape({
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

  it("toRdf: should serialize and deserialize a list", ({ expect }) => {
    const dataset = new N3.Store();
    const instance = new kitchenSinkClasses.NodeShapeWithListProperty({
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

    const instanceFromRdf =
      kitchenSinkClasses.NodeShapeWithListProperty.fromRdf({
        resource,
      }).unsafeCoerce();
    expect(instance.equals(instanceFromRdf).extract()).toStrictEqual(true);
  });

  it("toRdf: should not serialize default values", ({ expect }) => {
    const dataset = new N3.Store();
    const instance = new kitchenSinkClasses.NodeShapeWithDefaultValueProperties(
      {
        falseBooleanProperty: false,
        identifier: dataFactory.blankNode(),
        numberProperty: 0,
        stringProperty: "",
        trueBooleanProperty: true,
      },
    );
    instance.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    expect(dataset.size).toStrictEqual(0);
  });

  it("toRdf: should serialize non-default values", ({ expect }) => {
    const dataset = new N3.Store();
    const instance = new kitchenSinkClasses.NodeShapeWithDefaultValueProperties(
      {
        falseBooleanProperty: true,
        identifier: dataFactory.blankNode(),
        numberProperty: 1,
        stringProperty: "test",
        trueBooleanProperty: false,
      },
    );
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
});
