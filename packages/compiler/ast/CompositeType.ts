import type { Type } from "./Type.js";

/**
 * A composite of types, such as an intersection or union.
 */
export interface CompositeType<MemberTypeT extends Type> {
  /**
   * Member types.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly memberTypes: MemberTypeT[];
}
