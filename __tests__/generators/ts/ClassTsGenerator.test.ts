import { rdf } from "@tpluscode/rdf-ns-builders";
import { DataFactory as dataFactory } from "n3";
import N3 from "n3";
import { MutableResourceSet } from "rdfjs-resource";
import { beforeAll, describe, it } from "vitest";
import * as classes from "../../../examples/mlm/generated/classes.js";

describe("ClassTsGenerator", () => {
  let languageModel: classes.LanguageModel;
  let organization: classes.Organization;

  beforeAll(() => {
    organization = new classes.Organization({
      identifier: dataFactory.namedNode("http://example.com/organization"),
      name: dataFactory.literal("Test organization"),
    });

    languageModel = new classes.LanguageModel({
      contextWindow: 1,
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: new classes.MachineLearningModelFamily({
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
          new classes.Organization({
            identifier: dataFactory.namedNode("http://example.com/other"),
            name: dataFactory.literal("Other"),
          }),
        )
        .extract(),
    ).not.toStrictEqual(true);
  });

  it("fromRdf should deserialize the results of toRdf (Organization)", ({
    expect,
  }) => {
    const dataset = new N3.Store();
    const resourceSet = new MutableResourceSet({ dataFactory, dataset });
    const resource = organization.toRdf({
      mutateGraph: dataFactory.defaultGraph(),
      resourceSet,
    });
    const fromRdfOrganization = classes.Organization.fromRdf({
      dataFactory,
      resource,
    }).unsafeCoerce();
    expect(fromRdfOrganization.equals(organization).extract()).toStrictEqual(
      true,
    );
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
