import { camelCase } from "change-case";
import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import {
  type ClassDeclarationStructure,
  type FunctionDeclarationStructure,
  type OptionalKind,
  StructureKind,
  type TypeAliasDeclarationStructure,
} from "ts-morph";
import { DeclaredType } from "./DeclaredType.js";
import type { Import } from "./Import.js";
import type { ObjectType } from "./ObjectType.js";
import { Type } from "./Type.js";
import { hasherTypeConstraint } from "./_ObjectType/hashFunctionOrMethodDeclaration.js";

/**
 * A union of object types, generated as a type alias
 *
 *   type SomeUnion = Member1 | Member2 | ...
 *
 * with associated functions that switch on the type discriminator property and delegate to the appropriate
 * member type code.
 *
 * It also generates SPARQL graph patterns that UNION the member object types.
 */
export class ObjectUnionType extends DeclaredType {
  readonly fromRdfFunctionName = "fromRdf";
  readonly kind = "ObjectUnionType";
  readonly memberTypes: readonly ObjectType[];
  private readonly _discriminatorProperty: Type.DiscriminatorProperty;

  constructor({
    memberTypes,
    ...superParameters
  }: ConstructorParameters<typeof DeclaredType>[0] & {
    export_: boolean;
    memberTypes: readonly ObjectType[];
    name: string;
  }) {
    super(superParameters);
    invariant(memberTypes.length >= 2);
    this.memberTypes = memberTypes;
    const discriminatorPropertyName =
      memberTypes[0].discriminatorProperty.unsafeCoerce().name;
    const discriminatorPropertyValues: string[] = [];
    for (const memberType of this.memberTypes) {
      invariant(memberType.declarationType === memberTypes[0].declarationType);
      invariant(
        memberType._discriminatorProperty.name === discriminatorPropertyName,
      );
      discriminatorPropertyValues.push(
        ...memberType._discriminatorProperty.values,
      );
    }
    this._discriminatorProperty = {
      name: discriminatorPropertyName,
      values: discriminatorPropertyValues,
    };
  }

  override get conversions(): readonly Type.Conversion[] {
    return [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) => `typeof ${value} === "object"`,
        sourceTypeName: this.name,
      },
    ];
  }

  get declarationImports(): readonly Import[] {
    return this.memberTypes.flatMap((memberType) => memberType.useImports);
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.of(this._discriminatorProperty);
  }

  get equalsFunctionDeclaration(): Maybe<FunctionDeclarationStructure> {
    if (!this.features.has("equals")) {
      return Maybe.empty();
    }

    const caseBlocks = this.memberTypes.map((memberType) => {
      let returnExpression: string;
      switch (memberType.declarationType) {
        case "class":
          returnExpression = `left.equals(right as unknown as ${memberType.name})`;
          break;
        case "interface":
          returnExpression = `${memberType.name}.equals(left, right as unknown as ${memberType.name})`;
          break;
      }
      return `case "${memberType.name}": return ${returnExpression};`;
    });

    return Maybe.of({
      isExported: true,
      kind: StructureKind.Function,
      name: "equals",
      parameters: [
        {
          name: "left",
          type: this.name,
        },
        {
          name: "right",
          type: this.name,
        },
      ],
      returnType: "purifyHelpers.Equatable.EqualsResult",
      statements: `\
return purifyHelpers.Equatable.strictEquals(left.type, right.type).chain(() => {
  switch (left.${this._discriminatorProperty.name}) {
   ${caseBlocks.join(" ")}
  }
})`,
    });
  }

  get fromRdfFunctionDeclaration(): Maybe<FunctionDeclarationStructure> {
    if (!this.features.has("fromRdf")) {
      return Maybe.empty();
    }

    const parameters = this.memberTypes[0]
      .fromRdfFunctionDeclaration()
      .unsafeCoerce().parameters!;

    let expression = "";
    for (const memberType of this.memberTypes) {
      const typeExpression = `(${memberType.name}.${memberType.fromRdfFunctionName}(${parameters.map((parameter) => parameter.name).join(", ")}) as purify.Either<rdfjsResource.Resource.ValueError, ${this.name}>)`;
      expression =
        expression.length > 0
          ? `${expression}.altLazy(() => ${typeExpression})`
          : typeExpression;
    }

    return Maybe.of({
      isExported: true,
      kind: StructureKind.Function,
      name: this.fromRdfFunctionName,
      parameters,
      returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this.name}>`,
      statements: [`return ${expression};`],
    });
  }

  get hashFunctionDeclaration(): Maybe<FunctionDeclarationStructure> {
    if (!this.features.has("hash")) {
      return Maybe.empty();
    }

    const hasherVariable = "_hasher";
    const thisVariable = camelCase(this.name);

    const caseBlocks = this.memberTypes.map((memberType) => {
      let returnExpression: string;
      switch (memberType.declarationType) {
        case "class":
          returnExpression = `${thisVariable}.hash(${hasherVariable})`;
          break;
        case "interface":
          returnExpression = `${memberType.name}.${memberType.hashFunctionName}(${thisVariable}, ${hasherVariable})`;
          break;
      }
      return `case "${memberType.name}": return ${returnExpression};`;
    });

    return Maybe.of({
      isExported: true,
      kind: StructureKind.Function,
      name: "hash",
      parameters: [
        {
          name: thisVariable,
          type: this.name,
        },
        {
          name: hasherVariable,
          type: "HasherT",
        },
      ],
      returnType: "HasherT",
      statements: `switch (${thisVariable}.${this._discriminatorProperty.name}) { ${caseBlocks.join(" ")} }`,
      typeParameters: [
        {
          name: "HasherT",
          constraint: hasherTypeConstraint,
        },
      ],
    });
  }

  get sparqlGraphPatternsClassDeclaration(): Maybe<ClassDeclarationStructure> {
    if (!this.features.has("sparql-graph-patterns")) {
      return Maybe.empty();
    }

    const subjectVariable = "subject";

    return Maybe.of({
      ctors: [
        {
          parameters: [
            {
              name: subjectVariable,
              type: "sparqlBuilder.ResourceGraphPatterns.SubjectParameter",
            },
          ],
          statements: [
            `super(${subjectVariable});`,
            `this.add(sparqlBuilder.GraphPattern.union(${this.memberTypes.map((memberType) => `new ${memberType.name}.SparqlGraphPatterns(this.subject).toGroupGraphPattern()`).join(", ")}));`,
          ],
        },
      ],
      extends: "sparqlBuilder.ResourceGraphPatterns",
      isExported: true,
      kind: StructureKind.Class,
      name: "SparqlGraphPatterns",
    });
  }

  get toRdfFunctionDeclaration(): Maybe<FunctionDeclarationStructure> {
    if (!this.features.has("toRdf")) {
      return Maybe.empty();
    }

    const parametersVariable = "_parameters";
    const thisVariable = camelCase(this.name);

    const caseBlocks = this.memberTypes.map((memberType) => {
      let returnExpression: string;
      switch (memberType.declarationType) {
        case "class":
          returnExpression = `${thisVariable}.toRdf(${parametersVariable})`;
          break;
        case "interface":
          returnExpression = `${this.name}.toRdf(${thisVariable}, ${parametersVariable})`;
          break;
      }
      return `case "${memberType.name}": return ${returnExpression};`;
    });

    return Maybe.of({
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
      statements: `switch (${thisVariable}.${this._discriminatorProperty.name}) { ${caseBlocks.join(" ")} }`,
    });
  }

  get typeAliasDeclaration(): OptionalKind<TypeAliasDeclarationStructure> {
    return {
      isExported: true,
      name: this.name,
      type: this.memberTypes.map((memberType) => memberType.name).join(" | "),
    };
  }

  override propertyChainSparqlGraphPatternExpression({
    variables,
  }: Parameters<
    Type["propertyChainSparqlGraphPatternExpression"]
  >[0]): Maybe<Type.SparqlGraphPatternsExpression> {
    return Maybe.of(
      new Type.SparqlGraphPatternsExpression(
        `new ${this.name}.SparqlGraphPatterns(${variables.subject})`,
      ),
    );
  }

  override propertyEqualsFunction(): string {
    return `${this.name}.equals`;
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<Type["propertyFromRdfExpression"]>[0]): string {
    return `${variables.resourceValues}.head().chain(value => value.to${this.rdfjsResourceType().named ? "Named" : ""}Resource()).chain(_resource => ${this.name}.${this.fromRdfFunctionName}({ ...${variables.context}, resource: _resource }))`;
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    switch (this.memberTypes[0].declarationType) {
      case "class":
        return [`${variables.value}.hash(${variables.hasher});`];
      case "interface":
        return [`${this.name}.hash(${variables.value}, ${variables.hasher});`];
    }
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<Type["propertyToRdfExpression"]>[0]): string {
    const options = `{ mutateGraph: ${variables.mutateGraph}, resourceSet: ${variables.resourceSet} }`;
    switch (this.memberTypes[0].declarationType) {
      case "class":
        return `${variables.value}.toRdf(${options})`;
      case "interface":
        return `${this.name}.toRdf(${variables.value}, ${options})`;
    }
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
