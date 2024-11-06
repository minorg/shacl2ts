import type { NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeKind } from "shacl-ast";
import type { PredicatePath } from "shacl-ast";
import type { Name, Type } from ".";
import type { MintingStrategy } from "./MintingStrategy";

export interface ObjectType {
  /**
   * Ancestor (parents, their parents, ad nauseum) ObjectTypes of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the transformer.
   */
  readonly ancestorObjectTypes: ObjectType[];

  /**
   * Immediate child ObjectTypes of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the transformer.
   */
  readonly childObjectTypes: ObjectType[];

  /**
   * Descendant (children, their children, ad nauseum) ObjectTypes of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the transformer.
   */
  readonly descendantObjectTypes: ObjectType[];

  readonly kind: "Object";

  /**
   * If the ObjectType is an RDF list, this is the type of rdf:first.
   * https://www.w3.org/TR/rdf-schema/#ch_collectionvocab
   *
   * Mutable to support cycle-handling logic in the transformer.
   */
  listItemType: Maybe<Type>;

  /**
   * Strategy for minting new object identifiers. If not specified, require an identifier on construction.
   */
  readonly mintingStrategy: Maybe<MintingStrategy>;

  /**
   * Name of this ObjectType, usually derived from sh:name or shaclmate:name.
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
   * Mutable to support cycle-handling logic in the transformer.
   */
  readonly parentObjectTypes: ObjectType[];

  /**
   * Properties of this ObjectType.
   *
   * Mutable to support cycle-handling logic in the transformer.
   */
  readonly properties: ObjectType.Property[];

  /**
   * The expected rdf:type of instances of this ObjectType.
   *
   * This is usually the identifier of an sh:NodeShape that is also an rdfs:Class (i.e., a node shape with implicit
   * class targets).
   */
  readonly rdfType: Maybe<NamedNode>;
}

export namespace ObjectType {
  export interface Property {
    readonly inline: boolean;
    readonly maxCount: Maybe<number>;
    readonly minCount: number;
    readonly name: Name;
    readonly path: PredicatePath;
    readonly type: Type;
  }
}
