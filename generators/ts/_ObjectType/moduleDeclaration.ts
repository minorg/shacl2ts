import {
  type ModuleDeclarationStructure,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import {
  classConstructorParametersInterfaceDeclaration,
  classDeclaration,
  equalsFunctionDeclaration,
  fromRdfFunctionDeclaration,
  sparqlGraphPatternsClassDeclaration,
  toRdfFunctionDeclaration,
} from ".";
import type { ObjectType } from "../ObjectType.js";

export function moduleDeclaration(
  this: ObjectType,
): ModuleDeclarationStructure {
  const statements: StatementStructures[] = [];

  if (this.configuration.features.has("class")) {
    const classDeclaration_ = classDeclaration.bind(this)();
    statements.push(classDeclaration_);

    statements.push({
      isExported: true,
      kind: StructureKind.Module,
      name: classDeclaration_.name!,
      statements: [classConstructorParametersInterfaceDeclaration.bind(this)()],
    });
  }

  if (this.configuration.features.has("equals")) {
    statements.push(equalsFunctionDeclaration.bind(this)());
  }

  if (this.configuration.features.has("fromRdf")) {
    statements.push(fromRdfFunctionDeclaration.bind(this)());
  }

  if (this.configuration.features.has("sparql-graph-patterns")) {
    if (this.superObjectTypes.length > 1) {
      throw new RangeError(
        `object type '${this.astName}' has multiple super object types, can't use with SPARQL graph patterns`,
      );
    }

    statements.push(sparqlGraphPatternsClassDeclaration.bind(this)());
  }

  if (this.configuration.features.has("toRdf")) {
    statements.push(toRdfFunctionDeclaration.bind(this)());
  }

  return {
    isExported: true,
    kind: StructureKind.Module,
    name: this.astName,
    statements: statements,
  };
}
