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
    toInterfaceDeclarationStructure(): OptionalKind<InterfaceDeclarationStructure> {
      const propertySignatureStructures: OptionalKind<PropertySignatureStructure>[] =
        [
          {
            isReadonly: true,
            name: "identifier",
            type: this.identifierTypeName,
          },
        ];

      for (const property of this.properties) {
        const propertySignatureStructure: OptionalKind<PropertySignatureStructure> =
          {
            isReadonly: true,
            name: property.name,
            type: property.typeName,
          };
        if (
          propertySignatureStructures.some(
            (existingPropertySignatureStructure) =>
              existingPropertySignatureStructure.name ===
              propertySignatureStructure.name,
          )
        ) {
          throw new Error(
            `duplicate property '${propertySignatureStructure.name}' on ${this.inlineName}`,
          );
        }
        propertySignatureStructures.push(propertySignatureStructure);
      }
      propertySignatureStructures.sort((left, right) =>
        left.name.localeCompare(right.name),
      );

      return {
        isExported: true,
        name: this.inlineName,
        properties: propertySignatureStructures,
      };
    }
  }
}
