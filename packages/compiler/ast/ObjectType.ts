import type { NamedNode } from "@rdfjs/types";
import type { NodeKind } from "@shaclmate/shacl-ast";
import type { PredicatePath } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";
import { Resource } from "rdfjs-resource";
import genericToposort from "toposort";
import type { IriMintingStrategy } from "../IriMintingStrategy.js";
import type { PropertyVisibility } from "../PropertyVisibility.js";
import type { Name } from "./Name.js";
import type { Type } from "./Type.js";

export interface ObjectType {
  /**
   * Classes generated from this type are abstract / cannot be instantiated themselves.
   *
   * Defaults to false.
   */
  readonly abstract: boolean;

  /**
   * Ancestor (parents, their parents, ad nauseum) ObjectTypes of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly ancestorObjectTypes: ObjectType[];

  /**
   * Immediate child ObjectTypes of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly childObjectTypes: ObjectType[];

  /**
   * Descendant (children, their children, ad nauseum) ObjectTypes of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly descendantObjectTypes: ObjectType[];

  /**
   * Should generated code derived from this ObjectType be visible outside its module?
   *
   * Defaults to true.
   */
  readonly export: boolean;

  /**
   * Strategy for minting new object identifiers. If not specified, require an identifier on construction.
   */
  readonly iriMintingStrategy: Maybe<IriMintingStrategy>;

  readonly kind: "ObjectType";

  /**
   * If the ObjectType is an RDF list, this is the type of rdf:first.
   * https://www.w3.org/TR/rdf-schema/#ch_collectionvocab
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  listItemType: Maybe<Type>;
  /**
   * Name of this type, usually derived from sh:name or shaclmate:name.
   */
  readonly name: Name;

  /**
   * The RDF node kinds this ObjectType may be identified by.
   *
   * Used to associate instances with an RDF identifier.
   */
  readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;

  /**
   * Immediate parent ObjectTypes of this Object types.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly parentObjectTypes: ObjectType[];

  /**
   * Properties of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the compiler.
   */
  readonly properties: ObjectType.Property[];

  /**
   * The expected rdf:type of instances of this ObjectType.
   *
   * This is usually the identifier of an sh:NodeShape that is also an rdfs:Class (i.e., a node shape with implicit
   * class targets).
   */
  readonly rdfType: Maybe<NamedNode>;

  /**
   * A TypeScript import to use for this type in lieu of generating code for the type.
   *
   * The import should have the same name as the type. For example, if the type is MyType, the import should resemble
   *
   * import { MyType } from "./MyType.js"
   */
  readonly tsImport: Maybe<string>;
}

export namespace ObjectType {
  export interface Property {
    readonly inline: boolean;
    readonly name: Name;
    readonly path: PredicatePath;
    readonly type: Type;
    readonly visibility: PropertyVisibility;
  }

  export function toposort(
    objectTypes: readonly ObjectType[],
  ): readonly ObjectType[] {
    const objectTypesByIdentifier: Record<string, ObjectType> = {};
    const objectTypeGraphNodes: string[] = [];
    const objectTypeGraphEdges: [string, string | undefined][] = [];
    for (const objectType of objectTypes) {
      const objectTypeIdentifier = Resource.Identifier.toString(
        objectType.name.identifier,
      );
      objectTypesByIdentifier[objectTypeIdentifier] = objectType;
      objectTypeGraphNodes.push(objectTypeIdentifier);
      for (const parentAstObjectType of objectType.parentObjectTypes) {
        objectTypeGraphEdges.push([
          objectTypeIdentifier,
          Resource.Identifier.toString(parentAstObjectType.name.identifier),
        ]);
      }
    }
    return genericToposort
      .array(objectTypeGraphNodes, objectTypeGraphEdges)
      .map(
        (objectTypeIdentifier) => objectTypesByIdentifier[objectTypeIdentifier],
      )
      .reverse();
  }
}
