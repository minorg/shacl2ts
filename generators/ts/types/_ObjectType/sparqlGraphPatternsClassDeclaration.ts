import { type ClassDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

export function sparqlGraphPatternsClassDeclaration(
  this: ObjectType,
): ClassDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const constructorStatements: string[] = [];
  if (this.superObjectTypes.length > 0) {
    constructorStatements.push("super(subject);");
  }
  for (const property of this.properties) {
    constructorStatements.push(`this.add(${property.sparqlGraphPattern})`);
  }

  return {
    ctors: [
      {
        parameters: [
          {
            name: "subject",
            type: "sparqlBuilder.ResourceGraphPatterns.SubjectParameter",
          },
        ],
        statements: constructorStatements,
      },
    ],
    kind: StructureKind.Class,
    name: "SparqlGraphPatterns",
  };
}
