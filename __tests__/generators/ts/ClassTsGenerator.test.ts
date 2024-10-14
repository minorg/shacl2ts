import { beforeAll, describe, it } from "vitest";
import { ClassTsGenerator } from "../../../generators/ts";
import { testData } from "../../data/testData.js";

describe("ClassTsGenerator", () => {
  let sut: ClassTsGenerator;

  beforeAll(() => {
    sut = new ClassTsGenerator(testData().mlm.ast);
  });

  it("should generate TypeScript classes", ({ expect }) => {
    const tsString = sut.generate();
    expect(tsString).not.toHaveLength(0);
  });
});
