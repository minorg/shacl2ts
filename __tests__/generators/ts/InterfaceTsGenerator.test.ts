import dataFactory from "@rdfjs/data-model";
import { Maybe } from "purify-ts";
import { describe, it } from "vitest";
import type * as interfaces from "../../../examples/mlm/generated/interfaces.js";

describe("InterfaceTsGenerator", () => {
  it("should generate valid TypeScript interfaces", ({ expect }) => {
    const mlm: interfaces.MachineLearningModel = {
      contextWindow: 1,
      description: Maybe.of("Test description"),
      has_identifier: ["testidentifier"],
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: [
        {
          description: Maybe.of("Family description"),
          identifier: dataFactory.namedNode("http://example.com/family"),
          label: [dataFactory.literal("should not be a string")],
          name: "Family",
          url: Maybe.of("http://example.com/family"),
        },
      ],
      maxTokenOutput: Maybe.of("should not be a string"),
      name: "Test name",
      label: [dataFactory.literal("Test label")],
      trainingDataCutoff: ["should not be a string"],
      url: Maybe.of("http://example.com/mlm"),
    };
    expect(mlm.name).toStrictEqual("Test name");
  });
});
