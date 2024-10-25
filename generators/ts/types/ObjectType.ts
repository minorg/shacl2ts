import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import {
  type ModuleDeclarationStructure,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type * as ast from "../../../ast";
import type { TsGenerator } from "../TsGenerator.js";
import { shorthandProperty } from "../shorthandProperty.js";
import { IdentifierType } from "./IdentifierType.js";
import { Property } from "./Property.js";
import type { Type } from "./Type.js";
import {
  classConstructorParametersInterfaceDeclaration,
  classDeclaration,
  equalsFunctionDeclaration,
  fromRdfFunctionDeclaration,
  interfaceDeclaration,
  sparqlGraphPatternsClassDeclaration,
  toRdfFunctionDeclaration,
} from "./_ObjectType";

export class ObjectType implements Type {
  readonly ancestorObjectTypes: readonly ObjectType[];
  readonly classQualifiedName: string;
  readonly identifierType: IdentifierType;
  readonly interfaceQualifiedName: string;
  readonly kind = "Object";
  readonly moduleQualifiedName: string;
  readonly properties: readonly Property[];
  readonly rdfType: Maybe<NamedNode>;
  readonly sparqlGraphPatternsClassQualifiedName: string;
  readonly superObjectTypes: readonly ObjectType[];
  protected readonly classUnqualifiedName: string = "Class";
  protected readonly interfaceUnqualifiedName: string = "Interface";
  protected readonly sparqlGraphPatternsClassUnqualifiedName: string =
    "SparqlGraphPatterns";
  private readonly astName: string;

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
    this.moduleQualifiedName = astName;
    this.classQualifiedName = `${this.moduleQualifiedName}.${this.classUnqualifiedName}`;
    this.interfaceQualifiedName = `${this.moduleQualifiedName}.${this.interfaceUnqualifiedName}`;
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

  declaration(features: Set<TsGenerator.Feature>): ModuleDeclarationStructure {
    const statements: StatementStructures[] = [];

    if (features.has("interface")) {
      statements.push(interfaceDeclaration.bind(this)());
    }

    if (features.has("class")) {
      const classDeclaration_ = classDeclaration.bind(this)(features);
      statements.push(classDeclaration_);

      statements.push({
        isExported: true,
        kind: StructureKind.Module,
        name: classDeclaration_.name!,
        statements: [
          classConstructorParametersInterfaceDeclaration.bind(this)(),
        ],
      });
    }

    if (features.has("equals")) {
      statements.push(equalsFunctionDeclaration.bind(this)());
    }

    if (features.has("fromRdf")) {
      statements.push(fromRdfFunctionDeclaration.bind(this)());
    }

    if (features.has("sparql-graph-patterns")) {
      if (this.superObjectTypes.length > 1) {
        throw new RangeError(
          `object type '${this.astName}' has multiple super object types, can't use with SPARQL graph patterns`,
        );
      }

      statements.push(sparqlGraphPatternsClassDeclaration.bind(this)());
    }

    if (features.has("toRdf")) {
      statements.push(toRdfFunctionDeclaration.bind(this)());
    }

    return {
      isExported: true,
      kind: StructureKind.Module,
      name: this.astName,
      statements: statements,
    };
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
