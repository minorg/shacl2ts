import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type InterfaceDeclarationStructure,
  type MethodDeclarationStructure,
  type ModuleDeclarationStructure,
  type OptionalKind,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type * as ast from "../../../ast";
import { IdentifierType } from "./IdentifierType.js";
import { Property } from "./Property.js";
import type { Type } from "./Type.js";

export class ObjectType implements Type {
  readonly ancestorObjectTypes: readonly ObjectType[];
  readonly identifierType: IdentifierType;
  readonly kind = "Object";
  readonly properties: readonly Property[];
  readonly superObjectTypes: readonly ObjectType[];
  private readonly _name: string;
  private readonly rdfType: Maybe<NamedNode>;

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
    this._name = name;
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

  get classDeclaration(): OptionalKind<ClassDeclarationStructure> {
    return {
      ctors:
        this.properties.length > 0 ? [this.constructorDeclaration] : undefined,
      extends:
        this.superObjectTypes.length > 0
          ? this.superObjectTypes[0]._name
          : undefined,
      isExported: true,
      methods: [
        this.equalsMethodDeclaration,
        this.fromRdfMethodDeclaration,
        this.toRdfMethodDeclaration,
      ],
      name: this._name,
      properties: this.properties.map(
        (property) => property.classPropertyDeclaration,
      ),
    };
  }

  get interfaceDeclaration(): OptionalKind<InterfaceDeclarationStructure> {
    return {
      extends: this.superObjectTypes.map(
        (superObjectType) => superObjectType._name,
      ),
      isExported: true,
      name: this._name,
      properties: this.properties.map(
        (property) => property.interfacePropertySignature,
      ),
    };
  }

  get moduleDeclaration(): OptionalKind<ModuleDeclarationStructure> {
    return {
      isExported: true,
      name: this._name,
      statements: [this.constructorParametersInterfaceDeclaration],
    };
  }

  private get constructorDeclaration(): OptionalKind<ConstructorDeclarationStructure> {
    const statements: (string | StatementStructures)[] = [];
    if (this.superObjectTypes.length > 0) {
      statements.push("super(parameters);");
    }
    for (const property of this.properties) {
      statements.push(
        `this.${property.name} = ${property.classConstructorInitializer(`parameters.${property.name}`)};`,
      );
    }

    return {
      parameters: [
        {
          name: "parameters",
          type: `${this._name}.Parameters`,
        },
      ],
      statements,
    };
  }

  private get constructorParametersInterfaceDeclaration(): InterfaceDeclarationStructure {
    return {
      extends:
        this.superObjectTypes.length > 0
          ? [`${this.superObjectTypes[0]._name}.Parameters`]
          : undefined,
      isExported: true,
      kind: StructureKind.Interface,
      properties: this.properties.map(
        (property) => property.classConstructorParametersPropertySignature,
      ),
      name: "Parameters",
    };
  }

  private get equalsMethodDeclaration(): OptionalKind<MethodDeclarationStructure> {
    let expression = `purifyHelpers.Equatable.objectEquals(this, other, { ${this.properties
      .map((property) => `${property.name}: ${property.equalsFunction}`)
      .join()} })`;
    if (this.superObjectTypes.length > 0) {
      expression = `super.equals(other).chain(() => ${expression})`;
    }

    return {
      hasOverrideKeyword: this.superObjectTypes.length > 0,
      name: "equals",
      parameters: [
        {
          name: "other",
          type: this._name,
        },
      ],
      statements: [`return ${expression};`],
      returnType: "purifyHelpers.Equatable.EqualsResult",
    };
  }

  private get fromRdfMethodDeclaration(): OptionalKind<MethodDeclarationStructure> {
    const dataFactoryVariable = "dataFactory";
    const resourceVariable = "resource";

    let statements: string[] = [];
    this.rdfType.ifJust((rdfType) => {
      statements.push(
        `if (!${resourceVariable}.isInstanceOf(${dataFactoryVariable}.namedNode("${rdfType.value}"))) { return purify.Left(new rdfjsResource.Resource.ValueError({ focusResource: ${resourceVariable}, message: \`\${rdfjsResource.Resource.Identifier.toString(${resourceVariable}.identifier)} has unexpected RDF type\`, predicate: ${dataFactoryVariable}.namedNode("${rdfType.value}") })); }`,
      );
    });

    for (const property of this.properties) {
      if (property.name === "identifier") {
        statements.push(`const identifier = ${resourceVariable}.identifier`);
      } else {
        statements.push(
          property.valueFromRdf({ dataFactoryVariable, resourceVariable }),
        );
      }
    }
    statements.push(
      `return purify.Either.of(new ${this._name}({ ${this.properties
        .map((property) => property.name)
        .concat(
          this.ancestorObjectTypes.flatMap((ancestorObjectType) =>
            ancestorObjectType.properties.map(
              (property) => `${property.name}: _super.${property.name}`,
            ),
          ),
        )
        .sort()
        .join(", ")} }))`,
    );

    if (this.superObjectTypes.length > 0) {
      statements = [
        `return ${this.superObjectTypes[0]._name}.fromRdf({ ${dataFactoryVariable}, ${resourceVariable} }).chain(_super => { ${statements.join("\n")} })`,
      ];
    }

    return {
      hasOverrideKeyword: this.superObjectTypes.length > 0,
      isStatic: true,
      name: "fromRdf",
      parameters: [
        {
          name: "{ dataFactory, resource }",
          type: `{ dataFactory: rdfjs.DataFactory, resource: ${this.rdfjsResourceType().name} }`,
        },
      ],
      returnType: `purify.Either<rdfjsResource.Resource.ValueError, ${this._name}>`,
      statements,
    };
  }

  private get toRdfMethodDeclaration(): OptionalKind<MethodDeclarationStructure> {
    const statements: string[] = [];
    if (this.superObjectTypes.length > 0) {
      statements.push(
        "const resource = super.toRdf({ mutateGraph, resourceSet });",
      );
    } else if (this.identifierType.isNamedNodeKind) {
      statements.push(
        "const resource = resourceSet.mutableNamedResource({ identifier: this.identifier, mutateGraph });",
      );
    } else {
      statements.push(
        "const resource = resourceSet.mutableResource({ identifier: this.identifier, mutateGraph });",
      );
    }

    this.rdfType.ifJust((rdfType) => {
      statements.push(
        `resource.add(resource.dataFactory.namedNode("${rdf.type.value}"), resource.dataFactory.namedNode("${rdfType.value}"));`,
      );
    });

    for (const property of this.properties) {
      if (property.name === "identifier") {
        continue;
      }

      statements.push(
        property.valueToRdf({
          mutateGraphVariable: "mutateGraph",
          resourceSetVariable: "resourceSet",
        }),
      );
    }

    statements.push("return resource;");

    return {
      hasOverrideKeyword: this.superObjectTypes.length > 0,
      name: "toRdf",
      parameters: [
        {
          name: "{ mutateGraph, resourceSet }",
          type: "{ mutateGraph: rdfjsResource.MutableResource.MutateGraph, resourceSet: rdfjsResource.MutableResourceSet }",
        },
      ],
      returnType: this.rdfjsResourceType({ mutable: true }).name,
      statements,
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
        return this._name;
    }
  }

  valueFromRdf({
    dataFactoryVariable,
    inline,
    resourceValueVariable,
  }: Type.ValueFromRdfParameters): string {
    return inline
      ? `${resourceValueVariable}.to${this.rdfjsResourceType().named ? "Named" : ""}Resource().chain(resource => ${this._name}.fromRdf({ dataFactory: ${dataFactoryVariable}, resource }))`
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

  private rdfjsResourceType(options?: { mutable?: boolean }): {
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
}
