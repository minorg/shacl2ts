import { NodeKind } from "shacl-ast";
import type * as ast from "../../../ast";
import { RdfjsTermType } from "./RdfjsTermType.js";

export class IdentifierType extends RdfjsTermType {
  readonly inlineName: string;
  readonly kind = "Identifier";

  constructor({ inlineName }: { inlineName: string }) {
    super();
    this.inlineName = inlineName;
  }

  static fromAstType(astType: ast.IdentifierType): IdentifierType {
    return IdentifierType.fromNodeKinds(astType.nodeKinds);
  }

  static fromNodeKinds(
    nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>,
  ): IdentifierType {
    const inlineNames: string[] = [];
    if (nodeKinds.has(NodeKind.BLANK_NODE)) {
      inlineNames.push("rdfjs.BlankNode");
    }
    if (nodeKinds.has(NodeKind.IRI)) {
      inlineNames.push("rdfjs.NamedNode");
    }
    return new IdentifierType({ inlineName: inlineNames.join(" | ") });
  }
}
