import { Maybe } from "purify-ts";
import { toRdf } from "rdf-literal";
import { Type } from "./Type.js";
import { rdfjsTermExpression } from "./rdfjsTermExpression.js";

export abstract class PrimitiveType<
  ValueT extends boolean | string | number,
> extends Type {
  readonly defaultValue: Maybe<ValueT>;
  readonly hasValue: Maybe<ValueT>;
  readonly in_: Maybe<readonly ValueT[]>;

  constructor({
    defaultValue,
    hasValue,
    in_,
    ...superParameters
  }: {
    defaultValue: Maybe<ValueT>;
    hasValue: Maybe<ValueT>;
    in_: Maybe<readonly ValueT[]>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.defaultValue = defaultValue;
    this.hasValue = hasValue;
    this.in_ = in_;
  }

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeName: this.name,
      },
    ];
    this.defaultValue.ifJust((defaultValue) => {
      conversions.push({
        conversionExpression: () => defaultValue.toString(),
        sourceTypeName: "undefined",
      });
    });
    return conversions;
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get importStatements(): readonly string[] {
    return [];
  }

  override propertyEqualsFunction(): string {
    return "purifyHelpers.Equatable.strictEquals";
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<Type["propertyFromRdfExpression"]>[0]): string {
    const chain: string[] = [`${variables.resourceValues}.head()`];
    this.hasValue.ifJust((hasValue) => {
      chain.push(
        `chain<rdfjsResource.Resource.ValueError, ${this.name}>(_term => _term.equals(${rdfjsTermExpression(toRdf(hasValue), this.configuration)}) ? purify.Either.of(_term) : purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: _term, expectedValueType: "${this.name}", focusResource: ${variables.resource}, predicate: ${variables.predicate})))`,
      );
    });
    this.defaultValue.ifJust((defaultValue) => {
      chain.push(
        `alt(purify.Either.of(new rdfjsResource.Resource.Value({ subject: ${variables.resource}, predicate: ${variables.predicate}, object: ${rdfjsTermExpression(toRdf(defaultValue), this.configuration)} })))`,
      );
    });
    chain.push(
      `chain(_value => ${this.fromRdfResourceValueExpression({
        variables: {
          resourceValue: "_value",
        },
      })})`,
    );
    return chain.join(".");
  }

  propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [`${variables.hasher}.update(${variables.value}.toString());`];
  }

  protected abstract fromRdfResourceValueExpression({
    variables,
  }: {
    variables: { resourceValue: string };
  }): string;
}
