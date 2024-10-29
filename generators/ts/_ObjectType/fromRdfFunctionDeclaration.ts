import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

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
      `if (!${optionsVariable}?.${ignoreRdfTypeVariable} && !${resourceVariable}.isInstanceOf(${this.configuration.dataFactoryVariable}.namedNode("${rdfType.value}"))) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${resourceVariable}, message: \`\${rdfjsResource.Resource.Identifier.toString(${resourceVariable}.identifier)} has unexpected RDF type\`, predicate: ${this.configuration.dataFactoryVariable}.namedNode("${rdfType.value}") })); }`,
    );
  });

  if (this.parentObjectTypes.length > 0) {
    propertyInitializers.push("..._super");
  }

  for (const property of this.properties) {
    property.valueFromRdf({ resourceVariable }).ifJust((statement) => {
      propertyInitializers.push(property.name);
      statements.push(statement);
    });
  }

  statements.push(
    `return purify.Either.of({ ${propertyInitializers.join(", ")} })`,
  );

  if (this.parentObjectTypes.length > 0) {
    statements = [
      `return ${this.parentObjectTypes[0].moduleQualifiedName}.fromRdf(${resourceVariable}, { ${ignoreRdfTypeVariable}: true }).chain(_super => { ${statements.join("\n")} })`,
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
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.interfaceQualifiedName}>`,
    statements,
  };
}
