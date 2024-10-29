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
if (${type.valueInstanceOf({ propertyValueVariable: "left" })} && ${type.valueInstanceOf({ propertyValueVariable: "right" })}) {
  return ${type.equalsFunction()}(left, right);
}`,
  )
  .join("\n")}
  return purify.Left({ left, right, propertyName: "type", propertyValuesUnequal: { left: typeof left, right: typeof right, type: "BooleanEquals" }, type: "Property" });
}`;
  }

  override sparqlGraphPatterns({
    subjectVariable,
  }: Type.SparqlGraphPatternParameters): readonly string[] {
    return [
      `sparqlBuilder.GraphPattern.union(${this.types.map((type) => `sparqlBuilder.GraphPattern.group(${type.sparqlGraphPatterns({ subjectVariable }).join(", ")})`)})`,
    ];
  }

  override valueFromRdf(_parameters: Type.ValueFromRdfParameters): string {
    throw new Error("Method not implemented.");
  }

  override valueInstanceOf(parameters: Type.ValueInstanceOfParameters): string {
    return `(${this.types.map((type) => type.valueInstanceOf(parameters)).join(" || ")})`;
  }

  override valueToRdf(_parameters: Type.ValueToRdfParameters): string {
    throw new Error("Method not implemented.");
  }
}
