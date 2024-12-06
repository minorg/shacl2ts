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

  let ownProperties: readonly ObjectType.Property[];
  if (this.parentObjectTypes.length === 0) {
    // For the purposes of equals(), consider that the root of the object type hierarchy "owns" the identifier and
    // type discriminator properties
    ownProperties = this.properties;
  } else {
    // Non-root, doesn't own the identifier and type discriminator properties.
    ownProperties = this.properties.filter(
      (property) =>
        !(property instanceof IdentifierProperty) &&
        !(property instanceof TypeDiscriminatorProperty),
    );
  }

  if (ownProperties.length === 0) {
    return Maybe.empty();
  }

  let expression: string;
  let hasOverrideKeyword = false;
  switch (this.configuration.objectTypeDeclarationType) {
    case "class": {
      expression = `purifyHelpers.Equatable.objectEquals(this, other, { ${ownProperties
        .map((property) => `${property.name}: ${property.equalsFunction}`)
        .join()} })`;
      // If there's an ancestor with an equals implementation then delegate to super.
      for (const ancestorObjectType of this.ancestorObjectTypes) {
        if (
          (ancestorObjectType.classDeclaration().methods ?? []).some(
            (method) => method.name === "equals",
          )
        ) {
          expression = `super.equals(other).chain(() => ${expression})`;
          hasOverrideKeyword = true;
          break;
        }
      }
      break;
    }
    case "interface": {
      expression = `purifyHelpers.Equatable.objectEquals(left, right, { ${ownProperties
        .map((property) => `${property.name}: ${property.equalsFunction}`)
        .join()} })`;
      // For every parent, find the nearest equals implementation
      for (const parentObjectType of this.parentObjectTypes) {
        if (parentObjectType.equalsFunctionDeclaration().isJust()) {
          expression = `${parentObjectType.name}.equals(left, right).chain(() => ${expression})`;
        } else {
          for (const ancestorObjectType of parentObjectType.ancestorObjectTypes) {
            if (ancestorObjectType.equalsFunctionDeclaration().isJust()) {
              expression = `${ancestorObjectType.name}.equals(left, right).chain(() => ${expression})`;
              break;
            }
          }
        }
      }
      break;
    }
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
    statements: [`return ${expression};`],
  });
}
