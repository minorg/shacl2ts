import type { NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { Memoize } from "typescript-memoize";
import { MintingStrategy } from "../../ast";
import type { IdentifierType } from "./IdentifierType.js";
import { Type } from "./Type.js";
import * as _ObjectType from "./_ObjectType";

export class ObjectType extends Type {
  readonly abstract: boolean;
  classDeclaration = _ObjectType.classDeclaration;
  equalsFunctionDeclaration = _ObjectType.equalsFunctionDeclaration;
  readonly export_: boolean;
  fromRdfFunctionDeclaration = _ObjectType.fromRdfFunctionDeclaration;
  hashFunctionDeclaration = _ObjectType.hashFunctionDeclaration;
  readonly identifierType: IdentifierType;
  interfaceDeclaration = _ObjectType.interfaceDeclaration;
  readonly kind = "ObjectType";
  readonly mintingStrategy: Maybe<MintingStrategy>;
  readonly name: string;
  readonly rdfType: Maybe<NamedNode>;
  sparqlGraphPatternsClassDeclaration =
    _ObjectType.sparqlGraphPatternsClassDeclaration;
  toRdfFunctionDeclaration = _ObjectType.toRdfFunctionDeclaration;
  private readonly lazyAncestorObjectTypes: () => readonly ObjectType[];
  private readonly lazyDescendantObjectTypes: () => readonly ObjectType[];
  private readonly lazyParentObjectTypes: () => readonly ObjectType[];
  private readonly lazyProperties: () => readonly ObjectType.Property[];

  constructor({
    abstract,
    identifierType,
    export_,
    lazyAncestorObjectTypes,
    lazyDescendantObjectTypes,
    lazyParentObjectTypes,
    lazyProperties,
    mintingStrategy,
    name,
    rdfType,
    ...superParameters
  }: {
    abstract: boolean;
    export_: boolean;
    identifierType: IdentifierType;
    lazyAncestorObjectTypes: () => readonly ObjectType[];
    lazyDescendantObjectTypes: () => readonly ObjectType[];
    lazyParentObjectTypes: () => readonly ObjectType[];
    lazyProperties: () => readonly ObjectType.Property[];
    mintingStrategy: Maybe<MintingStrategy>;
    name: string;
    rdfType: Maybe<NamedNode>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.abstract = abstract;
    this.export_ = export_;
    // Lazily initialize some members in getters to avoid recursive construction
    this.lazyAncestorObjectTypes = lazyAncestorObjectTypes;
    this.lazyDescendantObjectTypes = lazyDescendantObjectTypes;
    this.lazyParentObjectTypes = lazyParentObjectTypes;
    this.lazyProperties = lazyProperties;
    this.identifierType = identifierType;
    this.mintingStrategy = mintingStrategy;
    this.rdfType = rdfType;
    this.name = name;
  }

  @Memoize()
  get ancestorObjectTypes(): readonly ObjectType[] {
    return this.lazyAncestorObjectTypes();
  }

  override get conversions(): readonly Type.Conversion[] {
    return [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) =>
          `typeof ${value} === "object" && ${value} instanceof ${this.name}`,
        sourceTypeName: this.name,
      },
    ];
  }

  @Memoize()
  get descendantObjectTypes(): readonly ObjectType[] {
    return this.lazyDescendantObjectTypes();
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.of({
      name: this.configuration.objectTypeDiscriminatorPropertyName,
      type: "string" as const,
      values: [this.discriminatorValue],
    });
  }

  get discriminatorValue(): string {
    return this.name;
  }

  @Memoize()
  get hashFunctionName(): string {
    if (
      this.lazyDescendantObjectTypes().length > 0 ||
      this.ancestorObjectTypes.length > 0
    ) {
      return `hash${this.name}`;
    }
    return "hash";
  }

  override get importStatements(): readonly string[] {
    const importStatements = this.properties.flatMap(
      (property) => property.importStatements,
    );
    this.mintingStrategy.ifJust((mintingStrategy) => {
      switch (mintingStrategy) {
        case MintingStrategy.SHA256:
          importStatements.push('import { sha256 } from "js-sha256";');
          break;
        case MintingStrategy.UUIDv4:
          importStatements.push('import * as uuid from "uuid";');
          break;
      }
    });
    return importStatements;
  }

  @Memoize()
  get parentObjectTypes(): readonly ObjectType[] {
    return this.lazyParentObjectTypes();
  }

  @Memoize()
  get properties(): readonly ObjectType.Property[] {
    const properties = this.lazyProperties()
      .concat()
      .sort((left, right) => left.name.localeCompare(right.name));
    const propertyNames = new Set<string>();
    for (const property of properties) {
      if (propertyNames.has(property.name)) {
        throw new Error(`duplicate property '${property.name}'`);
      }
    }
    return properties;
  }

  override chainSparqlGraphPatternExpression({
    variables,
  }: Parameters<
    Type["chainSparqlGraphPatternExpression"]
  >[0]): Maybe<Type.SparqlGraphPatternsExpression> {
    return Maybe.of(
      new Type.SparqlGraphPatternsExpression(
        `new ${this.name}.SparqlGraphPatterns(${variables.subject})`,
      ),
    );
  }

  override equalsFunction(): string {
    switch (this.configuration.objectTypeDeclarationType) {
      case "class":
        return "purifyHelpers.Equatable.equals";
      case "interface":
        return `${this.name}.equals`;
    }
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<Type["fromRdfResourceValueExpression"]>[0]): string {
    return `${variables.resourceValue}.to${this.rdfjsResourceType().named ? "Named" : ""}Resource().chain(resource => ${this.name}.fromRdf(resource))`;
  }

  override hashStatements({
    variables,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `${this.name}.${this.hashFunctionName}(${variables.value}, ${variables.hasher});`,
    ];
  }

  rdfjsResourceType(options?: { mutable?: boolean }): {
    readonly mutable: boolean;
    readonly name: string;
    readonly named: boolean;
  } {
    if (this.parentObjectTypes.length > 0) {
      return this.parentObjectTypes[0].rdfjsResourceType(options);
    }

    return {
      mutable: !!options?.mutable,
      name: `rdfjsResource.${options?.mutable ? "Mutable" : ""}Resource${this.identifierType.isNamedNodeKind ? "<rdfjs.NamedNode>" : ""}`,
      named: this.identifierType.isNamedNodeKind,
    };
  }

  override toRdfExpression({
    variables,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    switch (this.configuration.objectTypeDeclarationType) {
      case "class":
        return `${variables.value}.toRdf({ mutateGraph: ${variables.mutateGraph}, resourceSet: ${variables.resourceSet} }).identifier`;
      case "interface":
        return `${this.name}.toRdf(${variables.value}, { mutateGraph: ${variables.mutateGraph}, resourceSet: ${variables.resourceSet} }).identifier`;
    }
  }

  protected ensureAtMostOneSuperObjectType() {
    if (this.parentObjectTypes.length > 1) {
      throw new RangeError(
        `object type '${this.name}' has multiple super object types`,
      );
    }
  }
}

export namespace ObjectType {
  export const IdentifierProperty = _ObjectType.IdentifierProperty;
  export type IdentifierProperty = _ObjectType.IdentifierProperty;
  export const Property = _ObjectType.Property;
  export type Property = _ObjectType.Property<any>;
  export const ShaclProperty = _ObjectType.ShaclProperty;
  export type ShaclProperty = _ObjectType.ShaclProperty;
  export const TypeDiscriminatorProperty =
    _ObjectType.TypeDiscriminatorProperty;
  export type TypeDiscriminatorProperty = _ObjectType.TypeDiscriminatorProperty;
}
