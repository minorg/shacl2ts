import { beforeAll, describe, expect, it } from "vitest";
import { ShapesGraphToAstTransformer } from "../ShapesGraphToAstTransformer.js";
import { ObjectType } from "../ast/ObjectType.js";
import { schema } from "@tpluscode/rdf-ns-builders";
import { testData } from "./testData.js";

describe("ShapesGraphToAstTransformer", () => {
  // let addressObjectType: ObjectType;
  let personObjectType: ObjectType;

  beforeAll(() => {
    const ast = new ShapesGraphToAstTransformer(testData.shapesGraph)
      .transform()
      .extract();
    if (ast instanceof Error) {
      throw ast;
    }
    expect(ast.objectTypes).toHaveLength(56);

    // const addressObjectType = ast.objectTypes.find(
    //   (objectType) => objectType.name.tsName === "Address",
    // );
    // expect(addressObjectType).toBeDefined();

    personObjectType = ast.objectTypes.find((objectType) =>
      objectType.name.identifier.equals(schema.Person),
    )!;
    expect(personObjectType).toBeDefined();
  });

  it("should transform the givenName property", () => {
    const property = personObjectType.properties.find((property) =>
      property.path.iri.equals(schema.givenName),
    );
    expect(property).toBeDefined();
    expect(property?.type.kind).toStrictEqual("Literal");
    expect(property?.name.tsName).toStrictEqual("given$W$name");
  });
});
