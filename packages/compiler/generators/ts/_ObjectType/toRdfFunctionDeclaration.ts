import { rdf } from "@tpluscode/rdf-ns-builders";
import { camelCase } from "change-case";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

const variables = {
  ignoreRdfType: "ignoreRdfType",
  mutateGraph: "mutateGraph",
  resource: "resource",
  resourceSet: "resourceSet",
};

export function toRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  let usedIgnoreRdfTypeVariable = false;
  const thisVariable = camelCase(this.name);

  const statements: string[] = [];
  if (this.parentObjectTypes.length > 0) {
    statements.push(
      `const ${variables.resource} = ${this.parentObjectTypes[0].name}.toRdf(${thisVariable}, { ${variables.mutateGraph}, ${variables.ignoreRdfType}: true, ${variables.resourceSet} });`,
    );
    usedIgnoreRdfTypeVariable = true;
  } else if (this.identifierType.isNamedNodeKind) {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableNamedResource({ identifier: ${thisVariable}.${this.configuration.objectTypeIdentifierPropertyName}, ${variables.mutateGraph} });`,
    );
  } else {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableResource({ identifier: ${thisVariable}.${this.configuration.objectTypeIdentifierPropertyName}, ${variables.mutateGraph} });`,
    );
  }

  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `if (!${variables.ignoreRdfType}) { ${variables.resource}.add(${variables.resource}.dataFactory.namedNode("${rdf.type.value}"), ${variables.resource}.dataFactory.namedNode("${rdfType.value}")); }`,
    );
    usedIgnoreRdfTypeVariable = true;
  });

  for (const property of this.properties) {
    statements.push(
      ...property.toRdfStatements({
        variables: { ...variables, value: `${thisVariable}.${property.name}` },
      }),
    );
  }

  statements.push(`return ${variables.resource};`);

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "toRdf",
    parameters: [
      {
        name: thisVariable,
        type: this.name,
      },
      {
        name: `{ ${usedIgnoreRdfTypeVariable ? `${variables.ignoreRdfType},` : ""} ${variables.mutateGraph}, ${variables.resourceSet} }`,
        type: `{ ${variables.ignoreRdfType}?: boolean; ${variables.mutateGraph}: rdfjsResource.MutableResource.MutateGraph, ${variables.resourceSet}: rdfjsResource.MutableResourceSet }`,
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  };
}
