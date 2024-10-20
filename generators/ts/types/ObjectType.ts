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
import { Property } from "./Property.js";
import type { Type } from "./Type.js";
import "iterator-helpers-polyfill";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { IdentifierType } from "./IdentifierType.js";

export class ObjectType implements Type {
  readonly ancestorObjectTypes: readonly ObjectType[];
  readonly identifierType: IdentifierType;
  readonly kind = "Object";
  readonly name: string;
  readonly properties: readonly Property[];
  readonly superObjectTypes: readonly ObjectType[];

  constructor({
    ancestorObjectTypes,
    identifierType,
    name,
    properties,
    superObjectTypes,
  }: {
    ancestorObjectTypes: readonly ObjectType[];
    identifierType: IdentifierType;
    name: string;
    properties: readonly Property[];
    superObjectTypes: readonly ObjectType[];
  }) {
    this.ancestorObjectTypes = ancestorObjectTypes;
    this.identifierType = identifierType;
    this.name = name;
    this.properties = properties
      .concat()
      .sort((left, right) => left.name.localeCompare(right.name));
    const propertyNames = new Set<string>();
    for (const property of this.properties) {
      if (propertyNames.has(property.name)) {
        throw new Error(`duplicate property '${property.name}'`);
      }
    }
    this.superObjectTypes = superObjectTypes;
  }

  get classDeclaration(): OptionalKind<ClassDeclarationStructure> {
    return {
      ctors:
        this.properties.length > 0 ? [this.constructorDeclaration] : undefined,
      extends:
        this.superObjectTypes.length > 0
          ? this.superObjectTypes[0].name
          : undefined,
      isExported: true,
      methods: [this.equalsMethodDeclaration, this.toRdfMethodDeclaration],
      name: this.name,
      properties: this.properties.map(
        (property) => property.classPropertyDeclaration,
      ),
    };
  }

  get externName(): string {
    return this.identifierType.externName;
  }

  get inlineName(): string {
    return this.name;
  }

  get interfaceDeclaration(): OptionalKind<InterfaceDeclarationStructure> {
    return {
      extends: this.superObjectTypes.map(
        (superObjectType) => superObjectType.name,
      ),
      isExported: true,
      name: this.name,
      properties: this.properties.map(
        (property) => property.interfacePropertySignature,
      ),
    };
  }

  get moduleDeclaration(): OptionalKind<ModuleDeclarationStructure> {
    return {
      isExported: true,
      name: this.name,
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
          type: `${this.name}.Parameters`,
        },
      ],
      statements,
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
          type: this.name,
        },
      ],
      statements: [`return ${expression};`],
      returnType: "purifyHelpers.Equatable.EqualsResult",
    };
  }

  private get toRdfMethodDeclaration(): OptionalKind<MethodDeclarationStructure> {
    let returnType: string;
    const statements: string[] = [];
    if (this.superObjectTypes.length > 0) {
      statements.push(
        "const resource = super.toRdf({ mutateGraph, resourceSet });",
      );
      returnType = this.superObjectTypes[0].identifierType.isNamedNodeKind
        ? "rdfjsResource.MutableResource<rdfjs.NamedNode>"
        : "rdfjsResource.MutableResource";
    } else if (this.identifierType.isNamedNodeKind) {
      returnType = "rdfjsResource.MutableResource<rdfjs.NamedNode>";
      statements.push(
        "const resource = resourceSet.mutableNamedResource({ identifier: this.identifier, mutateGraph });",
      );
    } else {
      returnType = "rdfjsResource.MutableResource";
      statements.push(
        "const resource = resourceSet.mutableResource({ identifier: this.identifier, mutateGraph });",
      );
    }

    for (const property of this.properties) {
      if (property.name === "identifier") {
        continue;
      }

      statements.push(
        property.valueToRdf({
          mutateGraphVariable: "mutateGraph",
          resourceSetVariable: "resourceSet",
          value: `this.${property.name}`,
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
      returnType,
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
      superObjectTypes: astType.superObjectTypes.map(ObjectType.fromAstType),
    });
  }

  equalsFunction(): string {
    return "purifyHelpers.Equatable.equals";
  }

  valueToRdf({
    mutateGraphVariable,
    resourceSetVariable,
    value,
  }: Type.ValueToRdfParameters): string {
    return `${value}.toRdf({ mutateGraph: ${mutateGraphVariable}, resourceSet: ${resourceSetVariable} }).identifier`;
  }
}
