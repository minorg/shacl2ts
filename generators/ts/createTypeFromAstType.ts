import { xsd } from "@tpluscode/rdf-ns-builders";
import type * as ast from "../../ast";
import { AndType } from "./AndType.js";
import { EnumType } from "./EnumType.js";
import { IdentifierType } from "./IdentifierType";
import { LiteralType } from "./LiteralType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { OrType } from "./OrType.js";
import { StringType } from "./StringType.js";
import type { Type } from "./Type.js";

export function createTypeFromAstType({
  astType,
  ...parameters
}: { astType: ast.Type } & Type.ConstructorParameters): Type {
  switch (astType.kind) {
    case "And":
      return AndType.fromAstType({ astType, ...parameters });
    case "Enum":
      return EnumType.fromAstType({ astType, ...parameters });
    case "Identifier":
      return IdentifierType.fromAstType({ astType, ...parameters });
    case "Literal": {
      const datatype = astType.datatype.orDefault(xsd.string);
      if (datatype.equals(xsd.integer)) {
        return NumberType.fromAstType({ astType, ...parameters });
      }
      if (datatype.equals(xsd.anyURI) || datatype.equals(xsd.string)) {
        return StringType.fromAstType({ astType, ...parameters });
      }
      return LiteralType.fromAstType({ astType, ...parameters });
    }
    case "Object":
      return ObjectType.fromAstType({ astType, ...parameters });
    case "Or":
      return OrType.fromAstType({ astType, ...parameters });
  }
}
