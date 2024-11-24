import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import { Memoize } from "typescript-memoize";
import { Type } from "./Type.js";

interface MemberTypeTraits {
  readonly discriminatorPropertyValues: readonly string[];
  readonly memberType: Type;
  readonly payload: (instance: string) => string;
}

export class UnionType extends Type {
  readonly _discriminatorProperty: Type.DiscriminatorProperty & {
    readonly synthetic: boolean;
  };
  readonly kind = "UnionType";
  readonly memberTypes: readonly Type[];
  readonly name: string;
  private readonly memberTypeTraits: readonly MemberTypeTraits[];

  constructor({
    memberTypes,
    name,
    ...superParameters
  }: ConstructorParameters<typeof Type>[0] & {
    memberTypes: readonly Type[];
    name?: string;
  }) {
    super(superParameters);
    invariant(memberTypes.length >= 2);
    this.memberTypes = memberTypes;

    const memberTypeTraits: MemberTypeTraits[] = [];
    // Do all the composed types share a single discriminator property?
    let memberTypesSharedDiscriminatorProperty:
      | (Omit<Type.DiscriminatorProperty, "values"> & {
          values: string[];
        })
      | undefined;
    for (const memberType of this.memberTypes) {
      const memberTypeDiscriminatorProperty =
        memberType.discriminatorProperty.extract();
      if (!memberTypeDiscriminatorProperty) {
        memberTypesSharedDiscriminatorProperty = undefined;
        break;
      }
      if (!memberTypesSharedDiscriminatorProperty) {
        memberTypesSharedDiscriminatorProperty = {
          name: memberTypeDiscriminatorProperty.name,
          values: memberTypeDiscriminatorProperty.values.concat(),
        };
      } else if (
        memberTypeDiscriminatorProperty.name ===
        memberTypesSharedDiscriminatorProperty.name
      ) {
        memberTypesSharedDiscriminatorProperty.values =
          memberTypesSharedDiscriminatorProperty.values.concat(
            memberTypeDiscriminatorProperty.values,
          );
      } else {
        memberTypesSharedDiscriminatorProperty = undefined;
        break;
      }
      memberTypeTraits.push({
        discriminatorPropertyValues: memberTypeDiscriminatorProperty.values,
        memberType,
        payload: (instance) => instance,
      });
    }

    if (memberTypesSharedDiscriminatorProperty) {
      this._discriminatorProperty = {
        ...memberTypesSharedDiscriminatorProperty,
        synthetic: false,
      };
      // If every type shares a discriminator (e.g., RDF/JS "termType" or generated ObjectType "type"),
      // just join their names with "|"
      this.memberTypeTraits = memberTypeTraits;
      this.name =
        name ??
        `(${this.memberTypes.map((memberType) => memberType.name).join(" | ")})`;
    } else {
      this._discriminatorProperty = {
        name: "type",
        synthetic: true,
        values: this.memberTypes.map(
          (memberType, memberTypeIndex) =>
            `${memberTypeIndex}-${memberType.name}`,
        ),
      };
      this.memberTypeTraits = this.memberTypes.map(
        (memberType, memberTypeIndex) => ({
          discriminatorPropertyValues: [
            `${memberTypeIndex}-${memberType.name}`,
          ],
          memberType,
          payload: (instance) => `${instance}.value`,
        }),
      );
      this.name =
        name ??
        `(${this.memberTypeTraits.map((memberTypeTraits) => `{ ${this._discriminatorProperty.name}: "${memberTypeTraits.discriminatorPropertyValues[0]}", value: ${memberTypeTraits.memberType.name} }`).join(" | ")})`;
    }
  }

  @Memoize()
  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.of(this._discriminatorProperty);
  }

  override propertyEqualsFunction(): string {
    return `
(left: ${this.name}, right: ${this.name}) => {
${this.memberTypeTraits
  .flatMap((memberTypeTraits) =>
    memberTypeTraits.discriminatorPropertyValues.map(
      (
        value,
      ) => `if (left.${this._discriminatorProperty.name} === "${value}" && right.${this._discriminatorProperty.name} === "${value}") {
  return ${memberTypeTraits.memberType.propertyEqualsFunction()}(left, right);
}`,
    ),
  )
  .join("\n")}

  return purify.Left({ left, right, propertyName: "type", propertyValuesUnequal: { left: typeof left, right: typeof right, type: "BooleanEquals" }, type: "Property" });
}`;
  }

  override propertyFromRdfExpression(
    parameters: Parameters<Type["propertyFromRdfExpression"]>[0],
  ): string {
    let expression = "";
    for (const memberTypeTraits of this.memberTypeTraits) {
      let typeExpression =
        memberTypeTraits.memberType.propertyFromRdfExpression(parameters);
      if (this._discriminatorProperty.synthetic) {
        typeExpression = `${typeExpression}.map(value => ({ ${this._discriminatorProperty.name}: "${memberTypeTraits.discriminatorPropertyValues[0]}" as const, value }) as (${this.name}))`;
      }
      typeExpression = `(${typeExpression} as purify.Either<rdfjsResource.Resource.ValueError, ${this.name}>)`;
      expression =
        expression.length > 0
          ? `${expression}.altLazy(() => ${typeExpression})`
          : typeExpression;
    }
    return expression;
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    const caseBlocks: string[] = [];
    for (const memberTypeTraits of this.memberTypeTraits) {
      for (const discriminatorPropertyValue of memberTypeTraits.discriminatorPropertyValues) {
        caseBlocks.push(
          `case "${discriminatorPropertyValue}": { ${memberTypeTraits.memberType.propertyHashStatements(
            {
              variables: {
                hasher: variables.hasher,
                value: `${memberTypeTraits.payload(variables.value)}`,
              },
            },
          )}; break; }`,
        );
      }
    }
    return [
      `switch (${variables.value}.${this._discriminatorProperty.name}) { ${caseBlocks.join("\n")} }`,
    ];
  }

  override propertySparqlGraphPatternExpression(
    parameters: Parameters<Type["propertySparqlGraphPatternExpression"]>[0],
  ): Type.SparqlGraphPatternExpression | Type.SparqlGraphPatternsExpression {
    return new Type.SparqlGraphPatternExpression(
      `sparqlBuilder.GraphPattern.union(${this.memberTypes
        .map((type) =>
          type
            .propertySparqlGraphPatternExpression(parameters)
            .toSparqlGraphPatternExpression()
            .toString(),
        )
        .join(", ")})`,
    );
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<Type["propertyToRdfExpression"]>[0]): string {
    let expression = "";
    for (const memberTypeTraits of this.memberTypeTraits) {
      if (expression.length === 0) {
        expression = memberTypeTraits.memberType.propertyToRdfExpression({
          variables: {
            ...variables,
            value: memberTypeTraits.payload(variables.value),
          },
        });
      } else {
        expression = `(${memberTypeTraits.discriminatorPropertyValues
          .map(
            (value) =>
              `${variables.value}.${this._discriminatorProperty.name} === "${value}"`,
          )
          .join(
            " || ",
          )}) ? ${memberTypeTraits.memberType.propertyToRdfExpression({ variables: { ...variables, value: memberTypeTraits.payload(variables.value) } })} : ${expression}`;
      }
    }
    return expression;
  }
}
