import type { SourceFile } from "ts-morph";
import { TsGenerator } from "./TsGenerator";
import type * as types from "./types";

export class ClassTsGenerator extends TsGenerator {
  protected override addImportDeclarations(toSourceFile: SourceFile): void {
    toSourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });

    toSourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });
  }

  protected override addObjectType(
    objectType: types.ObjectType,
    toSourceFile: SourceFile,
  ) {
    if (objectType.superObjectTypes.length > 1) {
      throw new RangeError(
        `object type '${objectType.name}' has multiple super object types, can't use with classes`,
      );
    }

    toSourceFile.addClass(objectType.classDeclaration);

    toSourceFile.addModule(objectType.moduleDeclaration);
  }
}
