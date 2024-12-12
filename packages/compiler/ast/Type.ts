import type { IdentifierType } from "./IdentifierType.js";
import type { IntersectionType } from "./IntersectionType.js";
import type { LiteralType } from "./LiteralType.js";
import type { NativeType } from "./NativeType.js";
import type { ObjectIntersectionType } from "./ObjectIntersectionType.js";
import type { ObjectType } from "./ObjectType.js";
import type { ObjectUnionType } from "./ObjectUnionType.js";
import type { OptionType } from "./OptionType.js";
import type { SetType } from "./SetType.js";
import type { UnionType } from "./UnionType.js";

export type Type =
  | IdentifierType
  | IntersectionType
  | LiteralType
  | NativeType
  | ObjectIntersectionType
  | ObjectType
  | ObjectUnionType
  | OptionType
  | SetType
  | UnionType;
