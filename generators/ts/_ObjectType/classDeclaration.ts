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
    property
      .classConstructorInitializerExpression({
        objectType: this,
        parameter: `parameters.${property.name}`,
      })
      .ifJust((classConstructorInitializer) =>
        statements.push(
          `this.${property.name} = ${classConstructorInitializer};`,
        ),
      );
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
    kind: StructureKind.Class,
    isExported: true,
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
    statements: [`return ${this.name}.hash(this, hasher);`],
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
    statements: [`return ${this.name}.toRdf(this, kwds);`],
  };
}
