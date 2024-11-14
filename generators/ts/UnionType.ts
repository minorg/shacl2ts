import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import { Memoize } from "typescript-memoize";
import { Type } from "./Type.js";

const syntheticTypeDiscriminatorPropertyName = "type";

function syntheticTypeDiscriminatorValue({
  type,
  typeIndex,
}: { type: Type; typeIndex: number }): string {
  return `${typeIndex}-${type.name}`;
}

export class UnionType extends Type {
  readonly kind = "UnionType";
  readonly memberTypes: readonly Type[];

  constructor({
    memberTypes,
    ...superParameters
  }: ConstructorParameters<typeof Type>[0] & { memberTypes: readonly Type[] }) {
    super(superParameters);
    invariant(memberTypes.length >= 2);
    this.memberTypes = memberTypes;
  }

  @Memoize()
  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return this.typesSharedDiscriminatorProperty.altLazy(() =>
      Maybe.of({
        name: syntheticTypeDiscriminatorPropertyName,
        values: this.memberTypes.map((_, typeIndex) => typeIndex.toString()),
      }),
    );
  }

  override get name(): string {
    if (this.typesSharedDiscriminatorProperty.isJust()) {
      // If every type shares a discriminator (e.g., RDF/JS "termType" or generated ObjectType "type"),
      // just join their names with "|"
      return `(${this.memberTypes.map((type) => type.name).join(" | ")})`;
    }

    return `(${this.memberTypes.map((type, typeIndex) => `{ ${syntheticTypeDiscriminatorPropertyName}: "${syntheticTypeDiscriminatorValue({ type, typeIndex })}", value: ${type.name} }`).join(" | ")})`;
  }

  @Memoize()
  private get typesSharedDiscriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    // Do all the composed types share a single discriminator property?
    let typesSharedDiscriminatorProperty:
      | (Omit<Type.DiscriminatorProperty, "values"> & {
          values: string[];
        })
      | undefined;
    for (const type of this.memberTypes) {
      const typeDiscriminatorProperty = type.discriminatorProperty.extract();
      if (!typeDiscriminatorProperty) {
        return Maybe.empty();
      }
      if (!typesSharedDiscriminatorProperty) {
        typesSharedDiscriminatorProperty = {
          name: typeDiscriminatorProperty.name,
          values: typeDiscriminatorProperty.values.concat(),
        };
      } else if (
        typeDiscriminatorProperty.name === typesSharedDiscriminatorProperty.name
      ) {
        typesSharedDiscriminatorProperty.values =
          typesSharedDiscriminatorProperty.values.concat(
            typeDiscriminatorProperty.values,
          );
      } else {
        return Maybe.empty();
      }
    }
    return Maybe.fromNullable(typesSharedDiscriminatorProperty);
  }

  override equalsFunction(): string {
    return `
(left: ${this.name}, right: ${this.name}) => {
${this.memberTypes
  .flatMap((type, typeIndex) =>
    this.typesSharedDiscriminatorProperty
      .map((typesSharedDiscriminatorProperty) => {
        // Types share a discriminator property already, use it
        return type.discriminatorProperty.unsafeCoerce().values.map(
          (
            value,
          ) => `if (left.${typesSharedDiscriminatorProperty.name} === "${value}" && right.${typesSharedDiscriminatorProperty.name} === "${value}") {
  return ${type.equalsFunction()}(left, right);
}`,
        );
      })
      .orDefaultLazy(() => [
        // Types don't share a discriminator property, have to use the one we synthesized
        `if (left.${syntheticTypeDiscriminatorPropertyName} === "${syntheticTypeDiscriminatorValue({ type, typeIndex })}" && right.${syntheticTypeDiscriminatorPropertyName} === "${syntheticTypeDiscriminatorValue({ type, typeIndex })}") {
  return ${type.equalsFunction()}(left.value, right.value);
}`,
      ]),
  )
  .join("\n")}

  return purify.Left({ left, right, propertyName: "type", propertyValuesUnequal: { left: typeof left, right: typeof right, type: "BooleanEquals" }, type: "Property" });
}`;
  }

  override fromRdfExpression(
    parameters: Parameters<Type["fromRdfExpression"]>[0],
  ): string {
    let expression = "";
    this.memberTypes.forEach((type, typeIndex) => {
      let typeExpression = type.fromRdfExpression(parameters);
      if (!this.typesSharedDiscriminatorProperty.isJust()) {
        typeExpression = `${typeExpression}.map(value => ({ type: "${typeIndex}-${type.name}" as const, value }) as (${this.name}))`;
      }
      typeExpression = `(${typeExpression} as purify.Either<rdfjsResource.Resource.ValueError, ${this.name}>)`;
      expression =
        expression.length > 0
          ? `${expression}.altLazy(() => ${typeExpression})`
          : typeExpression;
    });
    return expression;
  }

  override hashStatements({
    variables,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    const caseBlocks: string[] = [];
    this.memberTypes.forEach((type, typeIndex) => {
      if (this.typesSharedDiscriminatorProperty.isJust()) {
        for (const typeDiscriminatorPropertyValue of type.discriminatorProperty.unsafeCoerce()
          .values) {
          caseBlocks.push(
            `case "${typeDiscriminatorPropertyValue}": { ${type.hashStatements({
              variables,
            })}; break; }`,
          );
        }
      } else {
        caseBlocks.push(
          `case "${syntheticTypeDiscriminatorValue({
            type,
            typeIndex,
          })}": { ${type.hashStatements({ variables: { hasher: variables.hasher, value: `${variables}.value` } })}; break; }`,
        );
      }
    });
    const switchValue = this.typesSharedDiscriminatorProperty
      .map(
        (typeSharedDiscriminatorProperty) =>
          `${variables.value}.${typeSharedDiscriminatorProperty.name}`,
      )
      .orDefaultLazy(
        () => `${variables.value}.${syntheticTypeDiscriminatorPropertyName}`,
      );
    return [`switch (${switchValue}) { ${caseBlocks.join("\n")} }`];
  }

  override sparqlGraphPatternExpression(
    parameters: Parameters<Type["sparqlGraphPatternExpression"]>[0],
  ): Maybe<Type.SparqlGraphPatternExpression> {
    const typeSparqlGraphPatternExpressions = this.memberTypes.flatMap((type) =>
      type.sparqlGraphPatternExpression(parameters).toList(),
    );
    switch (typeSparqlGraphPatternExpressions.length) {
      case 0:
        return Maybe.empty();
      case 1: {
        switch (typeSparqlGraphPatternExpressions[0].type) {
          case "GraphPattern":
            return Maybe.of({
              type: "GraphPattern",
              value: `sparqlBuilder.GraphPattern.optional(${typeSparqlGraphPatternExpressions[0].value})`,
            });
          case "GraphPatterns":
            return Maybe.of({
              type: "GraphPattern",
              value: `sparqlBuilder.GraphPattern.optional(sparqlBuilder.GraphPattern.group(${typeSparqlGraphPatternExpressions[0].value}))`,
            });
        }
        // @ts-expect-error This is actually unreachable code but the compiler has a bug that complains about the switch if this is not present.
        break;
      }
      default:
        invariant(
          typeSparqlGraphPatternExpressions.length === this.memberTypes.length,
          "all types must be represented in the SPARQL UNION",
        );
        return Maybe.of({
          type: "GraphPattern",
          value: `sparqlBuilder.GraphPattern.union(${typeSparqlGraphPatternExpressions
            .map((typeSparqlGraphPatternExpression) => {
              switch (typeSparqlGraphPatternExpression.type) {
                case "GraphPattern":
                  return typeSparqlGraphPatternExpression.value;
                case "GraphPatterns":
                  return `sparqlBuilder.GraphPattern.group(${typeSparqlGraphPatternExpression.value})`;
              }
            })
            .join(", ")})`,
        });
    }
  }

  override toRdfStatements({
    variables,
  }: Parameters<Type["toRdfStatements"]>[0]): readonly string[] {
    const statements: string[] = [];
    this.memberTypes.forEach((type, typeIndex) => {
      const typeStatements = type.toRdfStatements({ variables }).join("\n");
      this.typesSharedDiscriminatorProperty
        .ifJust((typeShareDiscriminatorProperty) => {
          for (const typeDiscriminatorValue of typeShareDiscriminatorProperty.values) {
            statements.push(
              `if (${variables.value}.${typeShareDiscriminatorProperty.name} === "${typeDiscriminatorValue}") { ${typeStatements} }`,
            );
          }
        })
        .ifNothing(() => {
          statements.push(
            `if (${variables.value}.${syntheticTypeDiscriminatorPropertyName} === "${syntheticTypeDiscriminatorValue({ type, typeIndex })}") { ${typeStatements} }`,
          );
        });
    });
    return statements;
  }
}
