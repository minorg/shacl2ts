import type { NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import { Memoize } from "typescript-memoize";
import type { IdentifierType } from "./IdentifierType.js";
import { Type } from "./Type.js";
import * as _ObjectType from "./_ObjectType";
import { shorthandProperty } from "./shorthandProperty.js";

export class ObjectType extends Type {
  readonly astName: string;
  readonly classQualifiedName: string;
  readonly identifierType: IdentifierType;
  interfaceDeclaration = _ObjectType.interfaceDeclaration;
  readonly interfaceQualifiedName: string;
  readonly kind = "Object";
  moduleDeclaration = _ObjectType.moduleDeclaration;
  readonly moduleQualifiedName: string;
  readonly rdfType: Maybe<NamedNode>;
  readonly sparqlGraphPatternsClassQualifiedName: string;
  protected readonly classUnqualifiedName: string = "Class";
  protected readonly interfaceUnqualifiedName: string;
  protected readonly sparqlGraphPatternsClassUnqualifiedName: string =
    "SparqlGraphPatterns";
  private readonly lazyAncestorObjectTypes: () => readonly ObjectType[];
  private readonly lazyDescendantObjectTypes: () => readonly ObjectType[];
  private readonly lazyParentObjectTypes: () => readonly ObjectType[];
  private readonly lazyProperties: () => readonly ObjectType.Property[];

  constructor({
    astName,
    identifierType,
    lazyAncestorObjectTypes,
    lazyDescendantObjectTypes,
    lazyParentObjectTypes,
    lazyProperties,
    rdfType,
    ...superParameters
  }: {
    astName: string;
    identifierType: IdentifierType;
    lazyAncestorObjectTypes: () => readonly ObjectType[];
    lazyDescendantObjectTypes: () => readonly ObjectType[];
    lazyParentObjectTypes: () => readonly ObjectType[];
    lazyProperties: () => readonly ObjectType.Property[];
    rdfType: Maybe<NamedNode>;
  } & Type.ConstructorParameters) {
    super(superParameters);
    // Lazily initialize some members in getters to avoid recursive construction
    this.lazyAncestorObjectTypes = lazyAncestorObjectTypes;
    this.lazyDescendantObjectTypes = lazyDescendantObjectTypes;
    this.lazyParentObjectTypes = lazyParentObjectTypes;
    this.lazyProperties = lazyProperties;
    this.identifierType = identifierType;
    this.rdfType = rdfType;

    this.astName = astName;
    this.interfaceUnqualifiedName = astName;
    this.moduleQualifiedName = astName;
    this.classQualifiedName = `${this.moduleQualifiedName}.${this.classUnqualifiedName}`;
    this.interfaceQualifiedName = this.interfaceUnqualifiedName;
    this.sparqlGraphPatternsClassQualifiedName = `${astName}.${this.sparqlGraphPatternsClassUnqualifiedName}`;
  }

  @Memoize()
  get ancestorObjectTypes(): readonly ObjectType[] {
    return this.lazyAncestorObjectTypes();
  }

  @Memoize()
  get descendantObjectTypes(): readonly ObjectType[] {
    return this.lazyDescendantObjectTypes();
  }

  get name(): string {
    return this.interfaceQualifiedName;
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

  get typeDiscriminatorProperty(): Maybe<{
    readonly name: string;
    readonly type: {
      readonly name: string;
    };
    readonly value: string;
  }> {
    return this.configuration.objectTypeDiscriminatorPropertyName.map(
      (typeDiscriminatorPropertyName) => ({
        name: typeDiscriminatorPropertyName,
        type: {
          name: [
            ...new Set(
              [this.name].concat(
                this.descendantObjectTypes.map((objectType) => objectType.name),
              ),
            ),
          ]
            .sort()
            .map((name) => `"${name}"`)
            .join("|"),
        },
        value: this.name,
      }),
    );
  }

  equalsFunction(): string {
    return `${this.moduleQualifiedName}.equals`;
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

  sparqlGraphPatterns({
    dataFactoryVariable,
    subjectVariable,
  }: Type.SparqlGraphPatternParameters): readonly string[] {
    return [
      `...new ${this.moduleQualifiedName}.SparqlGraphPatterns({ ${shorthandProperty("dataFactory", dataFactoryVariable)}, ${shorthandProperty("subject", subjectVariable)} })`,
    ];
  }

  valueFromRdf({
    dataFactoryVariable,
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return `${resourceValueVariable}.to${this.rdfjsResourceType().named ? "Named" : ""}Resource().chain(resource => ${this.moduleQualifiedName}.fromRdf({ ${shorthandProperty("dataFactory", dataFactoryVariable)}, resource }))`;
  }

  valueToRdf({
    mutateGraphVariable,
    resourceSetVariable,
    propertyValueVariable,
  }: Type.ValueToRdfParameters): string {
    return `${this.moduleQualifiedName}.toRdf(${propertyValueVariable}, { mutateGraph: ${mutateGraphVariable}, resourceSet: ${resourceSetVariable} }).identifier`;
  }

  protected ensureAtMostOneSuperObjectType() {
    if (this.parentObjectTypes.length > 1) {
      throw new RangeError(
        `object type '${this.astName}' has multiple super object types`,
      );
    }
  }
}

export namespace ObjectType {
  export const Property = _ObjectType.Property;
  export type Property = _ObjectType.Property;
}
