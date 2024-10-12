import type {
  OptionalKind,
  PropertySignatureStructure,
  SourceFile,
} from "ts-morph";
import type * as ast from "../ast/index";
import { TsGenerator } from "./TsGenerator";

export class InterfaceTsGenerator extends TsGenerator {
  constructor(ast: ast.Ast) {
    super(ast, new InterfaceTsGenerator.Factory());
  }
}

export namespace InterfaceTsGenerator {
  export class Factory extends TsGenerator.Factory {
    override createObjectType(astType: ast.ObjectType): TsGenerator.ObjectType {
      return new ObjectType(astType, this);
    }
  }

  export class ObjectType extends TsGenerator.ObjectType {
    override addStructureTo(sourceFile: SourceFile): void {
      const propertySignatureStructures: OptionalKind<PropertySignatureStructure>[] =
        [
          {
            isReadonly: true,
            name: "identifier",
            type: "rdfjs.BlankNode | rdfjs.NamedNode",
          },
        ];
      for (const property of this.properties) {
        const propertySignatureStructure = property
          .toPropertySignatureStructure()
          .extractNullable();
        if (propertySignatureStructure === null) {
          continue;
        }
        if (
          propertySignatureStructures.some(
            (existingPropertySignatureStructure) =>
              existingPropertySignatureStructure.name ===
              propertySignatureStructure.name,
          )
        ) {
          throw new Error(
            `duplicate property '${propertySignatureStructure.name}' on ${this.name}`,
          );
        }
        propertySignatureStructures.push(propertySignatureStructure);
      }
      propertySignatureStructures.sort((left, right) =>
        left.name.localeCompare(right.name),
      );

      sourceFile.addInterface({
        isExported: true,
        name: this.name,
        properties: propertySignatureStructures,
      });
    }
  }
}
