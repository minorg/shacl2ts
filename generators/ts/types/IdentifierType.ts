import { NodeKind } from "shacl-ast";
import { Memoize } from "typescript-memoize";
import type * as ast from "../../../ast";
import { RdfjsTermType } from "./RdfjsTermType.js";

export class IdentifierType extends RdfjsTermType {
  readonly kind = "Identifier";
  private readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;

  constructor({
    nodeKinds,
  }: { nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI> }) {
    super();
    this.nodeKinds = new Set([...nodeKinds]);
  }

  @Memoize()
  get inlineName(): string {
    const inlineNames: string[] = [];
    if (this.nodeKinds.has(NodeKind.BLANK_NODE)) {
      inlineNames.push("rdfjs.BlankNode");
    }
    if (this.nodeKinds.has(NodeKind.IRI)) {
      inlineNames.push("rdfjs.NamedNode");
    }
    return inlineNames.join(" | ");
  }

  get isNamedNodeKind(): boolean {
    return this.nodeKinds.size === 1 && this.nodeKinds.has(NodeKind.IRI);
  }

  static fromAstType(astType: ast.IdentifierType): IdentifierType {
    return IdentifierType.fromNodeKinds(astType.nodeKinds);
  }

  static fromNodeKinds(
    nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>,
  ): IdentifierType {
    return new IdentifierType({ nodeKinds });
  }
}
