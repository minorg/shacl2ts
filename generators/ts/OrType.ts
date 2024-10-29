import { ComposedType } from "./ComposedType";
import type { Type } from "./Type";

export class OrType extends ComposedType {
  readonly kind = "Or";
  protected readonly nameSeparator = "|";

  equalsFunction(): string {
    return `
(left: ${this.name}, right: ${this.name}) => {
${this.types
  .map(
    (type) => `
if (${type.valueInstanceOfExpression({ propertyValueVariable: "left" })} && ${type.valueInstanceOfExpression({ propertyValueVariable: "right" })}) {
  return ${type.equalsFunction()}(left, right);
}`,
  )
  .join("\n")}
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

  valueInstanceOfExpression(
    parameters: Type.ValueInstanceOfParameters,
  ): string {
    return `(${this.types.map((type) => type.valueInstanceOfExpression(parameters)).join(" || ")})`;
  }

  valueToRdfExpression(parameters: Type.ValueToRdfParameters): string {
    let expression = "";
    for (const type of this.types.concat().reverse()) {
      if (expression.length === 0) {
        expression = type.valueToRdfExpression(parameters);
      } else {
        expression = `${type.valueInstanceOfExpression(parameters)} ? ${type.valueToRdfExpression(parameters)} : ${expression}`;
      }
    }
    return expression;
  }
}
