import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

export function fromRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const dataFactoryVariable = "dataFactory";
  const resourceVariable = "resource";

  let statements: string[] = [];
  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `if (!${resourceVariable}.isInstanceOf(${dataFactoryVariable}.namedNode("${rdfType.value}"))) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${resourceVariable}, message: \`\${rdfjsResource.Resource.Identifier.toString(${resourceVariable}.identifier)} has unexpected RDF type\`, predicate: ${dataFactoryVariable}.namedNode("${rdfType.value}") })); }`,
    );
  });

  for (const property of this.properties) {
    property
      .valueFromRdf({ dataFactoryVariable, resourceVariable })
      .ifJust((statement) => statements.push(statement));
  }

  statements.push(
    `return purify.Either.of({ ${this.properties
      .map((property) => property.name)
      .concat(
        this.ancestorObjectTypes.flatMap((ancestorObjectType) =>
          ancestorObjectType.properties.map(
            (property) => `${property.name}: _super.${property.name}`,
          ),
        ),
      )
      .concat(
        this.typeDiscriminatorProperty
          .map(
            (typeDiscriminatorProperty) =>
              `${typeDiscriminatorProperty.name}: "${typeDiscriminatorProperty.value}"`,
          )
          .toList(),
      )
      .sort()
      .join(", ")} })`,
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
