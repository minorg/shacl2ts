import { type ClassDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { shorthandProperty } from "../shorthandProperty.js";

const dataFactoryVariable = "dataFactory";
const ignoreRdfTypeVariable = "ignoreRdfType";
const subjectVariable = "subject";

export function sparqlGraphPatternsClassDeclaration(
  this: ObjectType,
): ClassDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const constructorStatements: string[] = [];

  if (this.parentObjectTypes.length > 0) {
    constructorStatements.push(
      `super({ ${shorthandProperty("dataFactory", dataFactoryVariable)}, ignoreRdfType: true, ${shorthandProperty("subject", subjectVariable)} });`,
    );
  } else {
    constructorStatements.push(`super(${subjectVariable});`);
  }

  this.rdfType.ifJust((rdfType) =>
    constructorStatements.push(
      `if (!${ignoreRdfTypeVariable}) { this.add(...new sparqlBuilder.RdfTypeGraphPatterns(${subjectVariable}, ${dataFactoryVariable}.namedNode("${rdfType.value}"))); }`,
    ),
  );

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
            name: `{ ${dataFactoryVariable}, ${ignoreRdfTypeVariable}, ${subjectVariable} }`,
            type: `{ ${dataFactoryVariable}: rdfjs.DataFactory, ${ignoreRdfTypeVariable}?: boolean, ${subjectVariable}: sparqlBuilder.ResourceGraphPatterns.SubjectParameter }`,
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
