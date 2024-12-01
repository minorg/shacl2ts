import { NodeKind } from "@shaclmate/shacl-ast";

export function termTypeToNodeKind(
  termType: "BlankNode" | "Literal" | "NamedNode",
): NodeKind {
  switch (termType) {
    case "BlankNode":
      return NodeKind.BLANK_NODE;
    case "Literal":
      return NodeKind.LITERAL;
    case "NamedNode":
      return NodeKind.IRI;
  }
}
