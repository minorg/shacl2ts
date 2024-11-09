import { Project, type SourceFile } from "ts-morph";
import type * as ast from "../../ast";
import { Configuration } from "./Configuration.js";
import type { ObjectType } from "./ObjectType.js";
import { TypeFactory } from "./TypeFactory.js";
import { tsName } from "./tsName.js";

export class TsGenerator {
  private readonly configuration: Configuration;

  constructor(
    private ast: ast.Ast,
    configuration?: Configuration,
  ) {
    this.configuration = configuration ?? new Configuration();
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
      return tsName(left.name).localeCompare(tsName(right.name));
    });

    const project = new Project({
      useInMemoryFileSystem: true,
    });
    const sourceFile = project.createSourceFile("generated.ts");

    const typeFactory = new TypeFactory({ configuration: this.configuration });

    this.generateSourceFile(
      astObjectTypes.flatMap((astObjectType) => {
        const type = typeFactory.createTypeFromAstType(astObjectType);
        return type.kind === "Object" ? [type as ObjectType] : [];
      }),
      sourceFile,
    );

    sourceFile.saveSync();

    return project.getFileSystem().readFileSync(sourceFile.getFilePath());
  }

  private addImportDeclarations(
    objectTypes: readonly ObjectType[],
    sourceFile: SourceFile,
  ) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });

    sourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });

    sourceFile.addStatements(this.configuration.dataFactoryImport);

    if (this.configuration.features.has("equals")) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: "purify-ts-helpers",
        namespaceImport: "purifyHelpers",
      });
    }

    if (
      this.configuration.features.has("fromRdf") ||
      this.configuration.features.has("toRdf")
    ) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: "rdfjs-resource",
        namespaceImport: "rdfjsResource",
      });
    }

    if (this.configuration.features.has("sparql-graph-patterns")) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: "@kos-kit/sparql-builder",
        namespaceImport: "sparqlBuilder",
      });
    }

    const typeImportStatements = new Set<string>();
    for (const objectType of objectTypes) {
      for (const importStatement of objectType.importStatements) {
        typeImportStatements.add(importStatement);
      }
    }
    sourceFile.addStatements([...typeImportStatements]);
  }

  private generateSourceFile(
    objectTypes: readonly ObjectType[],
    sourceFile: SourceFile,
  ) {
    this.addImportDeclarations(objectTypes, sourceFile);

    for (const objectType of objectTypes) {
      // If there are classes the unqualified object type name is a class
      // Otherwise it's an interface

      if (this.configuration.features.has("class")) {
        sourceFile.addClass(objectType.classDeclaration());
      } else {
        sourceFile.addInterface(objectType.interfaceDeclaration());
      }

      sourceFile.addModule(objectType.moduleDeclaration());
    }
  }
}
