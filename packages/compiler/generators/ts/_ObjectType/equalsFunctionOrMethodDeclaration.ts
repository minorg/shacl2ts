import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import type { OptionalKind, ParameterDeclarationStructure } from "ts-morph";
import type { ObjectType } from "../ObjectType.js";
import { IdentifierProperty } from "./IdentifierProperty.js";
import { TypeDiscriminatorProperty } from "./TypeDiscriminatorProperty.js";

export function equalsFunctionOrMethodDeclaration(this: ObjectType): Maybe<{
  hasOverrideKeyword: boolean;
  name: string;
  parameters: OptionalKind<ParameterDeclarationStructure>[];
  returnType: string;
  statements: string[];
}> {
  if (!this.configuration.features.has("equals")) {
    return Maybe.empty();
  }

  let properties: readonly ObjectType.Property[];
  if (this.parentObjectTypes.length === 0) {
    // Consider that a root of the object type hierarchy "owns" the identifier and type discriminator properties
    // for all of its subtypes in the hierarchy.
    properties = this.properties;
    invariant(properties.length >= 2);
  } else {
    properties = this.properties.filter(
      (property) =>
        !(property instanceof IdentifierProperty) &&
        !(property instanceof TypeDiscriminatorProperty),
    );
    if (
      this.configuration.objectTypeDeclarationType === "class" &&
      properties.length === 0
    ) {
      // If there's a parent class and no properties in this class, can skip overriding equals
      return Maybe.empty();
    }
  }

  let leftVariable: string;
  let rightVariable: string;
  switch (this.configuration.objectTypeDeclarationType) {
    case "class":
      leftVariable = "this";
      rightVariable = "other";
      break;
    case "interface":
      leftVariable = "left";
      rightVariable = "right";
  }

  const chain: string[] = [];

  let hasOverrideKeyword = false;
  if (this.parentObjectTypes.length > 0) {
    switch (this.configuration.objectTypeDeclarationType) {
      case "class": {
        chain.push("super.equals(other)");
        hasOverrideKeyword = true;
        break;
      }
      case "interface": {
        // For every parent, find the nearest equals implementation
        for (const parentObjectType of this.parentObjectTypes) {
          chain.push(`${parentObjectType.name}.equals(left, right)`);
        }
        break;
      }
    }
  }

  for (const property of properties) {
    chain.push(
      `(${property.equalsFunction})(${leftVariable}.${property.name}, ${rightVariable}.${property.name}).mapLeft(propertyValuesUnequal => ({ left: ${leftVariable}, right: ${rightVariable}, propertyName: "${property.name}", propertyValuesUnequal, type: "Property" as const }))`,
    );
  }

  return Maybe.of({
    hasOverrideKeyword,
    name: "equals",
    parameters:
      this.configuration.objectTypeDeclarationType === "interface"
        ? [
            {
              name: "left",
              type: this.name,
            },
            {
              name: "right",
              type: this.name,
            },
          ]
        : [
            {
              name: "other",
              type: this.name,
            },
          ],
    returnType: "purifyHelpers.Equatable.EqualsResult",
    statements: [
      `return ${chain
        .map((chainPart, chainPartI) =>
          chainPartI === 0 ? chainPart : `chain(() => ${chainPart})`,
        )
        .join(".")};`,
    ],
  });
}
