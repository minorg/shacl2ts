import type { NamedNode } from "@rdfjs/types";
import { camelCase } from "change-case";
import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import {
  type ClassDeclarationStructure,
  type InterfaceDeclarationStructure,
  type ModuleDeclarationStructure,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import { Memoize } from "typescript-memoize";
import type {
  MintingStrategy,
  TsObjectDeclarationType,
} from "../../enums/index.js";
import { DeclaredType } from "./DeclaredType.js";
import type { IdentifierType } from "./IdentifierType.js";
import { Import } from "./Import.js";
import { Type } from "./Type.js";
import * as _ObjectType from "./_ObjectType/index.js";
import {
  IdentifierProperty,
  TypeDiscriminatorProperty,
} from "./_ObjectType/index.js";

export class ObjectType extends DeclaredType {
  readonly abstract: boolean;
  readonly declarationType: TsObjectDeclarationType;
  readonly extern: boolean;
  readonly fromRdfType: Maybe<NamedNode>;
  readonly kind = "ObjectType";
  readonly mintingStrategy: Maybe<MintingStrategy>;
  readonly toRdfTypes: readonly NamedNode[];
  private readonly import_: Maybe<string>;
  private readonly lazyAncestorObjectTypes: () => readonly ObjectType[];
  private readonly lazyDescendantObjectTypes: () => readonly ObjectType[];
  private readonly lazyParentObjectTypes: () => readonly ObjectType[];
  private readonly lazyProperties: () => readonly ObjectType.Property[];

  constructor({
    abstract,
    declarationType,
    extern,
    fromRdfType,
    lazyAncestorObjectTypes,
    lazyDescendantObjectTypes,
    lazyParentObjectTypes,
    lazyProperties,
    import_,
    mintingStrategy,
    toRdfTypes,
    ...superParameters
  }: {
    abstract: boolean;
    declarationType: TsObjectDeclarationType;
    extern: boolean;
    fromRdfType: Maybe<NamedNode>;
    import_: Maybe<string>;
    lazyAncestorObjectTypes: () => readonly ObjectType[];
    lazyDescendantObjectTypes: () => readonly ObjectType[];
    lazyParentObjectTypes: () => readonly ObjectType[];
    lazyProperties: () => readonly ObjectType.Property[];
    mintingStrategy: Maybe<MintingStrategy>;
    toRdfTypes: readonly NamedNode[];
  } & ConstructorParameters<typeof DeclaredType>[0]) {
    super(superParameters);
    this.abstract = abstract;
    this.declarationType = declarationType;
    this.extern = extern;
    this.fromRdfType = fromRdfType;
    this.import_ = import_;
    // Lazily initialize some members in getters to avoid recursive construction
    this.lazyAncestorObjectTypes = lazyAncestorObjectTypes;
    this.lazyDescendantObjectTypes = lazyDescendantObjectTypes;
    this.lazyParentObjectTypes = lazyParentObjectTypes;
    this.lazyProperties = lazyProperties;
    this.mintingStrategy = mintingStrategy;
    this.toRdfTypes = toRdfTypes;
  }

  get _discriminatorProperty(): Type.DiscriminatorProperty {
    const discriminatorProperty = this.properties.find(
      (property) => property instanceof ObjectType.TypeDiscriminatorProperty,
    );
    invariant(discriminatorProperty);
    return {
      name: discriminatorProperty.name,
      values: [this.discriminatorValue],
    };
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

  get declarationImports(): readonly Import[] {
    if (this.extern) {
      return [];
    }
    const imports: Import[] = this.properties.flatMap(
      (property) => property.declarationImports,
    );
    if (this.features.has("equals")) {
      imports.push(Import.PURIFY_HELPERS);
    }
    if (this.features.has("fromRdf") || this.features.has("toRdf")) {
      imports.push(Import.PURIFY);
      imports.push(Import.RDFJS_RESOURCE);
    }
    if (this.features.has("sparql-graph-patterns")) {
      imports.push(Import.SPARQL_BUILDER);
    }
    return imports;
  }

  get declarations() {
    const declarations: (
      | ClassDeclarationStructure
      | InterfaceDeclarationStructure
      | ModuleDeclarationStructure
    )[] = [
      ..._ObjectType.classDeclaration.bind(this)().toList(),
      ..._ObjectType.interfaceDeclaration.bind(this)().toList(),
    ];

    const moduleStatements: StatementStructures[] = [
      ..._ObjectType.equalsFunctionDeclaration.bind(this)().toList(),
      ..._ObjectType.fromRdfFunctionDeclaration.bind(this)().toList(),
      ..._ObjectType.hashFunctionDeclaration.bind(this)().toList(),
      ..._ObjectType.sparqlGraphPatternsClassDeclaration.bind(this)().toList(),
      ..._ObjectType.toJsonFunctionDeclaration.bind(this)().toList(),
      ..._ObjectType.toRdfFunctionDeclaration.bind(this)().toList(),
    ];

    if (moduleStatements.length > 0) {
      declarations.push({
        isExported: this.export,
        kind: StructureKind.Module,
        name: this.name,
        statements: moduleStatements,
      });
    }

    return declarations;
  }

  @Memoize()
  get descendantObjectTypes(): readonly ObjectType[] {
    return this.lazyDescendantObjectTypes();
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.of(this._discriminatorProperty);
  }

  get discriminatorValue(): string {
    return this.name;
  }

  @Memoize()
  get fromRdfFunctionName(): string {
    if (this.declarationType === "class" && this.abstract) {
      return "interfaceFromRdf";
    }
    return "fromRdf";
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

  @Memoize()
  get identifierProperty(): ObjectType.IdentifierProperty {
    const identifierProperty = this.properties.find(
      (property) => property instanceof ObjectType.IdentifierProperty,
    );
    invariant(identifierProperty);
    return identifierProperty;
  }

  @Memoize()
  get identifierType(): IdentifierType {
    return this.identifierProperty.type;
  }

  get jsonName(): string {
    return `ReturnType<${this.name}["toJson"]>`;
  }

  @Memoize()
  get ownProperties(): readonly ObjectType.Property[] {
    if (this.parentObjectTypes.length === 0) {
      // Consider that a root of the object type hierarchy "owns" the identifier and type discriminator properties
      // for all of its subtypes in the hierarchy.
      invariant(this.properties.length >= 2, this.name);
      return this.properties;
    }
    return this.properties.filter(
      (property) =>
        !(property instanceof IdentifierProperty) &&
        !(property instanceof TypeDiscriminatorProperty),
    );
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

  override get useImports(): readonly Import[] {
    return this.import_.toList();
  }

  protected get thisVariable(): string {
    switch (this.declarationType) {
      case "class":
        return "this";
      case "interface":
        return `_${camelCase(this.name)}`;
      default:
        throw new RangeError(this.declarationType);
    }
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
    switch (this.declarationType) {
      case "class":
        return "purifyHelpers.Equatable.equals";
      case "interface":
        return `${this.name}.equals`;
    }
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<Type["propertyFromRdfExpression"]>[0]): string {
    return `${variables.resourceValues}.head().chain(value => value.to${this.rdfjsResourceType().named ? "Named" : ""}Resource()).chain(_resource => ${this.name}.${this.fromRdfFunctionName}({ ...${variables.context}, resource: _resource }))`;
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    switch (this.declarationType) {
      case "class":
        return [`${variables.value}.hash(${variables.hasher});`];
      case "interface":
        return [
          `${this.name}.${this.hashFunctionName}(${variables.value}, ${variables.hasher});`,
        ];
    }
  }

  override propertyToJsonExpression({
    variables,
  }: Parameters<Type["propertyToJsonExpression"]>[0]): string {
    switch (this.declarationType) {
      case "class":
        return `${variables.value}.toJson()`;
      case "interface":
        return `${this.name}.toJson(${variables.value})`;
    }
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<Type["propertyToRdfExpression"]>[0]): string {
    switch (this.declarationType) {
      case "class":
        return `${variables.value}.toRdf({ mutateGraph: ${variables.mutateGraph}, resourceSet: ${variables.resourceSet} })`;
      case "interface":
        return `${this.name}.toRdf(${variables.value}, { mutateGraph: ${variables.mutateGraph}, resourceSet: ${variables.resourceSet} })`;
    }
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
