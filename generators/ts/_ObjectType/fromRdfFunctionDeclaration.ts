import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

const dataFactoryVariable = "dataFactory";
const ignoreRdfTypeVariable = "ignoreRdfType";
const resourceVariable = "resource";

export function fromRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const propertyInitializers: string[] = [];
  let statements: string[] = [];

  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `if (!${ignoreRdfTypeVariable} && !${resourceVariable}.isInstanceOf(${dataFactoryVariable}.namedNode("${rdfType.value}"))) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${resourceVariable}, message: \`\${rdfjsResource.Resource.Identifier.toString(${resourceVariable}.identifier)} has unexpected RDF type\`, predicate: ${dataFactoryVariable}.namedNode("${rdfType.value}") })); }`,
    );
  });

  if (this.parentObjectTypes.length > 0) {
    propertyInitializers.push("..._super");
  }

  for (const property of this.properties) {
    property
      .valueFromRdf({ dataFactoryVariable, resourceVariable })
      .ifJust((statement) => {
        propertyInitializers.push(property.name);
        statements.push(statement);
      });
  }

  statements.push(
    `return purify.Either.of({ ${propertyInitializers.join(", ")} })`,
  );

  if (this.parentObjectTypes.length > 0) {
    statements = [
      `return ${this.parentObjectTypes[0].moduleQualifiedName}.fromRdf({ ${dataFactoryVariable}, ${ignoreRdfTypeVariable}: true, ${resourceVariable} }).chain(_super => { ${statements.join("\n")} })`,
    ];
  }

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "fromRdf",
    parameters: [
      {
        name: `{ ${dataFactoryVariable}, ${ignoreRdfTypeVariable}, ${resourceVariable} }`,
        type: `{ ${dataFactoryVariable}: rdfjs.DataFactory, ${ignoreRdfTypeVariable}?: boolean, ${resourceVariable}: ${this.rdfjsResourceType().name} }`,
      },
    ],
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.interfaceQualifiedName}>`,
    statements,
  };
}
