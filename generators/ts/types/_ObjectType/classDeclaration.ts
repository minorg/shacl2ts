import type {
  ClassDeclarationStructure,
  ConstructorDeclarationStructure,
  MethodDeclarationStructure,
  OptionalKind,
  StatementStructures,
} from "ts-morph";
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
        type: `${this.name("inline")}.Parameters`,
      },
    ],
    statements,
  };
}

export function classDeclaration(
  this: ObjectType,
): OptionalKind<ClassDeclarationStructure> {
  return {
    ctors:
      this.properties.length > 0
        ? [constructorDeclaration.bind(this)()]
        : undefined,
    extends:
      this.superObjectTypes.length > 0
        ? this.superObjectTypes[0].name("inline")
        : undefined,
    isExported: true,
    methods: [
      equalsMethodDeclaration.bind(this)(),
      // this.fromRdfMethodDeclaration,
      // this.toRdfMethodDeclaration,
    ],
    name: this.name("inline"),
    properties: this.properties.map(
      (property) => property.classPropertyDeclaration,
    ),
  };
}

function equalsMethodDeclaration(
  this: ObjectType,
): OptionalKind<MethodDeclarationStructure> {
  let expression = `purifyHelpers.Equatable.objectEquals(this, other, { ${this.properties
    .map((property) => `${property.name}: ${property.equalsFunction}`)
    .join()} })`;
  if (this.superObjectTypes.length > 0) {
    expression = `super.equals(other).chain(() => ${expression})`;
  }

  return {
    hasOverrideKeyword: this.superObjectTypes.length > 0,
    name: "equals",
    parameters: [
      {
        name: "other",
        type: this.name("inline"),
      },
    ],
    statements: [`return ${expression};`],
    returnType: "purifyHelpers.Equatable.EqualsResult",
  };
}
