import { rdf } from "@tpluscode/rdf-ns-builders";
import { camelCase } from "change-case";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

export function toRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const thisVariableName = camelCase(this.name("ast"));

  const statements: string[] = [];
  if (this.superObjectTypes.length > 0) {
    statements.push(
      `const resource = ${this.superObjectTypes[0].name("module")}.toRdf(${thisVariableName}, { mutateGraph, resourceSet });`,
    );
  } else if (this.identifierType.isNamedNodeKind) {
    statements.push(
      `const resource = resourceSet.mutableNamedResource({ identifier: ${thisVariableName}.identifier, mutateGraph });`,
    );
  } else {
    statements.push(
      `const resource = resourceSet.mutableResource({ identifier: ${thisVariableName}.identifier, mutateGraph });`,
    );
  }

  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `resource.add(resource.dataFactory.namedNode("${rdf.type.value}"), resource.dataFactory.namedNode("${rdfType.value}"));`,
    );
  });

  for (const property of this.properties) {
    if (property.name === "identifier") {
      continue;
    }

    statements.push(
      property.valueToRdf({
        mutateGraphVariable: "mutateGraph",
        propertyValueVariable: `${thisVariableName}.${property.name}`,
        resourceSetVariable: "resourceSet",
      }),
    );
  }

  statements.push("return resource;");

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "toRdf",
    parameters: [
      {
        name: thisVariableName,
        type: this.name("interface"),
      },
      {
        name: "{ mutateGraph, resourceSet }",
        type: "{ mutateGraph: rdfjsResource.MutableResource.MutateGraph, resourceSet: rdfjsResource.MutableResourceSet }",
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  };
}