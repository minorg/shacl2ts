import { NodeKind } from "shacl-ast";
import { Memoize } from "typescript-memoize";
import type * as ast from "../../ast";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";

export class IdentifierType extends RdfjsTermType {
  readonly kind = "Identifier";
  private readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;

  constructor({
    nodeKinds,
    ...superParameters
  }: {
    nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
  } & Type.ConstructorParameters) {
    super(superParameters);
    this.nodeKinds = new Set([...nodeKinds]);
  }

  get isNamedNodeKind(): boolean {
    return this.nodeKinds.size === 1 && this.nodeKinds.has(NodeKind.IRI);
  }

  @Memoize()
  get name(): string {
    const names: string[] = [];
    if (this.nodeKinds.has(NodeKind.BLANK_NODE)) {
      names.push("rdfjs.BlankNode");
    }
    if (this.nodeKinds.has(NodeKind.IRI)) {
      names.push("rdfjs.NamedNode");
    }
    return names.join(" | ");
  }

  static fromAstType({
    astType,
    ...parameters
  }: {
    astType: ast.IdentifierType;
  } & Type.ConstructorParameters): IdentifierType {
    return IdentifierType.fromNodeKinds({
      nodeKinds: astType.nodeKinds,
      ...parameters,
    });
  }

  static fromNodeKinds({
    nodeKinds,
    ...parameters
  }: {
    nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
  } & Type.ConstructorParameters): IdentifierType {
    return new IdentifierType({ nodeKinds, ...parameters });
  }

  valueFromRdf({ resourceValueVariable }: Type.ValueFromRdfParameters): string {
    switch (this.name) {
      case "rdfjs.BlankNode":
        throw new Error("not implemented");
      case "rdfjs.NamedNode":
        return `${resourceValueVariable}.toIri()`;
      case "rdfjs.BlankNode | rdfjs.NamedNode":
        return `${resourceValueVariable}.toIdentifier()`;
      default:
        throw new Error(`not implemented: ${this.name}`);
    }
  }
}
