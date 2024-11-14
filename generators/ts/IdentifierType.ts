import type { BlankNode, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { NodeKind } from "shacl-ast";
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

  override fromRdfExpression({
    variables,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    let expression: string;
    switch (this.name) {
      case "rdfjs.BlankNode":
        throw new Error("not implemented");
      case "rdfjs.NamedNode":
        expression = `${variables.resourceValue}.toIri()`;
        break;
      case "rdfjs.BlankNode | rdfjs.NamedNode":
        expression = `${variables.resourceValue}.toIdentifier()`;
        break;
      default:
        throw new Error(`not implemented: ${this.name}`);
    }
    this.hasValue.ifJust((hasValue) => {
      expression = `${expression}.chain<rdfjsResource.Resource.ValueError, ${this.name}>(_identifier => _identifier.equals(${rdfjsTermExpression(hasValue, this.configuration)}) ? purify.Either.of(_identifier) : purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: _identifier, expectedValueType: "${hasValue.termType}", focusResource: ${variables.resource}, predicate: ${variables.predicate})))`;
    });
    return expression;
  }

  override hashStatements({
    variables,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `${variables.hasher}.update(rdfjsResource.Resource.Identifier.toString(${variables.value}));`,
    ];
  }
}
