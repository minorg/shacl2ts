import { rdf } from "@tpluscode/rdf-ns-builders";
import { camelCase } from "change-case";
import type { FunctionDeclarationStructure, OptionalKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

export function toRdfFunctionDeclaration(
  this: ObjectType,
): OptionalKind<FunctionDeclarationStructure> {
  const thisVariableName = camelCase(this.name("inline"));

  const statements: string[] = [];
  if (this.superObjectTypes.length > 0) {
    statements.push(
      "const resource = super.toRdf({ mutateGraph, resourceSet });",
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
    name: "toRdf",
    parameters: [
      {
        name: `{ ${thisVariableName}, mutateGraph, resourceSet }`,
        type: `{ ${thisVariableName}: ${this.name("inline")}, mutateGraph: rdfjsResource.MutableResource.MutateGraph, resourceSet: rdfjsResource.MutableResourceSet }`,
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  };
}
