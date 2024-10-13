import type {
  InterfaceDeclarationStructure,
  OptionalKind,
  PropertySignatureStructure,
  SourceFile,
} from "ts-morph";
import type * as ast from "../ast/index";
import { TsGenerator } from "./TsGenerator";

export class InterfaceTsGenerator extends TsGenerator {
  private readonly factory = new InterfaceTsGenerator.Factories();

  protected override addImportDeclarations(toSourceFile: SourceFile): void {
    toSourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });
    toSourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });
  }

  protected override addObjectType(
    astObjectType: ast.ObjectType,
    toSourceFile: SourceFile,
  ) {
    toSourceFile.addInterface(
      this.factory
        .createObjectType(astObjectType)
        .toInterfaceDeclarationStructure(),
    );
  }
}

export namespace InterfaceTsGenerator {
  class ObjectType extends TsGenerator.ObjectType {
    constructor(astType: ast.ObjectType, factories: TsGenerator.Factories) {
      super(astType, factories);
      this.properties.push({
        type: new TsGenerator.ObjectType(),
      });
    }

    private propertySignatureStructures(): OptionalKind<PropertySignatureStructure>[] {
      const propertySignatureStructuresByName: Record<
        string,
        OptionalKind<PropertySignatureStructure>
      > = {
        identifier: {
          isReadonly: true,
          name: "identifier",
          type: this.identifierTypeName,
        },
      };

      for (const property of this.properties) {
        const propertySignatureStructure = (
          property as Property
        ).toPropertySignatureStructure();

        if (
          propertySignatureStructuresByName[propertySignatureStructure.name]
        ) {
          throw new Error(
            `duplicate property '${propertySignatureStructure.name}' on ${this.name}`,
          );
        }

        propertySignatureStructuresByName[propertySignatureStructure.name] =
          propertySignatureStructure;
      }

      return Object.values(propertySignatureStructuresByName).sort(
        (left, right) => left.name.localeCompare(right.name),
      );
    }

    toInterfaceDeclarationStructure(): OptionalKind<InterfaceDeclarationStructure> {
      return {
        extends: this.superObjectTypes.map(
          (superObjectType) => superObjectType.name,
        ),
        isExported: true,
        name: this.name,
        properties: this.propertySignatureStructures(),
      };
    }
  }

  class Property extends TsGenerator.Property {
    toPropertySignatureStructure(): OptionalKind<PropertySignatureStructure> {
      return {
        isReadonly: true,
        name: this.name,
        type: this.typeName,
      };
    }
  }
}
