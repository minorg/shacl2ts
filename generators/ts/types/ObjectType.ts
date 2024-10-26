import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type * as ast from "../../../ast";
import { shorthandProperty } from "../shorthandProperty.js";
import { IdentifierType } from "./IdentifierType.js";
import { Property } from "./Property.js";
import type { Type } from "./Type.js";
import { interfaceDeclaration, moduleDeclaration } from "./_ObjectType";

export class ObjectType implements Type {
  readonly ancestorObjectTypes: readonly ObjectType[];
  readonly astName: string;
  readonly classQualifiedName: string;
  readonly identifierType: IdentifierType;
  interfaceDeclaration = interfaceDeclaration;
  readonly interfaceQualifiedName: string;
  readonly kind = "Object";
  moduleDeclaration = moduleDeclaration;
  readonly moduleQualifiedName: string;
  readonly properties: readonly Property[];
  readonly rdfType: Maybe<NamedNode>;
  readonly sparqlGraphPatternsClassQualifiedName: string;
  readonly superObjectTypes: readonly ObjectType[];
  protected readonly classUnqualifiedName: string = "Class";
  protected readonly interfaceUnqualifiedName: string;
  protected readonly sparqlGraphPatternsClassUnqualifiedName: string =
    "SparqlGraphPatterns";

  constructor({
    ancestorObjectTypes,
    astName,
    identifierType,
    properties,
    rdfType,
    superObjectTypes,
  }: {
    ancestorObjectTypes: readonly ObjectType[];
    astName: string;
    identifierType: IdentifierType;
    properties: readonly Property[];
    rdfType: Maybe<NamedNode>;
    superObjectTypes: readonly ObjectType[];
  }) {
    this.ancestorObjectTypes = ancestorObjectTypes;
    this.identifierType = identifierType;
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

    this.astName = astName;
    this.interfaceUnqualifiedName = astName;
    this.moduleQualifiedName = astName;
    this.classQualifiedName = `${this.moduleQualifiedName}.${this.classUnqualifiedName}`;
    this.interfaceQualifiedName = this.interfaceUnqualifiedName;
    this.sparqlGraphPatternsClassQualifiedName = `${astName}.${this.sparqlGraphPatternsClassUnqualifiedName}`;
  }

  get name(): string {
    return this.interfaceQualifiedName;
  }

  static fromAstType(astType: ast.ObjectType): ObjectType {
    const identifierType = IdentifierType.fromNodeKinds(astType.nodeKinds);

    const properties: Property[] = astType.properties.map(
      Property.fromAstProperty,
    );

    if (astType.superObjectTypes.length === 0) {
      properties.push(
        new Property({
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
      astName: astType.name.tsName,
      identifierType,
      properties: properties,
      rdfType: astType.rdfType,
      superObjectTypes: astType.superObjectTypes.map(ObjectType.fromAstType),
    });
  }

  equalsFunction(): string {
    return `${this.moduleQualifiedName}.equals`;
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
    if (this.superObjectTypes.length > 1) {
      throw new RangeError(
        `object type '${this.astName}' has multiple super object types`,
      );
    }
  }
}
