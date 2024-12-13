import { rdf } from "@tpluscode/rdf-ns-builders";
import { camelCase } from "change-case";
import { Maybe } from "purify-ts";
import type { OptionalKind, ParameterDeclarationStructure } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";

const variables = {
  ignoreRdfType: "ignoreRdfType",
  mutateGraph: "mutateGraph",
  resource: "_resource",
  resourceSet: "resourceSet",
};

export function toRdfFunctionOrMethodDeclaration(this: ObjectType): Maybe<{
  name: string;
  parameters: OptionalKind<ParameterDeclarationStructure>[];
  returnType: string;
  statements: string[];
}> {
  if (!this.features.has("toRdf")) {
    return Maybe.empty();
  }

  this.ensureAtMostOneSuperObjectType();

  let thisVariable: string;
  switch (this.declarationType) {
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
    switch (this.declarationType) {
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
      `const ${variables.resource} = ${variables.resourceSet}.mutableNamedResource({ identifier: ${thisVariable}.${this.identifierProperty.name}, ${variables.mutateGraph} });`,
    );
  } else {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableResource({ identifier: ${thisVariable}.${this.identifierProperty.name}, ${variables.mutateGraph} });`,
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
  if (this.declarationType === "interface") {
    parameters.push({
      name: thisVariable,
      type: this.name,
    });
  }
  parameters.push({
    name: `{ ${usedIgnoreRdfTypeVariable ? `${variables.ignoreRdfType}, ` : ""}${variables.mutateGraph}, ${variables.resourceSet} }`,
    type: `{ ${usedIgnoreRdfTypeVariable ? `${variables.ignoreRdfType}?: boolean; ` : ""}${variables.mutateGraph}: rdfjsResource.MutableResource.MutateGraph, ${variables.resourceSet}: rdfjsResource.MutableResourceSet }`,
  });

  return Maybe.of({
    name: "toRdf",
    parameters,
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  });
}
