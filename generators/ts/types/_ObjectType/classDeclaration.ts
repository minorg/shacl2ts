import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type MethodDeclarationStructure,
  type OptionalKind,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type { TsGenerator } from "../../TsGenerator";
import type { ObjectType } from "../ObjectType.js";

function constructorDeclaration(
  this: ObjectType,
): OptionalKind<ConstructorDeclarationStructure> {
  const statements: (string | StatementStructures)[] = [];
  if (this.superObjectTypes.length > 0) {
    statements.push("super(parameters);");
  }
  for (const property of this.properties) {
    statements.push(
      `this.${property.name} = ${property.classConstructorInitializer(`parameters.${property.name}`)};`,
    );
  }

  return {
    parameters: [
      {
        name: "parameters",
        type: `${this.name("class")}.Parameters`,
      },
    ],
    statements,
  };
}

export function classDeclaration(
  this: ObjectType,
  features: Set<TsGenerator.Feature>,
): ClassDeclarationStructure {
  const methods: OptionalKind<MethodDeclarationStructure>[] = [];
  if (features.has("equals")) {
    methods.push(equalsMethodDeclaration.bind(this)());
  }
  if (features.has("fromRdf")) {
    methods.push(fromRdfMethodDeclaration.bind(this)());
  }
  if (features.has("toRdf")) {
    methods.push(toRdfMethodDeclaration.bind(this)());
  }

  return {
    ctors:
      this.properties.length > 0
        ? [constructorDeclaration.bind(this)()]
        : undefined,
    extends:
      this.superObjectTypes.length > 0
        ? this.superObjectTypes[0].name("class")
        : undefined,
    implements: [this.name("interface")],
    kind: StructureKind.Class,
    isExported: true,
    methods,
    name: "Class",
    properties: this.properties.map(
      (property) => property.classPropertyDeclaration,
    ),
  };
}

function equalsMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    hasOverrideKeyword: this.superObjectTypes.length > 0,
    name: "equals",
    parameters: [
      {
        name: "other",
        type: this.name("interface"),
      },
    ],
    statements: [`return ${this.name("module")}.equals(this, other);`],
    returnType: "purifyHelpers.Equatable.EqualsResult",
  };
}

function fromRdfMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    hasOverrideKeyword: this.superObjectTypes.length > 0,
    isStatic: true,
    name: "fromRdf",
    parameters: [
      {
        name: "kwds",
        type: `{ dataFactory: rdfjs.DataFactory, resource: ${this.rdfjsResourceType().name} }`,
      },
    ],
    returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.name("class")}>`,
    statements: [
      `return ${this.name("module")}.fromRdf(kwds).map(properties => new ${this.name("class")}(properties));`,
    ],
  };
}

function toRdfMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    hasOverrideKeyword: this.superObjectTypes.length > 0,
    name: "toRdf",
    parameters: [
      {
        name: "kwds",
        type: "{ mutateGraph: rdfjsResource.MutableResource.MutateGraph, resourceSet: rdfjsResource.MutableResourceSet }",
      },
    ],
    returnType: this.rdfjsResourceType({ mutable: true }).name,
    statements: [`return ${this.name("module")}.toRdf(this, kwds);`],
  };
}
