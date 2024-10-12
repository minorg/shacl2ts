import { Maybe } from "purify-ts";
import type {
  OptionalKind,
  PropertySignatureStructure,
  SourceFile,
} from "ts-morph";
import type * as ast from "../ast/index";
import { TsGenerator } from "./TsGenerator";

export class InterfaceTsGenerator extends TsGenerator {
  protected override addObjectType(
    objectType: ast.ObjectType,
    sourceFile: SourceFile,
  ): void {
    sourceFile.addInterface({
      name: objectType.name.tsName,
      properties: objectType.properties.flatMap((property) =>
        this.propertyToPropertySignatureStructure(property).toList(),
      ),
    });
  }

  private propertyToPropertySignatureStructure(
    property: ast.Property,
  ): Maybe<OptionalKind<PropertySignatureStructure>> {
    const minCount = property.minCount.orDefault(0);
    const maxCount = property.maxCount.extractNullable();
    if (minCount === 0 && maxCount === 1) {
      return Maybe.of({
        name: property.name.tsName,
      });
    }
    if (minCount === 1 && maxCount === 1) {
      return Maybe.of({
        name: property.name.tsName,
      });
    }
    return Maybe.of({
      name: property.name.tsName,
    });
  }
}
