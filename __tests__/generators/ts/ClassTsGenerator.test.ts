import dataFactory from "@rdfjs/data-model";
import { Maybe } from "purify-ts";
import { describe, it } from "vitest";
import * as classes from "../../../examples/mlm/generated/classes.js";

describe("ClassTsGenerator", () => {
  it("should construct a class instance from parameters", ({ expect }) => {
    const mlm = new classes.MachineLearningModel({
      contextWindow: 1,
      has_identifier: ["testidentifier"],
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: [
        new classes.MachineLearningModelFamily({
          description: "Family description",
          identifier: dataFactory.namedNode("http://example.com/family"),
          label: [dataFactory.literal("should not be a string")],
          name: "Family",
          url: "http://example.com/family",
        }),
      ],
      maxTokenOutput: Maybe.of("should not be a string"),
      name: "Test name",
      label: [dataFactory.literal("Test label")],
      trainingDataCutoff: ["should not be a string"],
      url: "http://example.com/mlm",
    });
    expect(mlm.description.isNothing()).toStrictEqual(true);
    expect(mlm.isVariantOf[0].description.extractNullable()).toStrictEqual(
      "Family description",
    );
    expect(mlm.name).toStrictEqual("Test name");
  });
});
