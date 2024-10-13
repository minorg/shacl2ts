import type {
  ClassDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  SourceFile,
} from "ts-morph";
import type * as ast from "../ast/index";
import { TsGenerator } from "./TsGenerator";

export class ClassTsGenerator extends TsGenerator {
  private readonly factory = new ClassTsGenerator.Factory();

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
    toSourceFile.addClass(
      this.factory
        .createObjectType(astObjectType)
        .toClassDeclarationStructure(),
    );
  }
}

export namespace ClassTsGenerator {
  export class Factory extends TsGenerator.Factory {
    override createObjectType(astType: ast.ObjectType): ObjectType {
      return new ObjectType(astType, this);
    }
  }

  export class ObjectType extends TsGenerator.ObjectType {
    private propertyDeclarationStructures(): OptionalKind<PropertyDeclarationStructure>[] {
      const propertyDeclarationStructuresByName: Record<
        string,
        OptionalKind<PropertyDeclarationStructure>
      > = {
        identifier: {
          isReadonly: true,
          name: "identifier",
          type: this.identifierTypeName,
        },
      };

      for (const property of this.properties) {
        const propertyDeclarationStructure: OptionalKind<PropertyDeclarationStructure> =
          {
            isReadonly: true,
            name: property.name,
            type: property.typeName,
          };
        if (
          propertyDeclarationStructuresByName[propertyDeclarationStructure.name]
        ) {
          throw new Error(
            `duplicate property '${propertyDeclarationStructure.name}' on ${this.inlineName}`,
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
      if (this.superObjectTypes.length > 1) {
        throw new RangeError(
          `object type '${this.inlineName}' has multiple super object types, can't use with classes`,
        );
      }

      return {
        extends:
          this.superObjectTypes.length > 0
            ? this.superObjectTypes[0].inlineName
            : undefined,
        isExported: true,
        name: this.inlineName,
        properties: this.propertyDeclarationStructures(),
      };
    }
  }
}
