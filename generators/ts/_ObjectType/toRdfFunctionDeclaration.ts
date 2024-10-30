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

  const thisVariable = camelCase(this.name);

  const statements: string[] = [];
  if (this.parentObjectTypes.length > 0) {
    statements.push(
      `const ${resourceVariable} = ${this.parentObjectTypes[0].moduleQualifiedName}.toRdf(${thisVariable}, { ${mutateGraphVariable}, ${ignoreRdfTypeVariable}: true, ${resourceSetVariable} });`,
    );
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
  });

  for (const property of this.properties) {
    property
      .valueToRdfStatement({
        mutateGraphVariable,
        propertyValueVariable: `${thisVariable}.${property.name}`,
        resourceSetVariable,
      })
      .ifJust((statement) => statements.push(statement));
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
        name: `{ ${ignoreRdfTypeVariable}, ${mutateGraphVariable}, ${resourceSetVariable} }`,
        type: `{ ${ignoreRdfTypeVariable}?: boolean; ${mutateGraphVariable}: rdfjsResource.MutableResource.MutateGraph, ${resourceSetVariable}: rdfjsResource.MutableResourceSet }`,
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  };
}
