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
import type { TsGenerator } from "../../TsGenerator.js";
import type { ObjectType } from "../ObjectType.js";

export function moduleDeclaration(
  this: ObjectType,
  features: Set<TsGenerator.Feature>,
): ModuleDeclarationStructure {
  const statements: StatementStructures[] = [];

  if (features.has("class")) {
    const classDeclaration_ = classDeclaration.bind(this)(features);
    statements.push(classDeclaration_);

    statements.push({
      isExported: true,
      kind: StructureKind.Module,
      name: classDeclaration_.name!,
      statements: [classConstructorParametersInterfaceDeclaration.bind(this)()],
    });
  }

  if (features.has("equals")) {
    statements.push(equalsFunctionDeclaration.bind(this)());
  }

  if (features.has("fromRdf")) {
    statements.push(fromRdfFunctionDeclaration.bind(this)());
  }

  if (features.has("sparql-graph-patterns")) {
    if (this.superObjectTypes.length > 1) {
      throw new RangeError(
        `object type '${this.astName}' has multiple super object types, can't use with SPARQL graph patterns`,
      );
    }

    statements.push(sparqlGraphPatternsClassDeclaration.bind(this)());
  }

  if (features.has("toRdf")) {
    statements.push(toRdfFunctionDeclaration.bind(this)());
  }

  return {
    isExported: true,
    kind: StructureKind.Module,
    name: this.astName,
    statements: statements,
  };
}
