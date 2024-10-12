import { schema } from "@tpluscode/rdf-ns-builders";
import { beforeAll, describe, expect, it } from "vitest";
import type { ObjectType } from "../ast/ObjectType.js";
import { testData } from "./data/testData.js";

describe("ShapesGraphToAstTransformer", () => {
  // let addressObjectType: ObjectType;
  let personObjectType: ObjectType;

  beforeAll(() => {
    const ast = testData().sdo.ast;
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

  it("should transform the givenName property", ({ expect }) => {
    const property = personObjectType.properties.find((property) =>
      property.path.iri.equals(schema.givenName),
    );
    expect(property).toBeDefined();
    expect(property?.type.kind).toStrictEqual("Literal");
    expect(property?.name.tsName).toStrictEqual("given_name");
  });
});
