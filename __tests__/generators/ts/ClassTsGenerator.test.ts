import { schema } from "@tpluscode/rdf-ns-builders";
import { DataFactory as dataFactory } from "n3";
import N3 from "n3";
import { describe, it } from "vitest";
import { MutableResourceSet } from "../../../../rdfjs-resource";
import * as classes from "../../../examples/mlm/generated/classes.js";

describe("ClassTsGenerator", () => {
  it("should construct a class instance from parameters", ({ expect }) => {
    const mlm = new classes.LanguageModel({
      contextWindow: 1,
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: new classes.MachineLearningModelFamily({
        description: dataFactory.literal("Family description"),
        identifier: dataFactory.namedNode("http://example.com/family"),
        manufacturer: new classes.Organization({
          identifier: dataFactory.namedNode("http://example.com/organization"),
          name: dataFactory.literal("Test organization"),
        }),
        name: dataFactory.literal("Family"),
        url: "http://example.com/family",
      }),
      localIdentifier: "testidentifier",
      name: dataFactory.literal("Test name"),
      maxTokenOutput: 5,
      trainingDataCutoff: "Test cutoff",
      url: "http://example.com/mlm",
    });
    expect(mlm.description.isNothing()).toStrictEqual(true);
    expect(mlm.isVariantOf.description.extractNullable()?.value).toStrictEqual(
      "Family description",
    );
    expect(mlm.name.value).toStrictEqual("Test name");
  });

  it("equals should return true with two equal objects", ({ expect }) => {
    const left = new classes.Organization({
      identifier: dataFactory.namedNode("http://example.com/example"),
      name: dataFactory.literal("Example"),
    });
    const right = new classes.Organization({
      identifier: dataFactory.namedNode("http://example.com/example"),
      name: dataFactory.literal("Example"),
    });
    expect(left.equals(right).extract()).toStrictEqual(true);
  });

  it("equals should return an Unequals with two unequal objects", ({
    expect,
  }) => {
    const left = new classes.Organization({
      identifier: dataFactory.namedNode("http://example.com/left"),
      name: dataFactory.literal("Left"),
    });
    const right = new classes.Organization({
      identifier: dataFactory.namedNode("http://example.com/right"),
      name: dataFactory.literal("Right"),
    });
    expect(left.equals(right).extract()).not.toStrictEqual(true);
  });

  it("toRdf should populate a dataset", ({ expect }) => {
    const organization = new classes.Organization({
      identifier: dataFactory.namedNode("http://example.com/organization"),
      name: dataFactory.literal("Test organization"),
    });
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const resource = organization.toRdf({
      resourceSet,
      mutateGraph: dataFactory.defaultGraph(),
    });
    expect(dataset.size).toStrictEqual(2);
    expect(
      resource.identifier.equals(
        dataFactory.namedNode("http://example.com/organization"),
      ),
    ).toStrictEqual(true);
    expect(
      resource
        .value(schema.name)
        .chain((value) => value.toString())
        .unsafeCoerce(),
    ).toStrictEqual("Test organization");
  });
});
