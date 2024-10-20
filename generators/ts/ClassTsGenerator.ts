import type { SourceFile } from "ts-morph";
import { TsGenerator } from "./TsGenerator";
import type * as types from "./types";

export class ClassTsGenerator extends TsGenerator {
  protected override generateSourceFile(
    objectTypes: readonly types.ObjectType[],
    sourceFile: SourceFile,
  ) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });

    sourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts-helpers",
      namespaceImport: "purifyHelpers",
    });

    sourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });

    sourceFile.addImportDeclaration({
      moduleSpecifier: "rdfjs-resource",
      namespaceImport: "rdfjsResource",
    });

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
