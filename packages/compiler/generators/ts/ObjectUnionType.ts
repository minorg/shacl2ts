import type { OptionalKind, TypeAliasDeclarationStructure } from "ts-morph";
import type { ObjectType } from "./ObjectType.js";
import { UnionType } from "./UnionType.js";

export class ObjectUnionType extends UnionType<ObjectType> {
  // biome-ignore lint/complexity/noUselessConstructor: <explanation>
  constructor(
    parameters: Omit<
      ConstructorParameters<typeof UnionType<ObjectType>>[0],
      "name"
    > & {
      name: string;
    },
  ) {
    super(parameters);
  }

  get typeAliasDeclaration(): OptionalKind<TypeAliasDeclarationStructure> {
    return {
      isExported: true,
      name: this.name,
      type: this.memberTypes.map((memberType) => memberType.name).join(" | "),
    };
  }
}
