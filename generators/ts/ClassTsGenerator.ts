import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type InterfaceDeclarationStructure,
  type ModuleDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type SourceFile,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type * as ast from "../ast/index";
import { TsGenerator } from "./TsGenerator";

export class ClassTsGenerator extends TsGenerator {
  private readonly factories = new ClassTsGenerator.Factories();

  protected override addImportDeclarations(toSourceFile: SourceFile): void {
    toSourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });
    toSourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });
  }

  protected override addObjectType(
    astObjectType: ast.ObjectType,
    toSourceFile: SourceFile,
  ) {
    const objectType = this.factories.createObjectType(astObjectType);

    toSourceFile.addClass(objectType.toClassDeclarationStructure());

    toSourceFile.addModule(objectType.toModuleDeclarationStructure());
  }
}

export namespace ClassTsGenerator {
  export class Factories extends TsGenerator.Factories {
    override createObjectType(astType: ast.ObjectType): ObjectType {
      return new ObjectType(astType, this);
    }
  }

  export class ObjectType extends TsGenerator.ObjectType {
    constructor(astType: ast.ObjectType, factories: TsGenerator.Factories) {
      super(astType, factories);

      if (this.superObjectTypes.length > 1) {
        throw new RangeError(
          `object type '${this.name}' has multiple super object types, can't use with classes`,
        );
      }
    }

    private constructorDeclarationStructure(): OptionalKind<ConstructorDeclarationStructure> {
      const statements: (string | StatementStructures)[] = [];
      if (this.superObjectTypes.length > 0) {
        statements.push("super(parameters);");
      }
      for (const propertyDeclarationStructure of this.propertyDeclarationStructures()) {
        statements.push(
          `this.${propertyDeclarationStructure.name} = parameters.${propertyDeclarationStructure.name};`,
        );
      }

      return {
        parameters: [
          {
            name: "parameters",
            type: `${this.name}.Parameters`,
          },
        ],
        statements,
      };
    }

    private parametersInterfaceDeclarationStructure(): InterfaceDeclarationStructure {
      return {
        extends:
          this.superObjectTypes.length > 0
            ? [`${this.superObjectTypes[0].inlineName}.Parameters`]
            : undefined,
        isExported: true,
        kind: StructureKind.Interface,
        properties: this.propertyDeclarationStructures().map(
          (propertyDeclarationStructure) => ({
            isReadonly: true,
            name: propertyDeclarationStructure.name,
            type: propertyDeclarationStructure.type,
          }),
        ),
        name: "Parameters",
      };
    }

    private propertyDeclarationStructures(): OptionalKind<PropertyDeclarationStructure>[] {
      const propertyDeclarationStructuresByName: Record<
        string,
        OptionalKind<PropertyDeclarationStructure>
      > = {};

      if (this.superObjectTypes.length === 0) {
        propertyDeclarationStructuresByName["identifier"] = {
          isReadonly: true,
          name: "identifier",
          type: this.identifierTypeName,
        };
      }

      for (const property of this.properties) {
        const propertyDeclarationStructure = (property as Property).toPropertyDeclarationStructure();

        if (
          propertyDeclarationStructuresByName[propertyDeclarationStructure.name]
        ) {
          throw new Error(
            `${this.name}: duplicate property '${propertyDeclarationStructure.name}'`,
          );
        }

        propertyDeclarationStructuresByName[propertyDeclarationStructure.name] =
          propertyDeclarationStructure;
      }

      return Object.values(propertyDeclarationStructuresByName).sort(
        (left, right) => left.name.localeCompare(right.name),
      );
    }

    toClassDeclarationStructure(): OptionalKind<ClassDeclarationStructure> {
      return {
        ctors:
          this.propertyDeclarationStructures().length > 0
            ? [this.constructorDeclarationStructure()]
            : undefined,
        extends:
          this.superObjectTypes.length > 0
            ? this.superObjectTypes[0].name
            : undefined,
        isExported: true,
        name: this.name,
        properties: this.propertyDeclarationStructures(),
      };
    }

    toModuleDeclarationStructure(): OptionalKind<ModuleDeclarationStructure> {
      return {
        isExported: true,
        name: this.name,
        statements: [this.parametersInterfaceDeclarationStructure()],
      };
    }
  }

  class Property extends TsGenerator.Property {
    toPropertyDeclarationStructure(): OptionalKind<PropertyDeclarationStructure> {
      return{
    isReadonly: true,
    name: this.name,
    type: this.typeName,
    };
  }
}
