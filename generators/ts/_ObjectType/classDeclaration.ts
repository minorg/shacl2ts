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

function constructorDeclaration(
  this: ObjectType,
): OptionalKind<ConstructorDeclarationStructure> {
  const statements: (string | StatementStructures)[] = [];
  if (this.parentObjectTypes.length > 0) {
    statements.push("super(parameters);");
  }
  for (const property of this.properties) {
    property
      .classConstructorInitializer({ parameter: `parameters.${property.name}` })
      .ifJust((classConstructorInitializer) =>
        statements.push(
          `this.${property.name} = ${classConstructorInitializer};`,
        ),
      );
  }

  return {
    parameters: [
      {
        name: "parameters",
        type: `${this.classQualifiedName}.ConstructorParameters`,
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
  if (this.configuration.features.has("fromRdf")) {
    methods.push(fromRdfMethodDeclaration.bind(this)());
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
        ? this.parentObjectTypes[0].classQualifiedName
        : undefined,
    implements: [this.interfaceQualifiedName],
    kind: StructureKind.Class,
    isExported: true,
    methods,
    name: this.classUnqualifiedName,
    properties,
  };
}

function equalsMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    name: "equals",
    parameters: [
      {
        name: "other",
        type: this.interfaceQualifiedName,
      },
    ],
    statements: [`return ${this.moduleQualifiedName}.equals(this, other);`],
    returnType: "purifyHelpers.Equatable.EqualsResult",
  };
}

function fromRdfMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    isStatic: true,
    name: "fromRdf",
    parameters: [
      {
        name: "kwds",
        type: `{ dataFactory: rdfjs.DataFactory, resource: ${this.rdfjsResourceType().name} }`,
      },
    ],
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.classQualifiedName}>`,
    statements: [
      `return ${this.moduleQualifiedName}.fromRdf(kwds).map(properties => new ${this.classQualifiedName}(properties));`,
    ],
  };
}

function toRdfMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    name: "toRdf",
    parameters: [
      {
        name: "kwds",
        type: "{ mutateGraph: rdfjsResource.MutableResource.MutateGraph, resourceSet: rdfjsResource.MutableResourceSet }",
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements: [`return ${this.moduleQualifiedName}.toRdf(this, kwds);`],
  };
}
