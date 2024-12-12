import { Maybe } from "purify-ts";
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
  } else {
    properties = this.properties.filter(
      (property) =>
        !(property instanceof IdentifierProperty) &&
        !(property instanceof TypeDiscriminatorProperty),
    );
  }

  if (properties.length === 0) {
    return Maybe.empty();
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
  switch (this.configuration.objectTypeDeclarationType) {
    case "class": {
      // If there's an ancestor with an equals implementation then delegate to super.
      for (const ancestorObjectType of this.ancestorObjectTypes) {
        const ancestorClassDeclaration = ancestorObjectType
          .classDeclaration()
          .extract();
        if (
          !ancestorClassDeclaration || // Probably an imported type, assume it has an equals
          (ancestorClassDeclaration.methods ?? []).some(
            (method) => method.name === "equals",
          )
        ) {
          chain.push("super.equals(other)");
          hasOverrideKeyword = true;
          break;
        }
      }
      break;
    }
    case "interface": {
      // For every parent, find the nearest equals implementation
      for (const parentObjectType of this.parentObjectTypes) {
        if (parentObjectType.equalsFunctionDeclaration().isJust()) {
          chain.push(`${parentObjectType.name}.equals(left, right)`);
        } else {
          for (const ancestorObjectType of parentObjectType.ancestorObjectTypes) {
            if (ancestorObjectType.equalsFunctionDeclaration().isJust()) {
              chain.push(`${ancestorObjectType.name}.equals(left, right)`);
              break;
            }
          }
        }
      }
      break;
    }
  }

  for (const property of properties) {
    let propertyEqualsCall = `(${property.equalsFunction})(${leftVariable}.${property.name}, ${rightVariable}.${property.name})`;
    if (chain.length > 0) {
      propertyEqualsCall = `chain(() => ${propertyEqualsCall})`;
    }
    chain.push(propertyEqualsCall);
  }
  const expression = chain.join(".");

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
    statements: [`return ${expression};`],
  });
}
