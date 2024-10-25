import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import {
  type ModuleDeclarationStructure,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type * as ast from "../../../ast";
import type { TsGenerator } from "../TsGenerator";
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
  readonly identifierType: IdentifierType;
  readonly kind = "Object";
  readonly properties: readonly Property[];
  readonly rdfType: Maybe<NamedNode>;
  readonly superObjectTypes: readonly ObjectType[];
  private readonly astName: string;

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
    this.astName = name;
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
          `object type '${this.name("ast")}' has multiple super object types, can't use with SPARQL graph patterns`,
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
      name: this.name("module"),
      statements: statements,
    };
  }

  equalsFunction(): string {
    return `${this.name("module")}.equals`;
  }

  name(type: Type.NameType | "ast" | "class" | "interface" | "module"): string {
    switch (type) {
      case "ast":
        return this.astName;
      case "class":
        return `${this.astName}.Class`;
      case "extern":
        return this.identifierType.name();
      case "inline":
        return this.name("interface");
      case "interface":
        return `${this.astName}.Interface`;
      case "module":
        return this.astName;
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

  sparqlGraphPatterns({
    dataFactoryVariable,
    inline,
    subjectVariable,
  }: Type.SparqlGraphPatternParameters): readonly string[] {
    if (!inline) {
      // Don't add any additional graph patterns for terms
      return []; // Don't
    }
  }

  valueFromRdf({
    dataFactoryVariable,
    inline,
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return inline
      ? `${resourceValueVariable}.to${this.rdfjsResourceType().named ? "Named" : ""}Resource().chain(resource => ${this.astName}.fromRdf({ dataFactory: ${dataFactoryVariable}, resource }))`
      : `${resourceValueVariable}.to${this.rdfjsResourceType().named ? "Iri" : "Identifier"}()`;
  }

  valueToRdf({
    inline,
    mutateGraphVariable,
    resourceSetVariable,
    propertyValueVariable,
  }: Type.ValueToRdfParameters): string {
    return inline
      ? `${this.name("module")}.toRdf(${propertyValueVariable}, { mutateGraph: ${mutateGraphVariable}, resourceSet: ${resourceSetVariable} }).identifier`
      : propertyValueVariable;
  }

  protected ensureAtMostOneSuperObjectType() {
    if (this.superObjectTypes.length > 1) {
      throw new RangeError(
        `object type '${this.name("ast")}' has multiple super object types`,
      );
    }
  }
}
