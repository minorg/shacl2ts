import { rdf } from "@tpluscode/rdf-ns-builders";
import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type MethodDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { IdentifierProperty } from "./IdentifierProperty.js";
import { hasherTypeConstraint } from "./hashFunctionDeclaration.js";

function constructorDeclaration(
  this: ObjectType,
): OptionalKind<ConstructorDeclarationStructure> {
  const statements: (string | StatementStructures)[] = [];

  const mintIdentifier = IdentifierProperty.classConstructorMintExpression({
    mintingStrategy: this.mintingStrategy,
    objectType: this,
  });

  if (this.parentObjectTypes.length > 0) {
    if (mintIdentifier.isJust()) {
      // Have to mint the identifier in the subclass being instantiated in case the minting needs to hash all members
      statements.push(
        `super({...parameters, ${this.configuration.objectTypeIdentifierPropertyName}: parameters.${this.configuration.objectTypeIdentifierPropertyName} ?? ${mintIdentifier.unsafeCoerce()} });`,
      );
    } else {
      statements.push("super(parameters);");
    }
  }
  for (const property of this.properties) {
    for (const statement of property.classConstructorStatements({
      objectType: this,
      variables: { parameter: `parameters.${property.name}` },
    })) {
      statements.push(statement);
    }
  }

  let constructorParametersType = `{ ${this.properties
    .flatMap((property) => {
      return property.classConstructorParametersPropertySignature
        .map(
          (propertySignature) =>
            `readonly ${propertySignature.name}${propertySignature.hasQuestionToken ? "?" : ""}: ${propertySignature.type}`,
        )
        .toList();
    })
    .join(", ")} }`;
  if (this.parentObjectTypes.length > 0) {
    let parentConstructorParametersType = `ConstructorParameters<typeof ${this.parentObjectTypes[0].name}>[0]`;
    if (mintIdentifier.isJust()) {
      // If identifier is not specified we're always going to mint it in the subclass, so we can ignore
      // the type of the parent's identifier.
      parentConstructorParametersType = `Omit<${parentConstructorParametersType}, "${this.configuration.objectTypeIdentifierPropertyName}">`;
    }
    constructorParametersType = `${constructorParametersType} & ${parentConstructorParametersType}`;
    if (mintIdentifier.isJust()) {
      // See note above.
      constructorParametersType = `${constructorParametersType} & { ${this.configuration.objectTypeIdentifierPropertyName}?: ${this.identifierType.name} }`;
    }
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

  const properties: OptionalKind<PropertyDeclarationStructure>[] =
    this.properties.map((property) => property.classPropertyDeclaration);

  return {
    ctors:
      this.properties.length > 0
        ? [constructorDeclaration.bind(this)()]
        : undefined,
    extends:
      this.parentObjectTypes.length > 0
        ? this.parentObjectTypes[0].name
        : undefined,
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
