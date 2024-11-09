import type { BlankNode, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { NodeKind } from "shacl-ast";
import { invariant } from "ts-invariant";
import { Memoize } from "typescript-memoize";
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
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.nodeKinds = new Set([...nodeKinds]);
    invariant(this.nodeKinds.size > 0);
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.of({
      name: "termType",
      type: "string" as const,
      values: [...this.nodeKinds].map((nodeKind) => {
        switch (nodeKind) {
          case NodeKind.BLANK_NODE:
            return "BlankNode" satisfies BlankNode["termType"];
          case NodeKind.IRI:
            return "NamedNode" satisfies NamedNode["termType"];
        }
      }),
    });
  }

  get isNamedNodeKind(): boolean {
    return this.nodeKinds.size === 1 && this.nodeKinds.has(NodeKind.IRI);
  }

  override fromRdfExpression({
    resourceValueVariable,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    switch (this.name()) {
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

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `${hasherVariable}.update(rdfjsResource.Resource.Identifier.toString(${valueVariable}));`,
    ];
  }

  @Memoize()
  override name(): string {
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
