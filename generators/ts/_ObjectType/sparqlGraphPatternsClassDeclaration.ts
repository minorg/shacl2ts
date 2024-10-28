import { type ClassDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { shorthandProperty } from "../shorthandProperty.js";

export function sparqlGraphPatternsClassDeclaration(
  this: ObjectType,
): ClassDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const dataFactoryVariable = "dataFactory";
  const subjectVariable = "subject";

  const constructorStatements: string[] = [];

  if (this.parentObjectTypes.length > 0) {
    constructorStatements.push(
      `super({ ${shorthandProperty("dataFactory", dataFactoryVariable)}, ${shorthandProperty("subject", subjectVariable)} });`,
    );
  } else {
    constructorStatements.push(`super(${subjectVariable});`);
  }

  for (const property of this.properties) {
    property
      .sparqlGraphPattern({ dataFactoryVariable })
      .ifJust((sparqlGraphPattern) =>
        constructorStatements.push(`this.add(${sparqlGraphPattern})`),
      );
  }

  return {
    ctors: [
      {
        parameters: [
          {
            name: `{ ${dataFactoryVariable}, ${subjectVariable} }`,
            type: `{ ${dataFactoryVariable}: rdfjs.DataFactory, ${subjectVariable}: sparqlBuilder.ResourceGraphPatterns.SubjectParameter }`,
          },
        ],
        statements: constructorStatements,
      },
    ],
    extends:
      this.parentObjectTypes.length > 0
        ? this.parentObjectTypes[0].sparqlGraphPatternsClassQualifiedName
        : "sparqlBuilder.ResourceGraphPatterns",
    isExported: true,
    kind: StructureKind.Class,
    name: this.sparqlGraphPatternsClassUnqualifiedName,
  };
}
