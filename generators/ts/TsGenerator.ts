import { Project, type SourceFile } from "ts-morph";
import type * as ast from "../../ast";
import * as types from "./types";

export class TsGenerator {
  private readonly features: Set<TsGenerator.Feature>;

  constructor(
    private ast: ast.Ast,
    options?: { features?: Set<TsGenerator.Feature> },
  ) {
    this.features = new Set<TsGenerator.Feature>(
      options?.features ? [...options.features] : [],
    );
    if (this.features.size === 0) {
      this.features.add("class");
      this.features.add("equals");
      this.features.add("fromRdf");
      this.features.add("toRdf");
      this.features.add("sparql-graph-patterns");
    }
  }

  generate(): string {
    const astObjectTypes = this.ast.objectTypes.concat();
    astObjectTypes.sort((left, right) => {
      if (
        left.ancestorObjectTypes.some((ancestorObjectType) =>
          ancestorObjectType.name.identifier.equals(right.name.identifier),
        )
      ) {
        // Right is an ancestor of left, right must come first
        return 1;
      }
      if (
        right.ancestorObjectTypes.some((ancestorObjectType) =>
          ancestorObjectType.name.identifier.equals(left.name.identifier),
        )
      ) {
        // Left is an ancestor of right, left must come first
        return -1;
      }
      // Neither is an ancestor of the other, sort by name
      return left.name.tsName.localeCompare(right.name.tsName);
    });

    const project = new Project({
      useInMemoryFileSystem: true,
    });
    const sourceFile = project.createSourceFile("generated.ts");

    this.generateSourceFile(
      astObjectTypes.map(types.ObjectType.fromAstType),
      sourceFile,
    );

    sourceFile.saveSync();

    return project.getFileSystem().readFileSync(sourceFile.getFilePath());
  }

  private addImportDeclarations(sourceFile: SourceFile) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });

    sourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });

    if (this.features.has("equals")) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: "purify-ts-helpers",
        namespaceImport: "purifyHelpers",
      });
    }

    if (this.features.has("fromRdf") || this.features.has("toRdf")) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: "rdfjs-resource",
        namespaceImport: "rdfjsResource",
      });
    }

    if (this.features.has("sparql-graph-patterns")) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: "@kos-kit/sparql-builder",
        namespaceImport: "sparqlBuilder",
      });
    }
  }

  private generateSourceFile(
    objectTypes: readonly types.ObjectType[],
    sourceFile: SourceFile,
  ) {
    this.addImportDeclarations(sourceFile);

    for (const objectType of objectTypes) {
      sourceFile.addInterface(objectType.interfaceDeclaration());
      sourceFile.addModule(objectType.moduleDeclaration(this.features));
    }
  }
}

export namespace TsGenerator {
  export type Feature =
    | "class"
    | "equals"
    | "fromRdf"
    | "toRdf"
    | "sparql-graph-patterns";
}
