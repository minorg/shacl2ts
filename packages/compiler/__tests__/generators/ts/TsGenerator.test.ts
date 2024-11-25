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
import * as kitchenSinkClasses from "../../../../../examples/kitchen-sink/generated/classes.js";
import * as kitchenSinkInterfaces from "../../../../../examples/kitchen-sink/generated/interfaces.js";

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
    modelFromRdf: (resource: Resource) => Either<Resource.ValueError, ModelT>;
    model: ModelT;
  }) {
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const resource = model.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet,
    });
    const fromRdfModel = modelFromRdf(resource).unsafeCoerce();
    expect(fromRdfModel.equals(model).extract()).toStrictEqual(true);
  }

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
      kitchenSinkClasses.ExterningAndInliningNodeShape.fromRdf(
        instance.toRdf({
          mutateGraph: dataFactory.defaultGraph(),
          resourceSet: new MutableResourceSet({
            dataFactory,
            dataset: new N3.Store(),
          }),
        }),
      ).unsafeCoerce();
    expect(instance.equals(instanceFromRdf).extract()).toStrictEqual(true);
  });

  it("fromRdf (child-parent)", ({ expect }) => {
    testFromRdf({
      expect,
      model: new kitchenSinkClasses.ChildClassNodeShape({
        identifier: dataFactory.blankNode(),
        abcStringProperty: "abc",
        childStringProperty: "child",
        parentStringProperty: "parent",
      }),
      modelFromRdf: kitchenSinkClasses.ChildClassNodeShape.fromRdf,
    });
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

  it("toRdf: should populate a dataset", ({ expect }) => {
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const identifier = dataFactory.blankNode();
    const model = new kitchenSinkClasses.ChildClassNodeShape({
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
          dataFactory.namedNode("http://example.com/ChildClassNodeShape"),
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
      kitchenSinkClasses.NodeShapeWithListProperty.fromRdf(
        resource,
      ).unsafeCoerce();
    expect(instance.equals(instanceFromRdf).extract()).toStrictEqual(true);
  });
});
