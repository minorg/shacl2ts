import {
  Project,
  type SourceFile,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import * as ast from "../../ast/index.js";
import type { Generator } from "../Generator.js";
import { ObjectType } from "./ObjectType.js";
import { ObjectUnionType } from "./ObjectUnionType.js";
import { TypeFactory } from "./TypeFactory.js";

export class TsGenerator implements Generator {
  generate(ast_: ast.Ast): string {
    const sortedAstObjectTypes = ast.ObjectType.toposort(ast_.objectTypes);

    const project = new Project({
      useInMemoryFileSystem: true,
    });
    const sourceFile = project.createSourceFile("generated.ts");

    const typeFactory = new TypeFactory({
      dataFactoryVariable: ast_.tsDataFactoryVariable,
    });

    this.addDeclarations({
      objectTypes: sortedAstObjectTypes.flatMap((astObjectType) => {
        const type = typeFactory.createTypeFromAstType(astObjectType);
        return type instanceof ObjectType ? [type] : [];
      }),
      objectUnionTypes: ast_.objectUnionTypes.flatMap((astObjectUnionType) => {
        const type = typeFactory.createTypeFromAstType(astObjectUnionType);
        return type instanceof ObjectUnionType ? [type] : [];
      }),
      sourceFile,
    });

    sourceFile.saveSync();

    return project.getFileSystem().readFileSync(sourceFile.getFilePath());
  }

  private addDeclarations({
    objectTypes,
    objectUnionTypes,
    sourceFile,
  }: {
    objectTypes: readonly ObjectType[];
    objectUnionTypes: readonly ObjectUnionType[];
    sourceFile: SourceFile;
  }): void {
    // sourceFile.addStatements(this.configuration.dataFactoryImport);
    sourceFile.addStatements('import { DataFactory as dataFactory } from "n3"');

    for (const objectType of objectTypes) {
      this.addObjectTypeDeclarations({ objectType, sourceFile });
    }

    for (const objectUnionType of objectUnionTypes) {
      this.addObjectUnionTypeDeclarations({ objectUnionType, sourceFile });
    }
  }

  private addObjectTypeDeclarations({
    objectType,
    sourceFile,
  }: { objectType: ObjectType; sourceFile: SourceFile }): void {
    sourceFile.addStatements(objectType.declarationImports);

    sourceFile.addStatements([
      ...objectType.classDeclaration().toList(),
      ...objectType.interfaceDeclaration().toList(),
    ]);

    const moduleStatements: StatementStructures[] = [
      ...objectType.equalsFunctionDeclaration().toList(),
      ...objectType.fromRdfFunctionDeclaration().toList(),
      ...objectType.hashFunctionDeclaration().toList(),
      ...objectType.sparqlGraphPatternsClassDeclaration().toList(),
      ...objectType.toRdfFunctionDeclaration().toList(),
    ];

    if (moduleStatements.length > 0) {
      sourceFile.addModule({
        isExported: objectType.export,
        kind: StructureKind.Module,
        name: objectType.name,
        statements: moduleStatements,
      });
    }
  }

  private addObjectUnionTypeDeclarations({
    objectUnionType,
    sourceFile,
  }: { objectUnionType: ObjectUnionType; sourceFile: SourceFile }): void {
    sourceFile.addStatements(objectUnionType.declarationImports);

    sourceFile.addTypeAlias(objectUnionType.typeAliasDeclaration);

    const moduleStatements: StatementStructures[] = [
      ...objectUnionType.equalsFunctionDeclaration.toList(),
      ...objectUnionType.fromRdfFunctionDeclaration.toList(),
      ...objectUnionType.hashFunctionDeclaration.toList(),
      ...objectUnionType.sparqlGraphPatternsClassDeclaration.toList(),
      ...objectUnionType.toRdfFunctionDeclaration.toList(),
    ];

    if (moduleStatements.length > 0) {
      sourceFile.addModule({
        isExported: objectUnionType.export,
        kind: StructureKind.Module,
        name: objectUnionType.name,
        statements: moduleStatements,
      });
    }
  }
}
