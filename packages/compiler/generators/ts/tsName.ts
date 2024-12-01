import { Resource } from "rdfjs-resource";
import type * as ast from "../../ast/index.js";
import { stringToValidTsIdentifier } from "./stringToValidTsIdentifier.js";

export function tsName(astName: ast.Name): string {
  for (const tsNameAlternative of [
    astName.shaclmateName.extract(),
    astName.shName.extract()?.replace(" ", "_"),
    astName.curie.map((curie) => curie.replace(":", "_")).extract(),
    astName.propertyPath
      .chain((propertyPath) =>
        propertyPath.curie.map((curie) => curie.replace(":", "_")),
      )
      .extract(),
    astName.propertyPath
      .map((propertyPath) =>
        Resource.Identifier.toString(propertyPath.identifier),
      )
      .extract(),
    Resource.Identifier.toString(astName.identifier),
  ]) {
    if (tsNameAlternative) {
      return stringToValidTsIdentifier(tsNameAlternative);
    }
  }

  throw new Error("should never reach this point");
}
