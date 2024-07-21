import { EnumType } from "./EnumType.js";
import { LiteralType } from "./LiteralType.js";
import { ObjectType } from "./ObjectType.js";
import { UnionType } from "./UnionType.js";

export type Type = EnumType | LiteralType | ObjectType | UnionType;
