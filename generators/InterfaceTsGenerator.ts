import type {
  InterfaceDeclarationStructure,
  OptionalKind,
  PropertySignatureStructure,
  SourceFile,
} from "ts-morph";
import type * as ast from "../ast/index";
import { TsGenerator } from "./TsGenerator";

export class InterfaceTsGenerator extends TsGenerator {
  private readonly factory = new InterfaceTsGenerator.Factory();

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
  export class Factory extends TsGenerator.Factory {
    override createObjectType(astType: ast.ObjectType): ObjectType {
      return new ObjectType(astType, this);
    }
  }

  export class ObjectType extends TsGenerator.ObjectType {
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
        const propertySignatureStructure: OptionalKind<PropertySignatureStructure> =
          {
            isReadonly: true,
            name: property.name,
            type: property.typeName,
          };
        if (
          propertySignatureStructuresByName[propertySignatureStructure.name]
        ) {
          throw new Error(
            `duplicate property '${propertySignatureStructure.name}' on ${this.inlineName}`,
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
          (superObjectType) => superObjectType.inlineName,
        ),
        isExported: true,
        name: this.inlineName,
        properties: this.propertySignatureStructures(),
      };
    }
  }
}
