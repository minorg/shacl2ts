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
import { toRdfFunctionOrMethodDeclaration } from "./toRdfFunctionOrMethodDeclaration.js";

function constructorDeclaration(
  this: ObjectType,
): Maybe<OptionalKind<ConstructorDeclarationStructure>> {
  const propertyStatements: string[] = [];
  for (const property of this.properties) {
    for (const statement of property.classConstructorStatements({
      variables: { parameter: `parameters.${property.name}` },
    })) {
      propertyStatements.push(statement);
    }
  }
  if (propertyStatements.length === 0) {
    return Maybe.empty();
  }

  const statements: (string | StatementStructures)[] = [];

  if (
    this.ancestorObjectTypes.some((ancestorObjectType) => {
      const ancestorClassDeclaration = ancestorObjectType
        .classDeclaration()
        .extract();
      if (!ancestorClassDeclaration) {
        return true; // Probably imported, assume it has a constructor that takes parameters
      }
      return ancestorClassDeclaration.ctors?.length;
    })
  ) {
    // If some ancestor type has a constructor then pass up parameters
    statements.push("super(parameters);");
  } else if (this.parentObjectTypes.length > 0) {
    statements.push("super();");
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
  if (constructorParameterPropertySignatures.length === 0) {
    return Maybe.empty();
  }

  let constructorParametersType = `{ ${constructorParameterPropertySignatures.join(
    ", ",
  )} }`;
  if (statements[0] === "super(parameters);") {
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

  const constructorDeclaration_ = constructorDeclaration.bind(this)();

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
    ctors: constructorDeclaration_.toList(),
    extends:
      this.parentObjectTypes.length > 0
        ? this.parentObjectTypes[0].name
        : undefined,
    getAccessors,
    isAbstract: this.abstract,
    kind: StructureKind.Class,
    isExported: this.export_,
    methods: [
      ...equalsMethodDeclaration.bind(this)().toList(),
      ...hashMethodDeclaration.bind(this)().toList(),
      ...toRdfMethodDeclaration.bind(this)().toList(),
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
