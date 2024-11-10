import {
  type SourceFile,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type { ObjectType } from "./ObjectType.js";
import { TsGenerator } from "./TsGenerator.js";

export class ClassTsGenerator extends TsGenerator {
  protected addDeclarations(
    objectTypes: readonly ObjectType[],
    sourceFile: SourceFile,
  ) {
    this.addImportDeclarations(objectTypes, sourceFile);

    for (const objectType of objectTypes) {
      sourceFile.addClass(objectType.classDeclaration());

      const moduleStatements: StatementStructures[] = [];

      if (this.configuration.features.has("sparql-graph-patterns")) {
        if (objectType.parentObjectTypes.length > 1) {
          throw new RangeError(
            `object type '${objectType.astName}' has multiple super object types, can't use with SPARQL graph patterns`,
          );
        }

        moduleStatements.push(objectType.sparqlGraphPatternsClassDeclaration());
      }

      sourceFile.addModule({
        isExported: true,
        kind: StructureKind.Module,
        name: objectType.astName,
        statements: moduleStatements,
      });
    }
  }
}
