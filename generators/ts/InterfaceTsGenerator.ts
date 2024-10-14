import type { SourceFile } from "ts-morph";
import { TsGenerator } from "./TsGenerator";
import type * as types from "./types";

export class InterfaceTsGenerator extends TsGenerator {
  protected override addImportDeclarations(toSourceFile: SourceFile): void {
    toSourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });

    toSourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });
  }

  protected override addObjectType(
    objectType: types.ObjectType,
    toSourceFile: SourceFile,
  ) {
    toSourceFile.addInterface(objectType.interfaceDeclaration);
  }
}
