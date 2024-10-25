import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import {
  type InterfaceDeclarationStructure,
  type ModuleDeclarationStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type * as ast from "../../../ast";
import { IdentifierType } from "./IdentifierType.js";
import { Property } from "./Property.js";
import type { Type } from "./Type.js";
import * as _ObjectType from "./_ObjectType";

export class ObjectType implements Type {
  readonly ancestorObjectTypes: readonly ObjectType[];
  classDeclaration = _ObjectType.classDeclaration;
  fromRdfFunctionDeclaration = _ObjectType.fromRdfFunctionDeclaration;
  readonly identifierType: IdentifierType;
  interfaceDeclaration = _ObjectType.interfaceDeclaration;
  readonly kind = "Object";
  readonly properties: readonly Property[];
  readonly rdfType: Maybe<NamedNode>;
  readonly superObjectTypes: readonly ObjectType[];
  toRdfFunctionDeclaration = _ObjectType.toRdfFunctionDeclaration;
  private readonly inlineName: string;

  constructor({
    ancestorObjectTypes,
    identifierType,
    name,
    properties,
    rdfType,
    superObjectTypes,
  }: {
    ancestorObjectTypes: readonly ObjectType[];
    identifierType: IdentifierType;
    name: string;
    properties: readonly Property[];
    rdfType: Maybe<NamedNode>;
    superObjectTypes: readonly ObjectType[];
  }) {
    this.ancestorObjectTypes = ancestorObjectTypes;
    this.identifierType = identifierType;
    this.inlineName = name;
    this.properties = properties
      .concat()
      .sort((left, right) => left.name.localeCompare(right.name));
    const propertyNames = new Set<string>();
    for (const property of this.properties) {
      if (propertyNames.has(property.name)) {
        throw new Error(`duplicate property '${property.name}'`);
      }
    }
    this.rdfType = rdfType;
    this.superObjectTypes = superObjectTypes;
  }

  get moduleDeclaration(): OptionalKind<ModuleDeclarationStructure> {
    return {
      isExported: true,
      name: this.inlineName,
      statements: [this.constructorParametersInterfaceDeclaration],
    };
  }

  private get constructorParametersInterfaceDeclaration(): InterfaceDeclarationStructure {
    return {
      extends:
        this.superObjectTypes.length > 0
          ? [`${this.superObjectTypes[0].inlineName}.Parameters`]
          : undefined,
      isExported: true,
      kind: StructureKind.Interface,
      properties: this.properties.map(
        (property) => property.classConstructorParametersPropertySignature,
      ),
      name: "Parameters",
    };
  }

  static fromAstType(astType: ast.ObjectType): ObjectType {
    const identifierType = IdentifierType.fromNodeKinds(astType.nodeKinds);

    const properties: Property[] = astType.properties.map(
      Property.fromAstProperty,
    );

    if (astType.superObjectTypes.length === 0) {
      properties.push(
        new Property({
          inline: true,
          maxCount: Maybe.of(1),
          minCount: 1,
          name: "identifier",
          path: rdf.subject,
          type: identifierType,
        }),
      );
    }

    return new ObjectType({
      ancestorObjectTypes: astType.ancestorObjectTypes.map(
        ObjectType.fromAstType,
      ),
      identifierType,
      name: astType.name.tsName,
      properties: properties,
      rdfType: astType.rdfType,
      superObjectTypes: astType.superObjectTypes.map(ObjectType.fromAstType),
    });
  }

  equalsFunction(): string {
    return "purifyHelpers.Equatable.equals";
  }

  name(type: Type.NameType): string {
    switch (type) {
      case "extern":
        return this.identifierType.name();
      case "inline":
        return this.inlineName;
    }
  }

  rdfjsResourceType(options?: { mutable?: boolean }): {
    readonly mutable: boolean;
    readonly name: string;
    readonly named: boolean;
  } {
    if (this.superObjectTypes.length > 0) {
      return this.superObjectTypes[0].rdfjsResourceType(options);
    }

    return {
      mutable: !!options?.mutable,
      name: `rdfjsResource.${options?.mutable ? "Mutable" : ""}Resource${this.identifierType.isNamedNodeKind ? "<rdfjs.NamedNode>" : ""}`,
      named: this.identifierType.isNamedNodeKind,
    };
  }

  valueFromRdf({
    dataFactoryVariable,
    inline,
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return inline
      ? `${resourceValueVariable}.to${this.rdfjsResourceType().named ? "Named" : ""}Resource().chain(resource => ${this.inlineName}.fromRdf({ dataFactory: ${dataFactoryVariable}, resource }))`
      : `${resourceValueVariable}.to${this.rdfjsResourceType().named ? "Iri" : "Identifier"}()`;
  }

  valueToRdf({
    inline,
    mutateGraphVariable,
    resourceSetVariable,
    propertyValueVariable,
  }: Type.ValueToRdfParameters): string {
    return inline
      ? `${propertyValueVariable}.toRdf({ mutateGraph: ${mutateGraphVariable}, resourceSet: ${resourceSetVariable} }).identifier`
      : propertyValueVariable;
  }
}
