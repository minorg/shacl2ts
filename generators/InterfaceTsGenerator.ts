import type { SourceFile } from "ts-morph";
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
      sourceFile.addInterface({
        isExported: true,
        name: this.name,
        properties: this.properties.flatMap((property) =>
          property.toPropertySignatureStructure().toList(),
        ),
      });
    }
  }
}
