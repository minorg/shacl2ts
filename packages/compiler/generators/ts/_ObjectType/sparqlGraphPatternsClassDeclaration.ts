import {
  type ClassDeclarationStructure,
  type OptionalKind,
  type ParameterDeclarationStructure,
  StructureKind,
} from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { rdfjsTermExpression } from "../rdfjsTermExpression";

const ignoreRdfTypeVariable = "ignoreRdfType";
const optionsVariable = "_options";
const subjectVariable = "subject";

export function sparqlGraphPatternsClassDeclaration(
  this: ObjectType,
): ClassDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const constructorParameters: OptionalKind<ParameterDeclarationStructure>[] = [
    {
      name: subjectVariable,
      type: "sparqlBuilder.ResourceGraphPatterns.SubjectParameter",
    },
  ];
  if (!this.abstract) {
    constructorParameters.push({
      hasQuestionToken: true,
      name: optionsVariable,
      type: `{ ${ignoreRdfTypeVariable}?: boolean }`,
    });
  }

  const constructorStatements: string[] = [];

  if (
    this.parentObjectTypes.length > 0 &&
    !this.parentObjectTypes[0].abstract
  ) {
    constructorStatements.push(
      `super(${subjectVariable}, { ignoreRdfType: true });`,
    );
  } else {
    constructorStatements.push(`super(${subjectVariable});`);
  }

  if (!this.abstract) {
    this.rdfType.ifJust((rdfType) =>
      constructorStatements.push(
        `if (!${optionsVariable}?.${ignoreRdfTypeVariable}) { this.add(...new sparqlBuilder.RdfTypeGraphPatterns(${subjectVariable}, ${rdfjsTermExpression(rdfType, this.configuration)})); }`,
      ),
    );
  }

  for (const property of this.properties) {
    property
      .sparqlGraphPatternExpression()
      .ifJust((sparqlGraphPattern) =>
        constructorStatements.push(`this.add(${sparqlGraphPattern});`),
      );
  }

  return {
    ctors:
      constructorStatements.length > 1
        ? [
            {
              parameters: constructorParameters,
              statements: constructorStatements,
            },
          ]
        : undefined,
    extends:
      this.parentObjectTypes.length > 0
        ? `${this.parentObjectTypes[0].name}.SparqlGraphPatterns`
        : "sparqlBuilder.ResourceGraphPatterns",
    isExported: true,
    kind: StructureKind.Class,
    name: "SparqlGraphPatterns",
  };
}
