import type { SourceFile } from "ts-morph";
import { TsGenerator } from "./TsGenerator";
import type * as types from "./types";

export class ClassTsGenerator extends TsGenerator {
  protected override generateSourceFile(
    objectTypes: readonly types.ObjectType[],
    sourceFile: SourceFile,
  ) {
    sourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });

    sourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });

    sourceFile.addStatements([
      `\
function initZeroOrOneProperty<T>(value: purify.Maybe<T> | T | undefined): purify.Maybe<T> {
  if (typeof value === "undefined") {
      return purify.Maybe.empty();
  }
  if (typeof value === "object" && purify.Maybe.isMaybe(value)) {
      return value;
  }
  return purify.Maybe.of(value);
}`,
    ]);

    for (const objectType of objectTypes) {
      if (objectType.superObjectTypes.length > 1) {
        throw new RangeError(
          `object type '${objectType.name}' has multiple super object types, can't use with classes`,
        );
      }

      sourceFile.addClass(objectType.classDeclaration);

      sourceFile.addModule(objectType.moduleDeclaration);
    }
  }
}
