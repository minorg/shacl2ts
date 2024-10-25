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
    if (property.name === "identifier") {
      statements.push(`const identifier = ${resourceVariable}.identifier`);
    } else {
      statements.push(
        property.valueFromRdf({ dataFactoryVariable, resourceVariable }),
      );
    }
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
      .sort()
      .join(", ")} })`,
  );

  if (this.superObjectTypes.length > 0) {
    statements = [
      `return ${this.superObjectTypes[0].name("module")}.fromRdf({ ${dataFactoryVariable}, ${resourceVariable} }).chain(_super => { ${statements.join("\n")} })`,
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
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.name("interface")}>`,
    statements,
  };
}
