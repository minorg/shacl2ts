import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { sha256 } from "js-sha256";
import N3, { DataFactory as dataFactory } from "n3";
import { type Either, Maybe } from "purify-ts";
import type { Equatable } from "purify-ts-helpers";
import {
  type MutableResource,
  MutableResourceSet,
  type Resource,
} from "rdfjs-resource";
import { type ExpectStatic, beforeAll, describe, it } from "vitest";
import * as mlm from "../../../examples/mlm/generated/generated.js";
import * as skos from "../../../examples/skos/generated/generated.js";

describe("TsGenerator", () => {
  let mlmLanguageModel: mlm.LanguageModel.Class;
  let mlmOrganization: mlm.Organization.Class;
  let skosOrderedCollection: skos.OrderedCollection.Class;

  beforeAll(() => {
    mlmOrganization = new mlm.Organization.Class({
      identifier: dataFactory.namedNode("http://example.com/organization"),
      name: dataFactory.literal("Test organization"),
    });

    mlmLanguageModel = new mlm.LanguageModel.Class({
      contextWindow: 1,
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: new mlm.MachineLearningModelFamily.Class({
        description: dataFactory.literal("Family description"),
        identifier: dataFactory.namedNode("http://example.com/family"),
        manufacturer: mlmOrganization,
        name: dataFactory.literal("Family"),
        url: "http://example.com/family",
      }),
      localIdentifier: "testidentifier",
      name: dataFactory.literal("Test name"),
      maxTokenOutput: 5,
      trainingDataCutoff: "Test cutoff",
      url: "http://example.com/mlm",
    });

    skosOrderedCollection = new skos.OrderedCollection.Class({
      identifier: dataFactory.namedNode("http://example.com/collection"),
      memberList: [
        dataFactory.namedNode("http://example.com/collection/member1"),
        dataFactory.namedNode("http://example.com/collection/member2"),
      ],
    });
  });

  it("should generate valid TypeScript interfaces", ({ expect }) => {
    const mlm: mlm.LanguageModel = {
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
    expect(mlmLanguageModel.description.isNothing()).toStrictEqual(true);
    expect(
      mlmLanguageModel.isVariantOf.description.extractNullable()?.value,
    ).toStrictEqual("Family description");
    expect(mlmLanguageModel.name.value).toStrictEqual("Test name");
  });

  it("equals should return true with two equal objects", ({ expect }) => {
    expect(mlmOrganization.equals(mlmOrganization).extract()).toStrictEqual(
      true,
    );
  });

  it("equals should return an Unequals with two unequal objects", ({
    expect,
  }) => {
    expect(
      mlmOrganization
        .equals(
          new mlm.Organization.Class({
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
    modelFromRdf: (
      resource: Resource<NamedNode>,
    ) => Either<Resource.ValueError, ModelT>;
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

  it("fromRdf (LanguageModel)", ({ expect }) => {
    testFromRdf({
      expect,
      model: mlmLanguageModel,
      modelFromRdf: mlm.LanguageModel.Class.fromRdf,
    });
  });

  it("fromRdf (Organization)", ({ expect }) => {
    testFromRdf({
      expect,
      model: mlmOrganization,
      modelFromRdf: mlm.Organization.Class.fromRdf,
    });
  });

  it("hash (LanguageModel)", ({ expect }) => {
    expect(mlmLanguageModel.hash(sha256.create()).hex()).toStrictEqual(
      "7fead1d8ac51c47873f3426e599233c7caf247743e684ad2f46dfd9c1f79850c",
    );
  });

  it("hash (Organization)", ({ expect }) => {
    expect(mlmOrganization.hash(sha256.create()).hex()).toStrictEqual(
      "1cbaacc89707adaba94f7e5a3099c68a1b3e30b73c885824bb15bd67835af599",
    );
  });

  it("toRdf should populate a dataset", ({ expect }) => {
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const resource = mlmOrganization.toRdf({
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
    mlmLanguageModel.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    const ttl = new N3.Writer({ format: "text/turtle" }).quadsToString([
      ...dataset,
    ]);
    expect(ttl).not.toHaveLength(0);
  });

  it("toRdf should serialize and deserialize a list", ({ expect }) => {
    const dataset = new N3.Store();
    const skosOrderedCollectionResource = skosOrderedCollection.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    const ttl = new N3.Writer({ format: "text/turtle" }).quadsToString([
      ...dataset,
    ]);
    expect(ttl).not.toHaveLength(0);

    const skosOrderedCollectionFromRdf = skos.OrderedCollection.fromRdf(
      skosOrderedCollectionResource,
    ).unsafeCoerce();
    expect(
      skos.OrderedCollection.equals(
        skosOrderedCollectionFromRdf,
        skosOrderedCollection,
      ).extract(),
    ).toStrictEqual(true);
  });
});
