import type { NamedNode } from "@rdfjs/types";
import type { NodeKind } from "@shaclmate/shacl-ast";
import type { PredicatePath } from "@shaclmate/shacl-ast";
import type { Maybe } from "purify-ts";
import type { Name, Type } from ".";
import type { MintingStrategy } from "./MintingStrategy";

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

  readonly kind: "ObjectType";

  /**
   * If the ObjectType is an RDF list, this is the type of rdf:first.
   * https://www.w3.org/TR/rdf-schema/#ch_collectionvocab
   *
   * Mutable to support cycle-handling logic in the compiler.
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
}

export namespace ObjectType {
  export interface Property {
    readonly inline: boolean;
    readonly name: Name;
    readonly path: PredicatePath;
    readonly type: Type;
  }
}
