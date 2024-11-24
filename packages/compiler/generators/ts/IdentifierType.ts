import type { BlankNode, NamedNode } from "@rdfjs/types";
import { NodeKind } from "@shaclmate/shacl-ast";
import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import { Memoize } from "typescript-memoize";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";
import { rdfjsTermExpression } from "./rdfjsTermExpression";

export class IdentifierType extends RdfjsTermType<BlankNode | NamedNode> {
  readonly kind = "IdentifierType";
  private readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;

  constructor({
    nodeKinds,
    ...superParameters
  }: {
    nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
  } & ConstructorParameters<typeof RdfjsTermType<BlankNode | NamedNode>>[0]) {
    super(superParameters);
    this.nodeKinds = new Set([...nodeKinds]);
    invariant(this.nodeKinds.size > 0);
  }

  override get conversions(): readonly Type.Conversion[] {
    return this.defaultValue
      .map(
        (defaultValue) =>
          [
            {
              conversionExpression: () =>
                rdfjsTermExpression(defaultValue, this.configuration),
              sourceTypeName: "undefined",
            },
            {
              conversionExpression: (value: string) => value,
              sourceTypeCheck: (value: string) =>
                `typeof ${value} === "object"`,
              sourceTypeName: this.name,
            },
          ] as readonly Type.Conversion[],
      )
      .orDefault(super.conversions);
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

  @Memoize()
  override get name(): string {
    const names: string[] = [];
    if (this.nodeKinds.has(NodeKind.BLANK_NODE)) {
      names.push("rdfjs.BlankNode");
    }
    if (this.nodeKinds.has(NodeKind.IRI)) {
      names.push("rdfjs.NamedNode");
    }
    return names.join(" | ");
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [
      `${variables.hasher}.update(rdfjsResource.Resource.Identifier.toString(${variables.value}));`,
    ];
  }

  protected override fromRdfResourceValueExpression({
    variables,
  }: { variables: { resourceValue: string } }): string {
    switch (this.name) {
      case "rdfjs.BlankNode":
        throw new Error("not implemented");
      case "rdfjs.NamedNode":
        return `${variables.resourceValue}.toIri()`;
      case "rdfjs.BlankNode | rdfjs.NamedNode":
        return `${variables.resourceValue}.toIdentifier()`;
      default:
        throw new Error(`not implemented: ${this.name}`);
    }
  }
}
