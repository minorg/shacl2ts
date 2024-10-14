import { Maybe } from "purify-ts";
import { NodeKind } from "shacl-ast";
import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type InterfaceDeclarationStructure,
  type ModuleDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type PropertySignatureStructure,
  type StatementStructures,
  StructureKind,
} from "ts-morph";
import type * as ast from "../../../ast";
import { Property } from "./Property.js";
import type { Type } from "./Type.js";

export class ObjectType implements Type {
  readonly ancestorObjectTypes: readonly ObjectType[];
  readonly identifierProperty: Property;
  readonly kind = "Object";
  readonly name: string;
  readonly properties: ObjectType.Properties;
  readonly superObjectTypes: readonly ObjectType[];

  constructor({
    ancestorObjectTypes,
    identifierProperty,
    name,
    properties,
    superObjectTypes,
  }: {
    ancestorObjectTypes: readonly ObjectType[];
    identifierProperty: Property;
    name: string;
    properties: ObjectType.Properties;
    superObjectTypes: readonly ObjectType[];
  }) {
    this.ancestorObjectTypes = ancestorObjectTypes;
    this.identifierProperty = identifierProperty;
    this.name = name;
    this.properties = properties;
    this.superObjectTypes = superObjectTypes;
  }

  get classDeclaration(): OptionalKind<ClassDeclarationStructure> {
    return {
      ctors:
        this.properties.propertyDeclarations.length > 0
          ? [this.constructorDeclaration]
          : undefined,
      extends:
        this.superObjectTypes.length > 0
          ? this.superObjectTypes[0].name
          : undefined,
      isExported: true,
      name: this.name,
      properties: this.properties.propertyDeclarations,
    };
  }

  get constructorDeclaration(): OptionalKind<ConstructorDeclarationStructure> {
    const statements: (string | StatementStructures)[] = [];
    if (this.superObjectTypes.length > 0) {
      statements.push("super(parameters);");
    }
    for (const propertyDeclaration of this.properties.propertyDeclarations) {
      statements.push(
        `this.${propertyDeclaration.name} = parameters.${propertyDeclaration.name};`,
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

  get externName(): string {
    return this.identifierProperty.typeName;
  }

  static fromAstType(astType: ast.ObjectType): ObjectType {
    const identifierTypeNames: string[] = [];
    if (astType.nodeKinds.has(NodeKind.BLANK_NODE)) {
      identifierTypeNames.push("rdfjs.BlankNode");
    }
    if (astType.nodeKinds.has(NodeKind.IRI)) {
      identifierTypeNames.push("rdfjs.NamedNode");
    }
    const identifierTypeName = identifierTypeNames.join(" | ");
    const identifierProperty = new Property({
      inline: true,
      maxCount: Maybe.of(1),
      minCount: 1,
      name: "identifier",
      type: {
        externName: identifierTypeName,
        kind: "Identifier",
        inlineName: identifierTypeName,
      },
    });

    const properties: Property[] = astType.properties.map(
      Property.fromAstProperty,
    );
    if (astType.superObjectTypes.length === 0) {
      properties.push(identifierProperty);
    }

    return new ObjectType({
      ancestorObjectTypes: astType.ancestorObjectTypes.map(
        ObjectType.fromAstType,
      ),
      identifierProperty,
      name: astType.name.tsName,
      properties: new ObjectType.Properties(properties),
      superObjectTypes: astType.superObjectTypes.map(ObjectType.fromAstType),
    });
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
      properties: this.properties.propertySignatures,
    };
  }

  get moduleDeclaration(): OptionalKind<ModuleDeclarationStructure> {
    return {
      isExported: true,
      name: this.name,
      statements: [this.parametersInterfaceDeclaration],
    };
  }

  get parametersInterfaceDeclaration(): InterfaceDeclarationStructure {
    return {
      extends:
        this.superObjectTypes.length > 0
          ? [`${this.superObjectTypes[0].inlineName}.Parameters`]
          : undefined,
      isExported: true,
      kind: StructureKind.Interface,
      properties: this.properties.propertyDeclarations.map(
        (propertyDeclaration) => ({
          isReadonly: true,
          name: propertyDeclaration.name,
          type: propertyDeclaration.type,
        }),
      ),
      name: "Parameters",
    };
  }
}

export namespace ObjectType {
  export class Properties implements Iterable<Property> {
    private readonly properties: readonly Property[];

    constructor(properties: readonly Property[]) {
      this.properties = properties
        .concat()
        .sort((left, right) => left.name.localeCompare(right.name));
    }

    [Symbol.iterator](): Iterator<Property> {
      return this.properties[Symbol.iterator]();
    }

    private ensureUniqueness(): void {
      // if (this.superObjectTypes.length === 0) {
      //   propertyDeclarationsByName["identifier"] = {
      //     isReadonly: true,
      //     name: "identifier",
      //     type: this.identifierTypeName,
      //   };
      // }

      const propertyNames = new Set<string>();
      for (const property of this.properties) {
        if (propertyNames.has(property.name)) {
          throw new Error(`duplicate property '${property.name}'`);
        }
      }
    }

    get propertyDeclarations(): OptionalKind<PropertyDeclarationStructure>[] {
      this.ensureUniqueness();
      return this.properties.map((property) => property.propertyDeclaration);
    }

    get propertySignatures(): OptionalKind<PropertySignatureStructure>[] {
      this.ensureUniqueness();
      return this.properties.map((property) => property.propertySignature);
    }
  }
}
