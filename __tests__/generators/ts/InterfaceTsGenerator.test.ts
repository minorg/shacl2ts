import { beforeAll, describe, it } from "vitest";
import { InterfaceTsGenerator } from "../../../generators/ts";
import { testData } from "../../data/testData.js";

describe("InterfaceTsGenerator", () => {
  let sut: InterfaceTsGenerator;

  beforeAll(() => {
    sut = new InterfaceTsGenerator(testData().mlm.ast);
  });

  it("should generate TypeScript interfaces", ({ expect }) => {
    const tsString = sut.generate();
    expect(tsString).not.toHaveLength(0);
  });
});
