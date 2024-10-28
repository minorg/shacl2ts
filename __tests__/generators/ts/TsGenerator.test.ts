import type { DataFactory, NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import N3, { DataFactory as dataFactory } from "n3";
import { type Either, Maybe } from "purify-ts";
import type { Equatable } from "purify-ts-helpers";
import {
  type MutableResource,
  MutableResourceSet,
  type Resource,
} from "rdfjs-resource";
import { type ExpectStatic, beforeAll, describe, it } from "vitest";
import * as generated from "../../../examples/mlm/generated/generated.js";

describe("TsGenerator", () => {
  let languageModel: generated.LanguageModel.Class;
  let organization: generated.Organization.Class;

  beforeAll(() => {
    organization = new generated.Organization.Class({
      identifier: dataFactory.namedNode("http://example.com/organization"),
      name: dataFactory.literal("Test organization"),
    });

    languageModel = new generated.LanguageModel.Class({
      contextWindow: 1,
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: new generated.MachineLearningModelFamily.Class({
        description: dataFactory.literal("Family description"),
        identifier: dataFactory.namedNode("http://example.com/family"),
        manufacturer: organization,
        name: dataFactory.literal("Family"),
        url: "http://example.com/family",
      }),
      localIdentifier: "testidentifier",
      name: dataFactory.literal("Test name"),
      maxTokenOutput: 5,
      trainingDataCutoff: "Test cutoff",
      url: "http://example.com/mlm",
    });
  });

  it("should generate valid TypeScript interfaces", ({ expect }) => {
    const mlm: generated.LanguageModel = {
      contextWindow: 1,
      description: Maybe.of(dataFactory.literal("Test description")),
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: {
        description: Maybe.of(dataFactory.literal("Family description")),
        identifier: dataFactory.namedNode("http://example.com/family"),
        manufacturer: {
          identifier: dataFactory.namedNode("http://examhple.com/organization"),
          name: dataFactory.literal("name"),
          type: "Organization",
        },
        name: dataFactory.literal("name"),
        type: "MachineLearningModelFamily",
        url: Maybe.of("http://example.com/family"),
      },
      localIdentifier: "testidentifier",
      maxTokenOutput: Maybe.of(1),
      name: dataFactory.literal("Test name"),
      trainingDataCutoff: Maybe.of("cutoff"),
      type: "LanguageModel",
      url: Maybe.of("http://example.com/mlm"),
    };
    expect(mlm.name.value).toStrictEqual("Test name");
  });

  it("should construct a class instance from parameters", ({ expect }) => {
    expect(languageModel.description.isNothing()).toStrictEqual(true);
    expect(
      languageModel.isVariantOf.description.extractNullable()?.value,
    ).toStrictEqual("Family description");
    expect(languageModel.name.value).toStrictEqual("Test name");
  });

  it("equals should return true with two equal objects", ({ expect }) => {
    expect(organization.equals(organization).extract()).toStrictEqual(true);
  });

  it("equals should return an Unequals with two unequal objects", ({
    expect,
  }) => {
    expect(
      organization
        .equals(
          new generated.Organization.Class({
            identifier: dataFactory.namedNode("http://example.com/other"),
            name: dataFactory.literal("Other"),
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
      }) => Resource<NamedNode>;
    },
  >({
    expect,
    modelFromRdf,
    model,
  }: {
    expect: ExpectStatic;
    modelFromRdf: (kwds: {
      dataFactory: DataFactory;
      resource: Resource<NamedNode>;
    }) => Either<Resource.ValueError, ModelT>;
    model: ModelT;
  }) {
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const resource = model.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet,
    });
    const fromRdfModel = modelFromRdf({ dataFactory, resource }).unsafeCoerce();
    expect(fromRdfModel.equals(model).extract()).toStrictEqual(true);
  }

  it("fromRdf (LanguageModel)", ({ expect }) => {
    testFromRdf({
      expect,
      model: languageModel,
      modelFromRdf: generated.LanguageModel.Class.fromRdf,
    });
  });

  it("fromRdf (Organization)", ({ expect }) => {
    testFromRdf({
      expect,
      model: organization,
      modelFromRdf: generated.Organization.Class.fromRdf,
    });
  });

  it("toRdf should populate a dataset", ({ expect }) => {
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
        .value(rdf.type)
        .chain((value) => value.toIri())
        .unsafeCoerce()
        .equals(
          dataFactory.namedNode(
            "http://purl.annotize.ai/ontology/mlm#Organization",
          ),
        ),
    ).toStrictEqual(true);
    expect(
      resource
        .value(dataFactory.namedNode("https://schema.org/name"))
        .chain((value) => value.toString())
        .unsafeCoerce(),
    ).toStrictEqual("Test organization");
  });

  it("toRdf should produce serializable RDF", ({ expect }) => {
    const dataset = new N3.Store();
    languageModel.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    const ttl = new N3.Writer({ format: "text/turtle" }).quadsToString([
      ...dataset,
    ]);
    expect(ttl).not.toHaveLength(0);
  });
});
