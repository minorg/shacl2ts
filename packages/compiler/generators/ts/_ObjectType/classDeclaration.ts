import { Maybe } from "purify-ts";
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
import { hashFunctionOrMethodDeclaration } from "./hashFunctionOrMethodDeclaration.js";
import { toRdfFunctionOrMethodDeclaration } from "./toRdfFunctionOrMethodDeclaration.js";

function constructorDeclaration(
  this: ObjectType,
): Maybe<OptionalKind<ConstructorDeclarationStructure>> {
  if (this.properties.length === 0) {
    return Maybe.empty();
  }

  const statements: (string | StatementStructures)[] = [];

  if (
    this.ancestorObjectTypes.some(
      (ancestorObjectType) =>
        ancestorObjectType.classDeclaration().ctors?.length,
    )
  ) {
    // If some ancestor type has a constructor then pass up parameters
    statements.push("super(parameters);");
  } else if (this.parentObjectTypes.length > 0) {
    statements.push("super();");
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
    return Maybe.empty();
  }

  let constructorParametersType = `{ ${constructorParameterPropertySignatures.join(
    ", ",
  )} }`;
  if (
    this.ancestorObjectTypes.some(
      (ancestorObjectType) =>
        ancestorObjectType.classDeclaration().ctors?.length,
    )
  ) {
    // If some ancestor type has a constructor then pass up parameters
    constructorParametersType = `${constructorParametersType} & ConstructorParameters<typeof ${this.parentObjectTypes[0].name}>[0]`;
  }

  return Maybe.of({
    parameters: [
      {
        name: "parameters",
        type: constructorParametersType,
      },
    ],
    statements,
  });
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
    property.classPropertyDeclaration.ifJust((propertyDeclaration) =>
      properties.push(propertyDeclaration),
    );
    property.classGetAccessorDeclaration.ifJust((getAccessor) =>
      getAccessors.push(getAccessor),
    );
  }

  return {
    ctors: constructorDeclaration_.toList(),
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
    ...hashFunctionOrMethodDeclaration.bind(this)(),
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    name: "hash",
  };
}

function toRdfMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  return {
    ...toRdfFunctionOrMethodDeclaration.bind(this)(),
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
  };
}
