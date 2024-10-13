import { NodeKind } from "shacl-ast";
import type * as ast from "../../../ast";
import { Property } from "./Property.js";
import type { Type } from "./Type.js";

export class ObjectType implements Type {
  readonly ancestorObjectTypes: readonly ObjectType[];
  readonly identifierTypeName: string;
  readonly name: string;
  readonly properties: readonly Property[];
  readonly superObjectTypes: readonly ObjectType[];

  constructor({
    ancestorObjectTypes,
    identifierTypeName,
    name,
    properties,
    superObjectTypes,
  }: {
    ancestorObjectTypes: readonly ObjectType[];
    identifierTypeName: string;
    name: string;
    properties: readonly Property[]; // Mutable so subclasses can insert additional properties
    superObjectTypes: readonly ObjectType[];
  }) {
    this.ancestorObjectTypes = ancestorObjectTypes;
    this.identifierTypeName = identifierTypeName;
    this.name = name;
    this.properties = properties;
    this.superObjectTypes = superObjectTypes;
  }

  get externName(): string {
    return this.identifierTypeName;
  }

  static fromAstType(astType: ast.ObjectType): ObjectType {
    const identifierTypeNames: string[] = [];
    if (astType.nodeKinds.has(NodeKind.BLANK_NODE)) {
      identifierTypeNames.push("rdfjs.BlankNode");
    }
    if (astType.nodeKinds.has(NodeKind.IRI)) {
      identifierTypeNames.push("rdfjs.NamedNode");
    }

    return new ObjectType({
      ancestorObjectTypes: astType.ancestorObjectTypes.map(
        ObjectType.fromAstType,
      ),
      identifierTypeName: identifierTypeNames.join(" | "),
      name: astType.name.tsName,
      properties: astType.properties.map(Property.fromAstProperty),
      superObjectTypes: astType.superObjectTypes.map(ObjectType.fromAstType),
    });
  }

  get inlineName(): string {
    return this.name;
  }
}
