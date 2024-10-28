import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

export function fromRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const dataFactoryVariable = "dataFactory";
  const resourceVariable = "resource";

  const propertyInitializers: string[] = [];
  let statements: string[] = [];

  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `if (!${resourceVariable}.isInstanceOf(${dataFactoryVariable}.namedNode("${rdfType.value}"))) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${resourceVariable}, message: \`\${rdfjsResource.Resource.Identifier.toString(${resourceVariable}.identifier)} has unexpected RDF type\`, predicate: ${dataFactoryVariable}.namedNode("${rdfType.value}") })); }`,
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
      `return ${this.parentObjectTypes[0].moduleQualifiedName}.fromRdf({ ${dataFactoryVariable}, ${resourceVariable} }).chain(_super => { ${statements.join("\n")} })`,
    ];
  }

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "fromRdf",
    parameters: [
      {
        name: "{ dataFactory, resource }",
        type: `{ dataFactory: rdfjs.DataFactory, resource: ${this.rdfjsResourceType().name} }`,
      },
    ],
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.interfaceQualifiedName}>`,
    statements,
  };
}
