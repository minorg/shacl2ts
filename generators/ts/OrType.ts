import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import { Memoize } from "typescript-memoize";
import { ComposedType } from "./ComposedType.js";
import type { Type } from "./Type.js";

const syntheticTypeDiscriminatorPropertyName = "type";

function syntheticTypeDiscriminatorValue({
  type,
  typeIndex,
}: { type: Type; typeIndex: number }): string {
  return `${typeIndex}-${type.name}`;
}

export class OrType extends ComposedType {
  readonly kind = "Or";

  @Memoize()
  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return this.typesSharedDiscriminatorProperty.altLazy(() =>
      Maybe.of({
        name: syntheticTypeDiscriminatorPropertyName,
        values: this.types.map((_, typeIndex) => typeIndex.toString()),
      }),
    );
  }

  @Memoize()
  get name(): string {
    if (this.typesSharedDiscriminatorProperty.isJust()) {
      // If every type shares a discriminator (e.g., RDF/JS "termType" or generated ObjectType "type"),
      // just join their names with "|"
      return `(${this.types.map((type) => type.name).join(" | ")})`;
    }

    return `(${this.types.map((type, typeIndex) => `{ ${syntheticTypeDiscriminatorPropertyName}: "${syntheticTypeDiscriminatorValue({ type, typeIndex })}", value: ${type.name} }`).join(" | ")})`;
  }

  @Memoize()
  private get typesSharedDiscriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    // Do all the composed types share a single discriminator property?
    let typesSharedDiscriminatorProperty:
      | (Omit<Type.DiscriminatorProperty, "values"> & {
          values: string[];
        })
      | undefined;
    for (const type of this.types) {
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

  equalsFunction(): string {
    return `
(left: ${this.name}, right: ${this.name}) => {
${this.types
  .flatMap((type, typeIndex) =>
    this.typesSharedDiscriminatorProperty
      .map((typesSharedDiscriminatorProperty) => {
        // Types share a discriminator property already, use it
        return typesSharedDiscriminatorProperty.values.map(
          (
            value,
          ) => `if (left.${typesSharedDiscriminatorProperty} === "${value}" && right.${typesSharedDiscriminatorProperty} === "${value}") {
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

  fromRdfExpression(parameters: Type.FromRdfExpressionParameters): string {
    let expression = "";
    this.types.forEach((type, typeIndex) => {
      let typeExpression = type.fromRdfExpression(parameters);
      if (!this.typesSharedDiscriminatorProperty.isJust()) {
        typeExpression = `${typeExpression}.map(value => ({ type: "${typeIndex}-${type.name}" as const, value }) as (${this.name}))`;
      }
      expression =
        expression.length > 0
          ? `${expression}.altLazy(() => ${typeExpression})`
          : typeExpression;
    });
    return expression;
  }

  sparqlGraphPatternExpression({
    subjectVariable,
  }: Type.SparqlGraphPatternParameters): Maybe<Type.SparqlGraphPatternExpression> {
    const typeSparqlGraphPatternExpressions = this.types.flatMap((type) =>
      type.sparqlGraphPatternExpression({ subjectVariable }).toList(),
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
          typeSparqlGraphPatternExpressions.length === this.types.length,
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
            .join(", ")}})`,
        });
    }
  }

  toRdfExpression({
    propertyValueVariable,
    ...otherParameters
  }: Type.ToRdfExpressionParameters): string {
    let expression = "";
    this.types.forEach((type, typeIndex) => {
      if (this.typesSharedDiscriminatorProperty.isJust()) {
        if (expression.length === 0) {
          expression = type.toRdfExpression({
            propertyValueVariable,
            ...otherParameters,
          });
        } else {
          expression = `(${type.discriminatorProperty
            .unsafeCoerce()
            .values.map(
              (value) =>
                `${propertyValueVariable}.${this.typesSharedDiscriminatorProperty.unsafeCoerce().name} === "${value}"`,
            )
            .join(
              " || ",
            )}) ? ${type.toRdfExpression({ propertyValueVariable, ...otherParameters })} : ${expression}`;
        }
      } else {
        if (expression.length === 0) {
          expression = type.toRdfExpression({
            propertyValueVariable: `${propertyValueVariable}.value`,
            ...otherParameters,
          });
        } else {
          // No shared type discriminator between the types, use the one we synthesized
          expression = `(${propertyValueVariable}.${syntheticTypeDiscriminatorPropertyName} === "${syntheticTypeDiscriminatorValue({ type, typeIndex })}") ? (${type.toRdfExpression({ propertyValueVariable: `${propertyValueVariable}.value`, ...otherParameters })}) : (${expression})`;
        }
      }
    });
    return expression;
  }
}
