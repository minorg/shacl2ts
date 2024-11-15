import TermMap from "@rdfjs/term-map";
import type { BlankNode, NamedNode } from "@rdfjs/types";
import { xsd } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { NodeKind } from "shacl-ast";
import type * as ast from "../../ast";
import { BooleanType } from "./BooleanType";
import type { Configuration } from "./Configuration";
import { IdentifierType } from "./IdentifierType";
import { IntersectionType } from "./IntersectionType";
import { ListType } from "./ListType.js";
import { LiteralType } from "./LiteralType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { OptionType } from "./OptionType";
import { SetType } from "./SetType";
import { StringType } from "./StringType.js";
import type { Type } from "./Type.js";
import { UnionType } from "./UnionType";
import { tsName } from "./tsName.js";

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
      case "IdentifierType":
        return new IdentifierType({
          configuration: this.configuration,
          defaultValue: astType.defaultValue,
          hasValue: astType.hasValue,
          nodeKinds: astType.nodeKinds,
        });
      case "IntersectionType":
        return new IntersectionType({
          configuration: this.configuration,
          memberTypes: astType.memberTypes.map((astType) =>
            this.createTypeFromAstType(astType),
          ),
        });
      case "LiteralType": {
        const datatype = astType.datatype
          .altLazy(() =>
            astType.defaultValue.map((defaultValue) => defaultValue.datatype),
          )
          .altLazy(() => astType.hasValue.map((hasValue) => hasValue.datatype))
          .extractNullable();

        if (datatype !== null) {
          if (datatype.equals(xsd.boolean)) {
            return new BooleanType({
              configuration: this.configuration,
              defaultValue: astType.defaultValue,
              hasValue: astType.hasValue,
            });
          }
          if (datatype.equals(xsd.integer)) {
            return new NumberType({
              configuration: this.configuration,
              defaultValue: astType.defaultValue,
              hasValue: astType.hasValue,
            });
          }
          if (datatype.equals(xsd.anyURI) || datatype.equals(xsd.string)) {
            return new StringType({
              configuration: this.configuration,
              defaultValue: astType.defaultValue,
              hasValue: astType.hasValue,
            });
          }
        }
        return new LiteralType({
          configuration: this.configuration,
          defaultValue: astType.defaultValue,
          hasValue: astType.hasValue,
        });
      }
      case "ObjectType": {
        if (astType.listItemType.isJust()) {
          return new ListType({
            configuration: this.configuration,
            identifierNodeKind: astType.nodeKinds.has(NodeKind.BLANK_NODE)
              ? NodeKind.BLANK_NODE
              : NodeKind.IRI,
            itemType: this.createTypeFromAstType(
              astType.listItemType.unsafeCoerce(),
            ),
            mintingStrategy: astType.mintingStrategy,
            rdfType: astType.rdfType,
          });
        }

        return this.createObjectTypeFromAstType(astType);
      }
      case "OptionType":
        return new OptionType({
          configuration: this.configuration,
          itemType: this.createTypeFromAstType(astType.itemType),
        });
      case "SetType":
        return new SetType({
          configuration: this.configuration,
          itemType: this.createTypeFromAstType(astType.itemType),
          minCount: astType.minCount,
        });
      case "UnionType":
        return new UnionType({
          configuration: this.configuration,
          memberTypes: astType.memberTypes.map((astType) =>
            this.createTypeFromAstType(astType),
          ),
        });
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
      defaultValue: Maybe.empty(),
      hasValue: Maybe.empty(),
      nodeKinds: astType.nodeKinds,
    });

    const objectType = new ObjectType({
      abstract: astType.abstract,
      configuration: this.configuration,
      export_: astType.export,
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
              mintingStrategy: astType.mintingStrategy,
              name: this.configuration.objectTypeIdentifierPropertyName,
              type: identifierType,
            }),
          );
        } // Else parent will have the identifier property

        // Type discriminator property
        if (!objectType.abstract) {
          properties.push(
            new ObjectType.TypeDiscriminatorProperty({
              configuration: this.configuration,
              name: this.configuration.objectTypeDiscriminatorPropertyName,
              override:
                objectType.parentObjectTypes.length > 0 &&
                !objectType.parentObjectTypes[0].abstract,
              type: {
                name: [
                  ...new Set(
                    [objectType.discriminatorValue].concat(
                      objectType.descendantObjectTypes.map(
                        (objectType) => objectType.discriminatorValue,
                      ),
                    ),
                  ),
                ]
                  .sort()
                  .map((name) => `"${name}"`)
                  .join("|"),
              },
              value: objectType.discriminatorValue,
            }),
          );
        }

        return properties;
      },
      mintingStrategy: astType.mintingStrategy,
      name: tsName(astType.name),
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
      astObjectTypeProperty.type.kind === "ObjectType" &&
      !astObjectTypeProperty.inline
    ) {
      // Non-inlined object type = its identifier
      type = new IdentifierType({
        configuration: this.configuration,
        defaultValue: Maybe.empty(),
        hasValue: Maybe.empty(),
        nodeKinds: astObjectTypeProperty.type.nodeKinds,
      });
    } else {
      type = this.createTypeFromAstType(astObjectTypeProperty.type);
    }

    const property = new ObjectType.ShaclProperty({
      configuration: this.configuration,
      name: tsName(astObjectTypeProperty.name),
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
