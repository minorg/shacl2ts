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

  @Memoize()
  name(): string {
    const names: string[] = [];
    if (this.nodeKinds.has(NodeKind.BLANK_NODE)) {
      names.push("rdfjs.BlankNode");
    }
    if (this.nodeKinds.has(NodeKind.IRI)) {
      names.push("rdfjs.NamedNode");
    }
    return names.join(" | ");
  }
}
