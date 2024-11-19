import { invariant } from "ts-invariant";
import { Type } from "./Type.js";

export class IntersectionType<MemberTypeT extends Type = Type> extends Type {
  readonly kind = "IntersectionType";
  readonly memberTypes: readonly MemberTypeT[];

  constructor({
    memberTypes,
    ...superParameters
  }: ConstructorParameters<typeof Type>[0] & {
    memberTypes: readonly MemberTypeT[];
  }) {
    super(superParameters);
    invariant(memberTypes.length >= 2);
    this.memberTypes = memberTypes;
  }

  get name(): string {
    return `(${this.memberTypes.map((type) => type.name).join(" & ")})`;
  }

  override equalsFunction(): string {
    throw new Error("Method not implemented.");
  }

  override fromRdfExpression(): string {
    throw new Error("Method not implemented.");
  }

  override hashStatements(): readonly string[] {
    throw new Error("Method not implemented.");
  }

  override toRdfExpression(): string {
    throw new Error("Method not implemented.");
  }
}
