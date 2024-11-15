import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { rdfjsTermExpression } from "../rdfjsTermExpression.js";

const variables = {
  ignoreRdfType: "ignoreRdfType",
  options: "_options",
  resource: "resource",
};

export function fromRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const properties: {
    initializer?: string;
    name: string;
    type: string;
  }[] = [];
  let statements: string[] = [];

  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `if (!${variables.options}?.${variables.ignoreRdfType} && !${variables.resource}.isInstanceOf(${rdfjsTermExpression(rdfType, this.configuration)})) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${variables.resource}, message: \`\${rdfjsResource.Resource.Identifier.toString(${variables.resource}.identifier)} has unexpected RDF type\`, predicate: ${rdfjsTermExpression(rdfType, this.configuration)} })); }`,
    );
  });

  for (const ancestorObjectType of this.ancestorObjectTypes) {
    for (const property of ancestorObjectType.properties) {
      if (property.fromRdfStatements({ variables }).length > 0) {
        properties.push({
          initializer: `_super.${property.name}`,
          name: property.name,
          type: property.interfacePropertySignature.type as string,
        });
      }
    }
  }

  for (const property of this.properties) {
    const propertyFromRdfStatements = property.fromRdfStatements({
      variables,
    });
    if (propertyFromRdfStatements.length > 0) {
      properties.push({
        name: property.name,
        type: property.interfacePropertySignature.type as string,
      });
      statements.push(...propertyFromRdfStatements);
    }
  }

  let construction = `{ ${properties
    .map((property) =>
      property.initializer
        ? `${property.name}: ${property.initializer}`
        : property.name,
    )
    .join(", ")} }`;
  let returnType = this.name;
  if (this.configuration.objectTypeDeclarationType === "class") {
    if (!this.abstract) {
      construction = `new ${this.name}(${construction})`;
    } else {
      // Return an interface
      returnType = `{ ${properties.map((property) => `${property.name}: ${property.type}`).join(", ")} }`;
    }
  }

  statements.push(`return purify.Either.of(${construction})`);

  if (this.parentObjectTypes.length > 0) {
    statements = [
      `return ${this.parentObjectTypes[0].name}.fromRdf(${variables.resource}, { ${variables.ignoreRdfType}: true }).chain(_super => { ${statements.join("\n")} })`,
    ];
  }

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "fromRdf",
    parameters: [
      {
        name: variables.resource,
        type: this.rdfjsResourceType().name,
      },
      {
        hasQuestionToken: true,
        name: variables.options,
        type: `{ ${variables.ignoreRdfType}?: boolean }`,
      },
    ],
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${returnType}>`,
    statements,
  };
}
