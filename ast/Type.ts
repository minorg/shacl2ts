import { AndType } from "./AndType.js";
import { EnumType } from "./EnumType.js";
import { LiteralType } from "./LiteralType.js";
import { ObjectType } from "./ObjectType.js";
import { OrType } from "./OrType.js";

export type Type = AndType | EnumType | LiteralType | ObjectType | OrType;
