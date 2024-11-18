import { rdf } from "@tpluscode/rdf-ns-builders";
import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type GetAccessorDeclarationStructure,
  type MethodDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { hasherTypeConstraint } from "./hashFunctionDeclaration.js";

function constructorDeclaration(
  this: ObjectType,
): OptionalKind<ConstructorDeclarationStructure> | null {
  if (this.properties.length === 0) {
    return null;
  }

  const statements: (string | StatementStructures)[] = [];

  if (this.parentObjectTypes.length > 0) {
    statements.push("super(parameters);");
  }
  for (const property of this.properties) {
    for (const statement of property.classConstructorStatements({
      variables: { parameter: `parameters.${property.name}` },
    })) {
      statements.push(statement);
    }
  }

  const constructorParameterPropertySignatures = this.properties.flatMap(
    (property) =>
      property.classConstructorParametersPropertySignature
        .map(
          (propertySignature) =>
            `readonly ${propertySignature.name}${propertySignature.hasQuestionToken ? "?" : ""}: ${propertySignature.type}`,
        )
        .toList(),
  );
  if (constructorParameterPropertySignatures.length === 0) {
    return null;
  }

  let constructorParametersType = `{ ${constructorParameterPropertySignatures.join(
    ", ",
  )} }`;
  if (this.parentObjectTypes.length > 0) {
    constructorParametersType = `${constructorParametersType} & ConstructorParameters<typeof ${this.parentObjectTypes[0].name}>[0]`;
  }

  return {
    parameters: [
      {
        name: "parameters",
        type: constructorParametersType,
      },
    ],
    statements,
  };
}

export function classDeclaration(this: ObjectType): ClassDeclarationStructure {
  this.ensureAtMostOneSuperObjectType();

  const constructorDeclaration_ = constructorDeclaration.bind(this)();

  const methods: OptionalKind<MethodDeclarationStructure>[] = [];
  if (this.configuration.features.has("equals")) {
    methods.push(equalsMethodDeclaration.bind(this)());
  }
  if (this.configuration.features.has("hash")) {
    methods.push(hashMethodDeclaration.bind(this)());
  }
  if (this.configuration.features.has("toRdf")) {
    methods.push(toRdfMethodDeclaration.bind(this)());
  }

  const getAccessors: OptionalKind<GetAccessorDeclarationStructure>[] = [];
  const properties: OptionalKind<PropertyDeclarationStructure>[] = [];
  for (const property of this.properties) {
    properties.push(property.classPropertyDeclaration);
    property.classGetAccessorDeclaration.ifJust((getAccessor) =>
      getAccessors.push(getAccessor),
    );
  }

  return {
    ctors:
      constructorDeclaration_ !== null ? [constructorDeclaration_] : undefined,
    extends:
      this.parentObjectTypes.length > 0
        ? this.parentObjectTypes[0].name
        : undefined,
    getAccessors,
    isAbstract: this.abstract,
    kind: StructureKind.Class,
    isExported: this.export_,
    methods,
    name: this.name,
    properties,
  };
}

function equalsMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  let expression = `purifyHelpers.Equatable.objectEquals(this, other, { ${this.properties
    .map((property) => `${property.name}: ${property.equalsFunction}`)
    .join()} })`;
  if (this.parentObjectTypes.length > 0) {
    expression = `super.equals(other).chain(() => ${expression})`;
  }

  return {
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    name: "equals",
    parameters: [
      {
        name: "other",
        type: this.name,
      },
    ],
    statements: [`return ${expression};`],
    returnType: "purifyHelpers.Equatable.EqualsResult",
  };
}

function hashMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    name: "hash",
    parameters: [
      {
        name: "hasher",
        type: "HasherT",
      },
    ],
    returnType: "HasherT",
    statements: [`return ${this.name}.${this.hashFunctionName}(this, hasher);`],
    typeParameters: [
      {
        name: "HasherT",
        constraint: hasherTypeConstraint,
      },
    ],
  };
}

function toRdfMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  const variables = {
    ignoreRdfType: "ignoreRdfType",
    mutateGraph: "mutateGraph",
    resource: "resource",
    resourceSet: "resourceSet",
  };

  let usedIgnoreRdfTypeVariable = false;

  const statements: string[] = [];
  if (this.parentObjectTypes.length > 0) {
    statements.push(
      `const ${variables.resource} = super.toRdf({ ${variables.mutateGraph}, ${variables.ignoreRdfType}: true, ${variables.resourceSet} });`,
    );
    usedIgnoreRdfTypeVariable = true;
  } else if (this.identifierType.isNamedNodeKind) {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableNamedResource({ identifier: this.${this.configuration.objectTypeIdentifierPropertyName}, ${variables.mutateGraph} });`,
    );
  } else {
    statements.push(
      `const ${variables.resource} = ${variables.resourceSet}.mutableResource({ identifier: this.${this.configuration.objectTypeIdentifierPropertyName}, ${variables.mutateGraph} });`,
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
        variables: { ...variables, value: `this.${property.name}` },
      }),
    );
  }

  statements.push(`return ${variables.resource};`);

  return {
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    name: "toRdf",
    parameters: [
      {
        name: `{ ${usedIgnoreRdfTypeVariable ? `${variables.ignoreRdfType},` : ""} ${variables.mutateGraph}, ${variables.resourceSet} }`,
        type: `{ ${variables.ignoreRdfType}?: boolean; ${variables.mutateGraph}: rdfjsResource.MutableResource.MutateGraph, ${variables.resourceSet}: rdfjsResource.MutableResourceSet }`,
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements,
  };
}
