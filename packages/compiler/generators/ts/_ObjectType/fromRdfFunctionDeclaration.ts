import {
  type FunctionDeclarationStructure,
  type OptionalKind,
  type ParameterDeclarationStructure,
  StructureKind,
} from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { rdfjsTermExpression } from "../rdfjsTermExpression.js";

const variables = {
  ignoreRdfType: "ignoreRdfType",
  options: "_options",
  resource: "_resource",
};

export function fromRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [
    {
      name: variables.resource,
      type: this.rdfjsResourceType().name,
    },
  ];
  if (!this.abstract) {
    parameters.push({
      hasQuestionToken: true,
      name: variables.options,
      type: `{ ${variables.ignoreRdfType}?: boolean }`,
    });
  }

  const propertiesByName: Record<
    string,
    {
      initializer?: string;
      type: string;
    }
  > = {};
  let statements: string[] = [];

  if (!this.abstract) {
    this.rdfType.ifJust((rdfType) => {
      statements.push(
        `if (!${variables.options}?.${variables.ignoreRdfType} && !${variables.resource}.isInstanceOf(${rdfjsTermExpression(rdfType, this.configuration)})) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${variables.resource}, message: \`\${rdfjsResource.Resource.Identifier.toString(${variables.resource}.identifier)} has unexpected RDF type\`, predicate: ${rdfjsTermExpression(rdfType, this.configuration)} })); }`,
      );
    });
  }

  for (const ancestorObjectType of this.ancestorObjectTypes) {
    for (const property of ancestorObjectType.properties) {
      if (property.fromRdfStatements({ variables }).length > 0) {
        propertiesByName[property.name] = {
          initializer: `_super.${property.name}`,
          type: property.type.name,
        };
      }
    }
  }

  for (const property of this.properties) {
    const propertyFromRdfStatements = property.fromRdfStatements({
      variables,
    });
    if (propertyFromRdfStatements.length > 0) {
      propertiesByName[property.name] = {
        type: property.type.name,
      };
      statements.push(...propertyFromRdfStatements);
    }
  }

  let construction = `{ ${Object.entries(propertiesByName)
    .map(([name, { initializer }]) =>
      initializer ? `${name}: ${initializer}` : name,
    )
    .join(", ")} }`;
  let returnType = `{ ${Object.entries(propertiesByName)
    .map(([name, { type }]) => `${name}: ${type}`)
    .join(", ")} }`;
  if (
    this.configuration.objectTypeDeclarationType === "class" &&
    !this.abstract
  ) {
    construction = `new ${this.name}(${construction})`;
    returnType = this.name;
  }

  statements.push(`return purify.Either.of(${construction})`);

  if (this.parentObjectTypes.length > 0) {
    statements = [
      `return ${this.parentObjectTypes[0].name}.fromRdf(${variables.resource}${!this.parentObjectTypes[0].abstract ? `, { ${variables.ignoreRdfType}: true }` : ""}).chain(_super => { ${statements.join("\n")} })`,
    ];
  }

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "fromRdf",
    parameters,
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${returnType}>`,
    statements,
  };
}
