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
import { equalsFunctionOrMethodDeclaration } from "./equalsFunctionOrMethodDeclaration.js";
import { hashFunctionOrMethodDeclaration } from "./hashFunctionOrMethodDeclaration.js";
import { toJsonFunctionOrMethodDeclaration } from "./toJsonFunctionOrMethodDeclaration.js";
import { toRdfFunctionOrMethodDeclaration } from "./toRdfFunctionOrMethodDeclaration.js";

function constructorDeclaration(
  this: ObjectType,
): OptionalKind<ConstructorDeclarationStructure> {
  const propertyStatements: string[] = [];
  for (const property of this.properties) {
    for (const statement of property.classConstructorStatements({
      variables: { parameter: `parameters.${property.name}` },
    })) {
      propertyStatements.push(statement);
    }
  }

  const statements: (string | StatementStructures)[] = [];
  if (this.parentObjectTypes.length > 0) {
    // An ancestor object type may be extern so we always have a constructor and always pass up parameters instead
    // of trying to sense whether we need to or not.
    statements.push("super(parameters);");
  }
  statements.push(...propertyStatements);

  const constructorParameterPropertySignatures = this.properties.flatMap(
    (property) =>
      property.classConstructorParametersPropertySignature
        .map(
          (propertySignature) =>
            `readonly ${propertySignature.name}${propertySignature.hasQuestionToken ? "?" : ""}: ${propertySignature.type}`,
        )
        .toList(),
  );

  let constructorParametersType: string;
  if (constructorParameterPropertySignatures.length > 0) {
    constructorParametersType = `{ ${constructorParameterPropertySignatures.join(
      ", ",
    )} }`;
  } else {
    constructorParametersType = "";
  }
  if (this.parentObjectTypes.length > 0) {
    // Pass up parameters
    constructorParametersType = `${constructorParametersType}${constructorParametersType.length > 0 ? " & " : ""}ConstructorParameters<typeof ${this.parentObjectTypes[0].name}>[0]`;
  }
  if (constructorParametersType.length === 0) {
    constructorParametersType = "object";
  }

  return {
    leadingTrivia:
      propertyStatements.length === 0
        ? "// biome-ignore lint/complexity/noUselessConstructor: Always have a constructor\n"
        : undefined,
    parameters: [
      {
        name: statements.length > 0 ? "parameters" : "_parameters",
        type: constructorParametersType,
      },
    ],
    statements,
  };
}

export function classDeclaration(
  this: ObjectType,
): Maybe<ClassDeclarationStructure> {
  if (this.declarationType !== "class") {
    return Maybe.empty();
  }

  if (this.extern) {
    return Maybe.empty();
  }

  this.ensureAtMostOneSuperObjectType();

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

  return Maybe.of({
    ctors: [constructorDeclaration.bind(this)()],
    extends:
      this.parentObjectTypes.length > 0
        ? this.parentObjectTypes[0].name
        : undefined,
    getAccessors,
    isAbstract: this.abstract,
    kind: StructureKind.Class,
    isExported: this.export,
    methods: [
      ...equalsMethodDeclaration.bind(this)().toList(),
      ...hashMethodDeclaration.bind(this)().toList(),
      ...toJsonMethodDeclaration.bind(this)().toList(),
      ...toRdfMethodDeclaration.bind(this)().toList(),
      ...toStringMethodDeclaration.bind(this)().toList(),
    ],
    name: this.name,
    properties,
  });
}

function equalsMethodDeclaration(
  this: ObjectType,
): Maybe<OptionalKind<MethodDeclarationStructure>> {
  return equalsFunctionOrMethodDeclaration.bind(this)();
}

function hashMethodDeclaration(
  this: ObjectType,
): Maybe<OptionalKind<MethodDeclarationStructure>> {
  return hashFunctionOrMethodDeclaration
    .bind(this)()
    .map((hashFunctionOrMethodDeclaration) => ({
      ...hashFunctionOrMethodDeclaration,
      name: "hash",
    }));
}

function toJsonMethodDeclaration(
  this: ObjectType,
): Maybe<OptionalKind<MethodDeclarationStructure>> {
  return toJsonFunctionOrMethodDeclaration
    .bind(this)()
    .map((toJsonFunctionOrMethodDeclaration) => ({
      ...toJsonFunctionOrMethodDeclaration,
      hasOverrideKeyword: this.parentObjectTypes.length > 0,
    }));
}

function toRdfMethodDeclaration(
  this: ObjectType,
): Maybe<OptionalKind<MethodDeclarationStructure>> {
  return toRdfFunctionOrMethodDeclaration
    .bind(this)()
    .map((toRdfFunctionOrMethodDeclaration) => ({
      ...toRdfFunctionOrMethodDeclaration,
      hasOverrideKeyword: this.parentObjectTypes.length > 0,
    }));
}

function toStringMethodDeclaration(
  this: ObjectType,
): Maybe<OptionalKind<MethodDeclarationStructure>> {
  if (!this.features.has("toJson")) {
    return Maybe.empty();
  }

  return Maybe.of({
    hasOverrideKeyword: this.parentObjectTypes.length > 0,
    name: "toString",
    returnType: "string",
    statements: ["return JSON.stringify(this.toJson());"],
  });
}
