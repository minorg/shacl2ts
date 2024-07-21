import { beforeAll, describe, expect, it } from "vitest";
import { ShapesGraphToAstTransformer } from "../ShapesGraphToAstTransformer.js";
import { ObjectType } from "../ast/ObjectType.js";
import { schema } from "@tpluscode/rdf-ns-builders";
import { testData } from "./testData.js";

describe("ShapesGraphToAstTransformer", () => {
  // let addressObjectType: ObjectType;
  let personObjectType: ObjectType;

  beforeAll(() => {
    const ast = new ShapesGraphToAstTransformer()
      .transform(testData.shapesGraph)
      .extract();
    if (ast instanceof Error) {
      throw ast;
    }
    expect(ast.objectTypes).toHaveLength(2);

    // const addressObjectType = ast.objectTypes.find(
    //   (objectType) => objectType.name.tsName === "Address",
    // );
    // expect(addressObjectType).toBeDefined();

    const personObjectType = ast.objectTypes.find(
      (objectType) => objectType.name.tsName === "Person",
    );
    expect(personObjectType).toBeDefined();
  });

  it("should transform the two object types", () => {
    expect(personObjectType.properties).toHaveLength(4);
  });

  it("should transform the givenName property", () => {
    const property = personObjectType.properties.find((property) =>
      property.path.equals(schema.givenName),
    );
    expect(property).toBeDefined();
  });
});
