import TermMap from "@rdfjs/term-map";
import type { BlankNode, NamedNode } from "@rdfjs/types";
import { xsd } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type * as ast from "../../ast";
import { AndType } from "./AndType.js";
import type { Configuration } from "./Configuration";
import { IdentifierType } from "./IdentifierType";
import { ListType } from "./ListType.js";
import { LiteralType } from "./LiteralType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { OrType } from "./OrType.js";
import { StringType } from "./StringType.js";
import type { Type } from "./Type.js";

export class TypeFactory {
  private cachedObjectTypePropertiesByIdentifier: TermMap<
    BlankNode | NamedNode,
    ObjectType.Property
  > = new TermMap();
  private cachedObjectTypesByIdentifier: TermMap<
    BlankNode | NamedNode,
    ObjectType
  > = new TermMap();
  private readonly configuration: Configuration;

  constructor({ configuration }: { configuration: Configuration }) {
    this.configuration = configuration;
  }

  createTypeFromAstType(astType: ast.Type): Type {
    switch (astType.kind) {
      case "And":
        return new AndType({
          configuration: this.configuration,
          types: astType.types.map((astType) =>
            this.createTypeFromAstType(astType),
          ),
        });
      case "Or":
        return new OrType({
          configuration: this.configuration,
          types: astType.types.map((astType) =>
            this.createTypeFromAstType(astType),
          ),
        });
      case "Enum":
        throw new Error("not implemented");
      case "Identifier":
        return new IdentifierType({
          configuration: this.configuration,
          hasValue: astType.hasValue,
          nodeKinds: astType.nodeKinds,
        });
      case "Literal": {
        const datatype = astType.datatype.extractNullable();
        if (datatype !== null) {
          if (datatype.equals(xsd.integer)) {
            return new NumberType({ configuration: this.configuration });
          }
          if (datatype.equals(xsd.anyURI) || datatype.equals(xsd.string)) {
            return new StringType({ configuration: this.configuration });
          }
        }
        return new LiteralType({ configuration: this.configuration });
      }
      case "Object":
        if (astType.listItemType.isJust()) {
          return new ListType({
            configuration: this.configuration,
            itemType: this.createTypeFromAstType(
              astType.listItemType.unsafeCoerce(),
            ),
          });
        }

        return this.createObjectTypeFromAstType(astType);
    }
  }

  private createObjectTypeFromAstType(astType: ast.ObjectType): ObjectType {
    {
      const cachedObjectType = this.cachedObjectTypesByIdentifier.get(
        astType.name.identifier,
      );
      if (cachedObjectType) {
        return cachedObjectType;
      }
    }

    const identifierType = new IdentifierType({
      configuration: this.configuration,
      hasValue: Maybe.empty(),
      nodeKinds: astType.nodeKinds,
    });

    const objectType = new ObjectType({
      astName: astType.name.tsName,
      configuration: this.configuration,
      identifierType,
      lazyAncestorObjectTypes: () =>
        astType.ancestorObjectTypes.map((astType) =>
          this.createObjectTypeFromAstType(astType),
        ),
      lazyDescendantObjectTypes: () =>
        astType.descendantObjectTypes.map((astType) =>
          this.createObjectTypeFromAstType(astType),
        ),
      lazyParentObjectTypes: () =>
        astType.parentObjectTypes.map((astType) =>
          this.createObjectTypeFromAstType(astType),
        ),
      lazyProperties: () => {
        const properties: ObjectType.Property[] = astType.properties.map(
          (astProperty) =>
            this.createObjectTypePropertyFromAstProperty(astProperty),
        );

        if (astType.parentObjectTypes.length === 0) {
          properties.push(
            new ObjectType.IdentifierProperty({
              configuration: this.configuration,
              name: this.configuration.objectTypeIdentifierPropertyName,
              type: identifierType,
            }),
          );
        } // Else parent will have the identifier property

        // Type discriminator property
        properties.push(
          new ObjectType.TypeDiscriminatorProperty({
            configuration: this.configuration,
            name: this.configuration.objectTypeDiscriminatorPropertyName,
            override: objectType.parentObjectTypes.length > 0,
            type: {
              name: [
                ...new Set(
                  [objectType.name].concat(
                    objectType.descendantObjectTypes.map(
                      (objectType) => objectType.name,
                    ),
                  ),
                ),
              ]
                .sort()
                .map((name) => `"${name}"`)
                .join("|"),
            },
            value: objectType.name,
          }),
        );

        return properties;
      },
      rdfType: astType.rdfType,
    });
    this.cachedObjectTypesByIdentifier.set(astType.name.identifier, objectType);
    return objectType;
  }

  private createObjectTypePropertyFromAstProperty(
    astObjectTypeProperty: ast.ObjectType.Property,
  ): ObjectType.Property {
    {
      const cachedProperty = this.cachedObjectTypePropertiesByIdentifier.get(
        astObjectTypeProperty.name.identifier,
      );
      if (cachedProperty) {
        return cachedProperty;
      }
    }

    let type: Type;
    if (
      astObjectTypeProperty.type.kind === "Object" &&
      !astObjectTypeProperty.inline
    ) {
      // Non-inlined object type = its identifier
      type = new IdentifierType({
        configuration: this.configuration,
        hasValue: Maybe.empty(),
        nodeKinds: astObjectTypeProperty.type.nodeKinds,
      });
    } else {
      type = this.createTypeFromAstType(astObjectTypeProperty.type);
    }

    const property = new ObjectType.ShaclProperty({
      configuration: this.configuration,
      maxCount: astObjectTypeProperty.maxCount,
      minCount: astObjectTypeProperty.minCount,
      name: astObjectTypeProperty.name.tsName,
      path: astObjectTypeProperty.path.iri,
      type,
    });
    this.cachedObjectTypePropertiesByIdentifier.set(
      astObjectTypeProperty.name.identifier,
      property,
    );
    return property;
  }
}
