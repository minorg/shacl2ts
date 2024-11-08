import { rdf } from "@tpluscode/rdf-ns-builders";
import { camelCase } from "change-case";
import { type FunctionDeclarationStructure, StructureKind } from "ts-morph";
import type { ObjectType } from "../ObjectType";

const ignoreRdfTypeVariable = "ignoreRdfType";
const mutateGraphVariable = "mutateGraph";
const resourceVariable = "resource";
const resourceSetVariable = "resourceSet";

export function toRdfFunctionDeclaration(
  this: ObjectType,
): FunctionDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  let usedIgnoreRdfTypeVariable = false;
  const thisVariable = camelCase(this.astName);

  const statements: string[] = [];
  if (this.parentObjectTypes.length > 0) {
    statements.push(
      `const ${resourceVariable} = ${this.parentObjectTypes[0].moduleQualifiedName}.toRdf(${thisVariable}, { ${mutateGraphVariable}, ${ignoreRdfTypeVariable}: true, ${resourceSetVariable} });`,
    );
    usedIgnoreRdfTypeVariable = true;
  } else if (this.identifierType.isNamedNodeKind) {
    statements.push(
      `const ${resourceVariable} = ${resourceSetVariable}.mutableNamedResource({ identifier: ${thisVariable}.${this.configuration.objectTypeIdentifierPropertyName}, ${mutateGraphVariable} });`,
    );
  } else {
    statements.push(
      `const ${resourceVariable} = ${resourceSetVariable}.mutableResource({ identifier: ${thisVariable}.${this.configuration.objectTypeIdentifierPropertyName}, ${mutateGraphVariable} });`,
    );
  }

  this.rdfType.ifJust((rdfType) => {
    statements.push(
      `if (!${ignoreRdfTypeVariable}) { ${resourceVariable}.add(${resourceVariable}.dataFactory.namedNode("${rdf.type.value}"), ${resourceVariable}.dataFactory.namedNode("${rdfType.value}")); }`,
    );
    usedIgnoreRdfTypeVariable = true;
  });

  for (const property of this.properties) {
    statements.push(
      ...property.toRdfStatements({
        mutateGraphVariable,
        valueVariable: `${thisVariable}.${property.name}`,
        resourceSetVariable,
      }),
    );
  }

  statements.push(`return ${resourceVariable};`);

  return {
    isExported: true,
    kind: StructureKind.Function,
    name: "toRdf",
    parameters: [
      {
        name: thisVariable,
        type: this.interfaceQualifiedName,
      },
      {
        name: `{ ${usedIgnoreRdfTypeVariable ? `${ignoreRdfTypeVariable},` : ""} ${mutateGraphVariable}, ${resourceSetVariable} }`,
        type: `{ ${ignoreRdfTypeVariable}?: boolean; ${mutateGraphVariable}: rdfjsResource.MutableResource.MutateGraph, ${resourceSetVariable}: rdfjsResource.MutableResourceSet }`,
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  };
}
