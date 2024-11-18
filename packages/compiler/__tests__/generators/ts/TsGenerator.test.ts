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
import * as mlmClasses from "../../../examples/mlm/generated/classes.js";
import * as mlmInterfaces from "../../../examples/mlm/generated/interfaces.js";
import * as skosClasses from "../../../examples/skos/generated/classes.js";
import * as skosInterfaces from "../../../examples/skos/generated/interfaces.js";

describe("TsGenerator", () => {
  let mlmLanguageModel: mlmClasses.LanguageModel;
  let mlmOrganization: mlmClasses.Organization;
  let skosOrderedCollection: skosClasses.OrderedCollection;

  beforeAll(() => {
    mlmOrganization = new mlmClasses.Organization({
      identifier: dataFactory.namedNode("http://example.com/organization"),
      name: dataFactory.literal("Test organization"),
    });

    mlmLanguageModel = new mlmClasses.LanguageModel({
      contextWindow: 1,
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: new mlmClasses.MachineLearningModelFamily({
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

    skosOrderedCollection = new skosClasses.OrderedCollection({
      identifier: dataFactory.namedNode("http://example.com/collection"),
      memberList: [
        dataFactory.namedNode("http://example.com/collection/member1"),
        dataFactory.namedNode("http://example.com/collection/member2"),
      ],
    });
  });

  it("should generate valid TypeScript interfaces", ({ expect }) => {
    const languageModel: mlmInterfaces.LanguageModel = {
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
    expect(languageModel.name.value).toStrictEqual("Test name");
  });

  it("should construct a class instance from convertible parameters", ({
    expect,
  }) => {
    expect(mlmLanguageModel.description.isNothing()).toStrictEqual(true);
    expect(
      mlmLanguageModel.isVariantOf.description.extractNullable()?.value,
    ).toStrictEqual("Family description");
    expect(mlmLanguageModel.name.value).toStrictEqual("Test name");
  });

  it("class equals should return true with two equal objects", ({ expect }) => {
    expect(mlmOrganization.equals(mlmOrganization).extract()).toStrictEqual(
      true,
    );
  });

  it("interface function equals should return true with two equal objects", ({
    expect,
  }) => {
    expect(
      mlmInterfaces.Organization.equals(
        mlmOrganization,
        mlmOrganization,
      ).extract(),
    ).toStrictEqual(true);
  });

  it("equals should return an Unequals with two unequal objects", ({
    expect,
  }) => {
    expect(
      mlmOrganization
        .equals(
          new mlmClasses.Organization({
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
      modelFromRdf: mlmClasses.LanguageModel.fromRdf,
    });
  });

  it("fromRdf (Organization)", ({ expect }) => {
    testFromRdf({
      expect,
      model: mlmOrganization,
      modelFromRdf: mlmClasses.Organization.fromRdf,
    });
  });

  it("hash (LanguageModel)", ({ expect }) => {
    expect(mlmLanguageModel.hash(sha256.create()).hex()).toStrictEqual(
      "669d910ea677defc8168cda3f3a817369d8bff0cba7f53485d1dc15c7d344af9",
    );
  });

  it("hash (Organization)", ({ expect }) => {
    expect(mlmOrganization.hash(sha256.create()).hex()).toStrictEqual(
      "0f0af2d595591bcf0f43ca8eac4775672867bcf94040703f2ecc573c7dbdd088",
    );
  });

  it("class toRdf should populate a dataset", ({ expect }) => {
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

  it("class toRdf should produce serializable RDF", ({ expect }) => {
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

  it("class toRdf should serialize and deserialize a list", ({ expect }) => {
    const dataset = new N3.Store();
    const skosOrderedCollectionResource = skosOrderedCollection.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet: new MutableResourceSet({ dataFactory, dataset }),
    });
    const ttl = new N3.Writer({ format: "text/turtle" }).quadsToString([
      ...dataset,
    ]);
    expect(ttl).not.toHaveLength(0);

    const skosOrderedCollectionFromRdf =
      skosInterfaces.OrderedCollection.fromRdf(
        skosOrderedCollectionResource,
      ).unsafeCoerce();
    expect(
      skosInterfaces.OrderedCollection.equals(
        skosOrderedCollectionFromRdf,
        skosOrderedCollection,
      ).extract(),
    ).toStrictEqual(true);
  });
});
