import { Maybe } from "purify-ts";
import {
  type ClassDeclarationStructure,
  type OptionalKind,
  type ParameterDeclarationStructure,
  StructureKind,
} from "ts-morph";
import { logger } from "../../../logger.js";
import type { ObjectType } from "../ObjectType.js";
import { rdfjsTermExpression } from "../rdfjsTermExpression.js";

const ignoreRdfTypeVariable = "ignoreRdfType";
const optionsVariable = "_options";
const subjectVariable = "subject";

export function sparqlGraphPatternsClassDeclaration(
  this: ObjectType,
): Maybe<ClassDeclarationStructure> {
  if (!this.configuration.features.has("sparql-graph-patterns")) {
    return Maybe.empty();
  }

  if (this.parentObjectTypes.length > 1) {
    logger.warn(
      "object type %s has multiple super object types, can't use with SPARQL graph patterns",
      this.name,
    );
    return Maybe.empty();
  }

  const addStatements: string[] = [];
  if (!this.abstract) {
    this.rdfType.ifJust((rdfType) =>
      addStatements.push(
        `if (!${optionsVariable}?.${ignoreRdfTypeVariable}) { this.add(...new sparqlBuilder.RdfTypeGraphPatterns(${subjectVariable}, ${rdfjsTermExpression(rdfType, this.configuration)})); }`,
      ),
    );
  }
  for (const property of this.properties) {
    property
      .sparqlGraphPatternExpression()
      .ifJust((sparqlGraphPattern) =>
        addStatements.push(`this.add(${sparqlGraphPattern});`),
      );
  }
  if (addStatements.length === 0) {
    return Maybe.empty();
  }

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
  let extends_ = "sparqlBuilder.ResourceGraphPatterns";
  for (const ancestorObjectType of this.ancestorObjectTypes) {
    if (ancestorObjectType.sparqlGraphPatternsClassDeclaration().isJust()) {
      if (!ancestorObjectType.abstract) {
        constructorStatements.push(
          `super(${subjectVariable}, { ignoreRdfType: true });`,
        );
      }
      extends_ = `${ancestorObjectType.name}.SparqlGraphPatterns`;
      break;
    }
  }
  if (constructorStatements.length === 0) {
    constructorStatements.push(`super(${subjectVariable});`);
  }
  constructorStatements.push(...addStatements);

  return Maybe.of({
    ctors: [
      {
        parameters: constructorParameters,
        statements: constructorStatements,
      },
    ],
    extends: extends_,
    isExported: true,
    kind: StructureKind.Class,
    name: "SparqlGraphPatterns",
  });
}
