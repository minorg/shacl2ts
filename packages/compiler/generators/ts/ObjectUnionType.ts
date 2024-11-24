import { camelCase } from "change-case";
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
          type: this.rdfjsResourceType().name,
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

  get toRdfFunctionDeclaration(): FunctionDeclarationStructure {
    const parametersVariable = "_parameters";
    const thisVariable = camelCase(this.name);

    return {
      isExported: true,
      kind: StructureKind.Function,
      name: "toRdf",
      parameters: [
        {
          name: thisVariable,
          type: this.name,
        },
        {
          name: parametersVariable,
          type: "{ mutateGraph: rdfjsResource.MutableResource.MutateGraph, resourceSet: rdfjsResource.MutableResourceSet }",
        },
      ],
      returnType: this.rdfjsResourceType({ mutable: true }).name,
      statements: `switch (${thisVariable}.${this.configuration.objectTypeDiscriminatorPropertyName}) { ${this.memberTypes.map((memberType) => `case "${memberType.name}": return ${thisVariable}.toRdf(${parametersVariable});`).join(" ")} }`,
    };
  }

  get typeAliasDeclaration(): OptionalKind<TypeAliasDeclarationStructure> {
    return {
      isExported: true,
      name: this.name,
      type: this.memberTypes.map((memberType) => memberType.name).join(" | "),
    };
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<
    UnionType<ObjectType>["propertyFromRdfExpression"]
  >[0]): string {
    return `${variables.resourceValues}.head().chain(value => value.to${this.rdfjsResourceType().named ? "Named" : ""}Resource()).chain(_resource => ${this.name}.fromRdf(_resource))`;
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<UnionType<ObjectType>["propertyToRdfExpression"]>[0]): string {
    return `${variables.value}.toRdf({ mutateGraph: ${variables.mutateGraph}, resourceSet: ${variables.resourceSet} })`;
  }

  private rdfjsResourceType(options?: { mutable?: boolean }): ReturnType<
    ObjectType["rdfjsResourceType"]
  > {
    const memberRdfjsResourceTypes: ReturnType<
      ObjectType["rdfjsResourceType"]
    >[] = [];
    for (const memberType of this.memberTypes) {
      const memberRdfjsResourceType = memberType.rdfjsResourceType(options);

      if (
        memberRdfjsResourceTypes.some(
          (existingMemberRdfjsResourceType) =>
            existingMemberRdfjsResourceType.name !==
            memberRdfjsResourceType.name,
        )
      ) {
        // The types don't agree, return a generic type
        return {
          mutable: !!options?.mutable,
          name: "rdfjsResource.Resource",
          named: false,
        };
      }

      memberRdfjsResourceTypes.push(memberRdfjsResourceType);
    }

    // The types agree
    return memberRdfjsResourceTypes[0];
  }
}
