import { Maybe } from "purify-ts";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { rdfjsTermExpression } from "../rdfjsTermExpression.js";

const variables = {
  context: "_context",
  ignoreRdfType: "_ignoreRdfType",
  resource: "_resource",
};

export function fromRdfFunctionDeclaration(
  this: ObjectType,
): Maybe<FunctionDeclarationStructure> {
  if (!this.configuration.features.has("fromRdf")) {
    return Maybe.empty();
  }

  if (this.extern) {
    return Maybe.empty();
  }

  this.ensureAtMostOneSuperObjectType();

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
        `if (!${variables.ignoreRdfType} && !${variables.resource}.isInstanceOf(${rdfjsTermExpression(rdfType, this.configuration)})) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${variables.resource}, message: \`\${rdfjsResource.Resource.Identifier.toString(${variables.resource}.identifier)} has unexpected RDF type\`, predicate: ${rdfjsTermExpression(rdfType, this.configuration)} })); }`,
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

  const propertyFromRdfVariables = {
    context: `${variables.context}`,
    resource: `${variables.resource}`,
  };
  for (const property of this.properties) {
    const propertyFromRdfStatements = property.fromRdfStatements({
      variables: propertyFromRdfVariables,
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
  if (this.declarationType === "class" && !this.abstract) {
    construction = `new ${this.name}(${construction})`;
    returnType = this.name;
  }

  statements.push(`return purify.Either.of(${construction})`);

  if (this.parentObjectTypes.length > 0) {
    statements = [
      `return ${this.parentObjectTypes[0].name}.${this.parentObjectTypes[0].fromRdfFunctionName}({ ...${variables.context}, ignoreRdfType: true, resource: ${variables.resource} }).chain(_super => { ${statements.join("\n")} })`,
    ];
  }

  return Maybe.of({
    isExported: true,
    kind: StructureKind.Function,
    name: this.fromRdfFunctionName,
    parameters: [
      {
        name: `{ ignoreRdfType: ${variables.ignoreRdfType}, resource: ${variables.resource},\n// @ts-ignore\n...${variables.context} }`,
        type: `{ [_index: string]: any; ignoreRdfType?: boolean; resource: ${this.rdfjsResourceType().name}; }`,
      },
    ],
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${returnType}>`,
    statements,
  });
}
