import type { Maybe } from "purify-ts";
import { Type } from "./Type.js";

export class NativeType extends Type {
  readonly kind = "NativeType";
  readonly name: string;
  private readonly _importStatements: readonly string[];
  private readonly equalsFunction: string;
  private readonly fromRdfFunction: string;
  private readonly hashFunction: string;
  private readonly toRdfFunction: string;

  constructor({
    equalsFunction,
    fromRdfFunction,
    hashFunction,
    import_,
    name,
    toRdfFunction,
    ...superParameters
  }: {
    equalsFunction: Maybe<string>;
    fromRdfFunction: Maybe<string>;
    hashFunction: Maybe<string>;
    import_: Maybe<string>;
    name: string;
    toRdfFunction: Maybe<string>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.equalsFunction = equalsFunction.orDefault(`${name}.equals`);
    this.fromRdfFunction = fromRdfFunction.orDefault(`${name}.fromRdf`);
    this.hashFunction = hashFunction.orDefault(`${name}.hash`);
    this._importStatements = import_.toList();
    this.name = name;
    this.toRdfFunction = toRdfFunction.orDefault(`${name}.toRdf`);
  }

  get conversions(): readonly Type.Conversion[] {
    return [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: () => "true",
        sourceTypeName: this.name,
      },
    ];
  }

  override get importStatements(): readonly string[] {
    return this._importStatements;
  }

  override propertyEqualsFunction(): string {
    return this.equalsFunction;
  }

  override propertyFromRdfExpression({
    variables,
  }: {
    variables: { predicate: string; resource: string; resourceValues: string };
  }): string {
    return `${variables.resourceValues}.head().chain(_value => ${this.fromRdfFunction}(_value))`;
  }

  override propertyHashStatements({
    variables,
  }: {
    depth: number;
    variables: { hasher: string; value: string };
  }): readonly string[] {
    return [`${this.hashFunction}(${variables.value}, ${variables.hasher});`];
  }

  override propertyToRdfExpression({
    variables,
  }: {
    variables: {
      predicate: string;
      mutateGraph: string;
      resource: string;
      resourceSet: string;
      value: string;
    };
  }): string {
    return `${this.toRdfFunction}(${variables.value}, { mutateGraph: ${variables.mutateGraph}, resourceSet: ${variables.resourceSet} })`;
  }
}
