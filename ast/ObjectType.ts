import type { NamedNode } from "@rdfjs/types";
import type { Maybe } from "purify-ts";
import type { NodeKind } from "shacl-ast";
import type { Name, Property } from ".";

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
   * Name of this ObjectType, usually derived from sh:name or shacl2ts:name.
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
  readonly properties: Property[];

  /**
   * The expected rdf:type of instances of this ObjectType.
   *
   * This is usually the identifier of an sh:NodeShape that is also an rdfs:Class (i.e., a node shape with implicit
   * class targets).
   */
  readonly rdfType: Maybe<NamedNode>;
}
