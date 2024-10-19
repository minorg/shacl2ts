import dataFactory from "@rdfjs/data-model";
import { describe, it } from "vitest";
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
});
