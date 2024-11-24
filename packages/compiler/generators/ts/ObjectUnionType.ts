import {
  type FunctionDeclarationStructure,
  type OptionalKind,
  StructureKind,
  type TypeAliasDeclarationStructure,
} from "ts-morph";
import type { ObjectType } from "./ObjectType.js";
import { UnionType } from "./UnionType.js";

export class ObjectUnionType extends UnionType<ObjectType> {
  readonly export: boolean;

  constructor({
    export_,
    ...superParameters
  }: Omit<ConstructorParameters<typeof UnionType<ObjectType>>[0], "name"> & {
    export_: boolean;
    name: string;
  }) {
    super(superParameters);
    this.export = export_;
  }

  get fromRdfFunctionDeclaration(): FunctionDeclarationStructure {
    const variables = {
      ignoreRdfType: "ignoreRdfType",
      options: "_options",
      resource: "_resource",
    };

    let expression = "";
    for (const memberType of this.memberTypes) {
      const typeExpression = `(${memberType.name}.fromRdf(${variables.resource}, ${variables.options}) as purify.Either<rdfjsResource.Resource.ValueError, ${this.name}>)`;
      expression =
        expression.length > 0
          ? `${expression}.altLazy(() => ${typeExpression})`
          : typeExpression;
    }

    return {
      isExported: true,
      kind: StructureKind.Function,
      name: "fromRdf",
      parameters: [
        {
          name: variables.resource,
          type: this.rdfjsResourceTypeName,
        },
        {
          hasQuestionToken: true,
          name: variables.options,
          type: `{ ${variables.ignoreRdfType}?: boolean }`,
        },
      ],
      returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.name}>`,
      statements: [`return ${expression};`],
    };
  }

  get typeAliasDeclaration(): OptionalKind<TypeAliasDeclarationStructure> {
    return {
      isExported: true,
      name: this.name,
      type: this.memberTypes.map((memberType) => memberType.name).join(" | "),
    };
  }

  private get rdfjsResourceTypeName(): string {
    const memberTypeNameSet = new Set<string>();
    for (const memberType of this.memberTypes) {
      memberTypeNameSet.add(memberType.rdfjsResourceType().name);
    }
    const memberTypeNames = [...memberTypeNameSet];
    if (memberTypeNames.length === 1) {
      return memberTypeNames[0];
    }
    return "rdfjsResource.Resource";
  }
}
