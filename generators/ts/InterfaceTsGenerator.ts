import type { SourceFile } from "ts-morph";
import { TsGenerator } from "./TsGenerator";
import type * as types from "./types";

export class InterfaceTsGenerator extends TsGenerator {
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
      isTypeOnly: true,
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });

    for (const objectType of objectTypes) {
      sourceFile.addInterface(objectType.interfaceDeclaration);
    }
  }
}
