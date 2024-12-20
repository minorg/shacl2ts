import { rdf } from "@tpluscode/rdf-ns-builders";
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

  let usedIgnoreRdfTypeVariable = false;

  const statements: string[] = [];
  if (this.parentObjectTypes.length > 0) {
    const superToRdfOptions = `{ ${variables.ignoreRdfType}: true, ${variables.mutateGraph}, ${variables.resourceSet} }`;
    let superToRdfCall: string;
    switch (this.declarationType) {
      case "class":
        superToRdfCall = `super.toRdf(${superToRdfOptions})`;
        break;
      case "interface":
        superToRdfCall = `${this.parentObjectTypes[0].name}.toRdf(${this.thisVariable}, ${superToRdfOptions})`;
        break;
    }
    statements.push(`const ${variables.resource} = ${superToRdfCall};`);
    usedIgnoreRdfTypeVariable = !this.parentObjectTypes[0].abstract;
  } else if (this.identifierType.isNamedNodeKind) {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableNamedResource({ identifier: ${this.thisVariable}.${this.identifierProperty.name}, ${variables.mutateGraph} });`,
    );
  } else {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableResource({ identifier: ${this.thisVariable}.${this.identifierProperty.name}, ${variables.mutateGraph} });`,
    );
  }

  if (this.toRdfTypes.length > 0) {
    statements.push(
      `if (!${variables.ignoreRdfType}) { ${this.toRdfTypes.map((toRdfType) => `${variables.resource}.add(${variables.resource}.dataFactory.namedNode("${rdf.type.value}"), ${variables.resource}.dataFactory.namedNode("${toRdfType.value}"));`).join(" ")} }`,
    );
    usedIgnoreRdfTypeVariable = true;
  }

  for (const property of this.properties) {
    statements.push(
      ...property.toRdfStatements({
        variables: {
          ...variables,
          value: `${this.thisVariable}.${property.name}`,
        },
      }),
    );
  }

  statements.push(`return ${variables.resource};`);

  const parameters: OptionalKind<ParameterDeclarationStructure>[] = [];
  if (this.declarationType === "interface") {
    parameters.push({
      name: this.thisVariable,
      type: this.name,
    });
  }
  parameters.push({
    name: `{ ${usedIgnoreRdfTypeVariable ? `${variables.ignoreRdfType}, ` : ""}${variables.mutateGraph}, ${variables.resourceSet} }`,
    type: `{ ${variables.ignoreRdfType}?: boolean; ${variables.mutateGraph}: rdfjsResource.MutableResource.MutateGraph, ${variables.resourceSet}: rdfjsResource.MutableResourceSet }`,
  });

  return Maybe.of({
    name: "toRdf",
    parameters,
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  });
}
