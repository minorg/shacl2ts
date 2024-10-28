import TermMap from "@rdfjs/term-map";
import type { BlankNode, NamedNode } from "@rdfjs/types";
import { rdf, xsd } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type * as ast from "../../ast";
import { AndType } from "./AndType.js";
import type { Configuration } from "./Configuration";
import { IdentifierType } from "./IdentifierType";
import { LiteralType } from "./LiteralType.js";
import { NumberType } from "./NumberType.js";
import { ObjectType } from "./ObjectType.js";
import { OrType } from "./OrType.js";
import { Property } from "./Property.js";
import { StringType } from "./StringType.js";
import type { Type } from "./Type.js";

export class Factory {
  private cachedObjectTypesByIdentifier: TermMap<
    BlankNode | NamedNode,
    ObjectType
  > = new TermMap();
  private cachedPropertiesByIdentifier: TermMap<
    BlankNode | NamedNode,
    Property
  > = new TermMap();
  private readonly configuration: Configuration;

  constructor({ configuration }: { configuration: Configuration }) {
    this.configuration = configuration;
  }

  createObjectTypeFromAstType(astType: ast.ObjectType): ObjectType {
    {
      const cachedObjectType = this.cachedObjectTypesByIdentifier.get(
        astType.name.identifier,
      );
      if (cachedObjectType) {
        return cachedObjectType;
      }
    }

    const identifierType = IdentifierType.fromNodeKinds({
      configuration: this.configuration,
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
        const properties: Property[] = astType.properties.map((astProperty) =>
          this.createPropertyFromAstProperty(astProperty),
        );

        if (astType.parentObjectTypes.length === 0) {
          properties.push(
            new Property({
              maxCount: Maybe.of(1),
              minCount: 1,
              name: this.configuration.objectTypeIdentifierPropertyName,
              path: rdf.subject,
              type: identifierType,
            }),
          );
        }

        return properties;
      },
      rdfType: astType.rdfType,
    });
    this.cachedObjectTypesByIdentifier.set(astType.name.identifier, objectType);
    return objectType;
  }

  createPropertyFromAstProperty(astProperty: ast.Property): Property {
    {
      const cachedProperty = this.cachedPropertiesByIdentifier.get(
        astProperty.name.identifier,
      );
      if (cachedProperty) {
        return cachedProperty;
      }
    }

    let type: Type;
    if (astProperty.type.kind === "Object" && !astProperty.inline) {
      // Non-inlined object type = its identifier
      type = new IdentifierType({
        configuration: this.configuration,
        nodeKinds: astProperty.type.nodeKinds,
      });
    } else {
      type = this.createTypeFromAstType(astProperty.type);
    }

    const property = new Property({
      maxCount: astProperty.maxCount,
      minCount: astProperty.minCount,
      name: astProperty.name.tsName,
      path: astProperty.path.iri,
      type,
    });
    this.cachedPropertiesByIdentifier.set(
      astProperty.name.identifier,
      property,
    );
    return property;
  }

  createTypeFromAstType(astType: ast.Type): Type {
    switch (astType.kind) {
      case "And": {
        return new AndType({
          configuration: this.configuration,
          types: astType.types.map((astType) =>
            this.createTypeFromAstType(astType),
          ),
        });
      }
      case "Enum":
        throw new Error("not implemented");
      case "Identifier":
        return IdentifierType.fromNodeKinds({
          configuration: this.configuration,
          nodeKinds: astType.nodeKinds,
        });
      case "Literal": {
        const datatype = astType.datatype.orDefault(xsd.string);
        if (datatype.equals(xsd.integer)) {
          return new NumberType({ configuration: this.configuration });
        }
        if (datatype.equals(xsd.anyURI) || datatype.equals(xsd.string)) {
          return new StringType({ configuration: this.configuration });
        }
        return new LiteralType({ configuration: this.configuration });
      }
      case "Object":
        return this.createObjectTypeFromAstType(astType);
      case "Or":
        return new OrType({
          configuration: this.configuration,
          types: astType.types.map((astType) =>
            this.createTypeFromAstType(astType),
          ),
        });
    }
  }
}
