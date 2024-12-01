import { rdf } from "@tpluscode/rdf-ns-builders";
import { camelCase } from "change-case";
import type { OptionalKind, ParameterDeclarationStructure } from "ts-morph";
import type { ObjectType } from "../ObjectType";

const variables = {
  ignoreRdfType: "ignoreRdfType",
  mutateGraph: "mutateGraph",
  resource: "_resource",
  resourceSet: "resourceSet",
};

export function toRdfFunctionOrMethodDeclaration(this: ObjectType): {
  name: string;
  parameters: OptionalKind<ParameterDeclarationStructure>[];
  returnType: string;
  statements: string[];
} {
  this.ensureAtMostOneSuperObjectType();

  let thisVariable: string;
  switch (this.configuration.objectTypeDeclarationType) {
    case "class":
      thisVariable = "this";
      break;
    case "interface":
      thisVariable = camelCase(this.name);
      break;
  }

  let usedIgnoreRdfTypeVariable = false;

  const statements: string[] = [];
  if (this.parentObjectTypes.length > 0) {
    const superToRdfOptions = `{ ${variables.mutateGraph}, ${this.parentObjectTypes[0].abstract ? "" : `${variables.ignoreRdfType}: true, `}${variables.resourceSet} }`;
    let superToRdfCall: string;
    switch (this.configuration.objectTypeDeclarationType) {
      case "class":
        superToRdfCall = `super.toRdf(${superToRdfOptions})`;
        break;
      case "interface":
        superToRdfCall = `${this.parentObjectTypes[0].name}.toRdf(${thisVariable}, ${superToRdfOptions})`;
        break;
    }
    statements.push(`const ${variables.resource} = ${superToRdfCall};`);
    usedIgnoreRdfTypeVariable = !this.parentObjectTypes[0].abstract;
  } else if (this.identifierType.isNamedNodeKind) {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableNamedResource({ identifier: ${thisVariable}.${this.configuration.objectTypeIdentifierPropertyName}, ${variables.mutateGraph} });`,
    );
  } else {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableResource({ identifier: ${thisVariable}.${this.configuration.objectTypeIdentifierPropertyName}, ${variables.mutateGraph} });`,
    );
  }

  if (!this.abstract) {
    this.rdfType.ifJust((rdfType) => {
      statements.push(
        `if (!${variables.ignoreRdfType}) { ${variables.resource}.add(${variables.resource}.dataFactory.namedNode("${rdf.type.value}"), ${variables.resource}.dataFactory.namedNode("${rdfType.value}")); }`,
      );
      usedIgnoreRdfTypeVariable = true;
    });
  }

  for (const property of this.properties) {
    statements.push(
      ...property.toRdfStatements({
        variables: { ...variables, value: `${thisVariable}.${property.name}` },
      }),
    );
  }

  statements.push(`return ${variables.resource};`);

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
  if (this.configuration.objectTypeDeclarationType === "interface") {
    parameters.push({
      name: thisVariable,
      type: this.name,
    });
  }
  parameters.push({
    name: `{ ${usedIgnoreRdfTypeVariable ? `${variables.ignoreRdfType}, ` : ""}${variables.mutateGraph}, ${variables.resourceSet} }`,
    type: `{ ${usedIgnoreRdfTypeVariable ? `${variables.ignoreRdfType}?: boolean; ` : ""}${variables.mutateGraph}: rdfjsResource.MutableResource.MutateGraph, ${variables.resourceSet}: rdfjsResource.MutableResourceSet }`,
  });

  return {
    name: "toRdf",
    parameters,
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  };
}
