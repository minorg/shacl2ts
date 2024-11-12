import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { rdfjsTermExpression } from "../rdfjsTermExpression.js";

const ignoreRdfTypeVariable = "ignoreRdfType";
const optionsVariable = "_options";
const resourceVariable = "resource";

export function fromRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const propertyInitializers: string[] = [];
  let statements: string[] = [];

  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `if (!${optionsVariable}?.${ignoreRdfTypeVariable} && !${resourceVariable}.isInstanceOf(${rdfjsTermExpression(rdfType, this.configuration)})) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${resourceVariable}, message: \`\${rdfjsResource.Resource.Identifier.toString(${resourceVariable}.identifier)} has unexpected RDF type\`, predicate: ${rdfjsTermExpression(rdfType, this.configuration)} })); }`,
    );
  });

  for (const ancestorObjectType of this.ancestorObjectTypes) {
    for (const property of ancestorObjectType.properties) {
      if (property.fromRdfStatements({ resourceVariable }).length > 0) {
        propertyInitializers.push(`${property.name}: _super.${property.name}`);
      }
    }
  }

  for (const property of this.properties) {
    const propertyFromRdfStatements = property.fromRdfStatements({
      resourceVariable,
    });
    if (propertyFromRdfStatements.length > 0) {
      propertyInitializers.push(property.name);
      statements.push(...propertyFromRdfStatements);
    }
  }

  let construction = `{ ${propertyInitializers.join(", ")} }`;
  let returnType = this.name;
  if (this.configuration.objectTypeDeclarationType === "class") {
    if (!this.abstract) {
      construction = `new ${this.name}(${construction})`;
    } else {
      // Return an interface
      returnType = `{ ${this.properties
        .concat(
          this.ancestorObjectTypes.flatMap(
            (ancestorObjectType) => ancestorObjectType.properties,
          ),
        )
        .map((property) => property.interfacePropertySignature)
        .map(
          (interfacePropertySignature) =>
            `${interfacePropertySignature.name}: ${interfacePropertySignature.type}`,
        )} }`;
    }
  }

  statements.push(`return purify.Either.of(${construction})`);

  if (this.parentObjectTypes.length > 0) {
    statements = [
      `return ${this.parentObjectTypes[0].name}.fromRdf(${resourceVariable}, { ${ignoreRdfTypeVariable}: true }).chain(_super => { ${statements.join("\n")} })`,
    ];
  }

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "fromRdf",
    parameters: [
      {
        name: resourceVariable,
        type: this.rdfjsResourceType().name,
      },
      {
        hasQuestionToken: true,
        name: optionsVariable,
        type: `{ ${ignoreRdfTypeVariable}?: boolean }`,
      },
    ],
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${returnType}>`,
    statements,
  };
}
