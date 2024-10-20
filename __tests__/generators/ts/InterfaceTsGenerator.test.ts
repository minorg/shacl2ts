import { DataFactory as dataFactory } from "n3";
import { Maybe } from "purify-ts";
import { describe, it } from "vitest";
import type * as interfaces from "../../../examples/mlm/generated/interfaces.js";

describe("InterfaceTsGenerator", () => {
  it("should generate valid TypeScript interfaces", ({ expect }) => {
    const mlm: interfaces.LanguageModel = {
      contextWindow: 1,
      description: Maybe.of(dataFactory.literal("Test description")),
      identifier: dataFactory.namedNode("http://example.com/mlm"),
      isVariantOf: {
        description: Maybe.of(dataFactory.literal("Family description")),
        identifier: dataFactory.namedNode("http://example.com/family"),
        manufacturer: {
          identifier: dataFactory.namedNode("http://examhple.com/organization"),
          name: dataFactory.literal("name"),
        },
        name: dataFactory.literal("name"),
        url: Maybe.of("http://example.com/family"),
      },
      localIdentifier: "testidentifier",
      maxTokenOutput: Maybe.of(1),
      name: dataFactory.literal("Test name"),
      trainingDataCutoff: Maybe.of("cutoff"),
      url: Maybe.of("http://example.com/mlm"),
    };
    expect(mlm.name.value).toStrictEqual("Test name");
  });
});
