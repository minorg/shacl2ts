import type { IdentifierType } from "./IdentifierType.js";
import type { IntersectionType } from "./IntersectionType.js";
import type { LiteralType } from "./LiteralType.js";
import type { ObjectType } from "./ObjectType.js";
import type { OptionType } from "./OptionType";
import type { SetType } from "./SetType";
import type { UnionType } from "./UnionType.js";

export type Type =
  | IdentifierType
  | IntersectionType
  | LiteralType
  | ObjectType
  | OptionType
  | SetType
  | UnionType;
