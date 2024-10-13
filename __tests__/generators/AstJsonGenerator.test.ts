import { beforeAll, describe, it } from "vitest";
import { AstJsonGenerator } from "../../generators";
import { testData } from "../data/testData.js";

describe("AstJsonGenerator", () => {
  let sut: AstJsonGenerator;

  beforeAll(() => {
    sut = new AstJsonGenerator(testData().sdo.ast);
  });

  it("should generate JSON", ({ expect }) => {
    const jsonString = sut.generate();
    const json = JSON.parse(jsonString);
    expect(Object.entries(json)).not.toHaveLength(0);
  });
});
