import type { AndType } from "./AndType.js";
import type { EnumType } from "./EnumType.js";
import type { LiteralType } from "./LiteralType.js";
import type { ObjectType } from "./ObjectType.js";
import type { OrType } from "./OrType.js";

export type Type = AndType | EnumType | LiteralType | ObjectType | OrType;
