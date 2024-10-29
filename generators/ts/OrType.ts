import { Maybe } from "purify-ts";
import { Memoize } from "typescript-memoize";
import { ComposedType } from "./ComposedType.js";
import type { Type } from "./Type.js";

export class OrType extends ComposedType {
  readonly kind = "Or";

  @Memoize()
  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return this.typesSharedDiscriminatorProperty.altLazy(() =>
      Maybe.of({
        name: "orTypeIndex",
        type: "string",
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

    return `(${this.types.map((type, typeIndex) => `{ orTypeIndex: ${typeIndex.toString()}, value: ${type.name} }`).join(" | ")})`;
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
          type: typeDiscriminatorProperty.type,
          values: typeDiscriminatorProperty.values.concat(),
        };
      } else if (
        typeDiscriminatorProperty.name ===
          typesSharedDiscriminatorProperty.name &&
        typeDiscriminatorProperty.type === typesSharedDiscriminatorProperty.type
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
${this.types.flatMap((type, typeIndex) =>
  this.typesSharedDiscriminatorProperty
    .map((typesSharedDiscriminatorProperty) => {
      // Types share a discriminator property already, use it
      return typesSharedDiscriminatorProperty.values.map(
        (value) => `
if (left.${typesSharedDiscriminatorProperty} === "${value}" && right.${typesSharedDiscriminatorProperty} === "${value}") {
  return ${type.equalsFunction()}(left, right);
}`,
      );
    })
    .orDefaultLazy(() => [
      // Types don't share a discriminator property, have to use the one we synthesized
      `if (left.orTypeIndex === "${typeIndex}" && right.orTypeIndex === "${typeIndex}") {
  return ${type.equalsFunction()}(left.value, right.value);
}`,
    ]),
)}).join("\n")}
  return purify.Left({ left, right, propertyName: "type", propertyValuesUnequal: { left: typeof left, right: typeof right, type: "BooleanEquals" }, type: "Property" });
}`;
  }

  sparqlGraphPatternExpressions({
    subjectVariable,
  }: Type.SparqlGraphPatternParameters): readonly string[] {
    return [
      `sparqlBuilder.GraphPattern.union(${this.types.map((type) => `sparqlBuilder.GraphPattern.group(${type.sparqlGraphPatternExpressions({ subjectVariable }).join(", ")})`)})`,
    ];
  }

  valueFromRdfExpression(parameters: Type.ValueFromRdfParameters): string {
    let expression = this.types[0].valueFromRdfExpression(parameters);
    for (const typeN of this.types.slice(1)) {
      expression = `${expression}.altLazy(() => ${typeN.valueFromRdfExpression(parameters)})`;
    }
    return expression;
  }

  valueToRdfExpression(_parameters: Type.ValueToRdfParameters): string {
    throw new Error("not implemented");
    // let expression = "";
    // for (const type of this.types.concat().reverse()) {
    //   if (expression.length === 0) {
    //     expression = type.valueToRdfExpression(parameters);
    //   } else {
    //     expression = `${type.valueInstanceOfExpression(parameters)} ? ${type.valueToRdfExpression(parameters)} : ${expression}`;
    //   }
    // }
    // return expression;
  }
}
