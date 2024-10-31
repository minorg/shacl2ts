import type { BlankNode, NamedNode } from "@rdfjs/types";
import { Maybe } from "purify-ts";
import { NodeKind } from "shacl-ast";
import { invariant } from "ts-invariant";
import { Memoize } from "typescript-memoize";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type";

export class IdentifierType extends RdfjsTermType {
  readonly kind = "Identifier";
  private readonly hasValue: Maybe<BlankNode | NamedNode>;
  private readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;

  constructor({
    hasValue,
    nodeKinds,
    ...superParameters
  }: {
    hasValue: Maybe<BlankNode | NamedNode>;
    nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.hasValue = hasValue;
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
    predicate,
    resourceVariable,
    resourceValueVariable,
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    let expression: string;
    switch (this.name) {
      case "rdfjs.BlankNode":
        throw new Error("not implemented");
      case "rdfjs.NamedNode":
        expression = `${resourceValueVariable}.toIri()`;
        break;
      case "rdfjs.BlankNode | rdfjs.NamedNode":
        expression = `${resourceValueVariable}.toIdentifier()`;
        break;
      default:
        throw new Error(`not implemented: ${this.name}`);
    }
    this.hasValue.ifJust((hasValue) => {
      expression = `${expression}.chain<rdfjsResource.Resource.ValueError, ${this.name}>(_identifier => _identifier.equals(${this.rdfJsTermExpression(hasValue)}) ? purify.Either.of(_identifier) : purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: _identifier, expectedValueType: "${hasValue.termType}", focusResource: ${resourceVariable}, predicate: ${this.rdfJsTermExpression(predicate)} })))`;
    });
    return expression;
  }

  override hashStatements({
    hasherVariable,
    propertyValueVariable,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `${hasherVariable}.update(rdfjsResource.Identifier.toString(${propertyValueVariable}));`,
    ];
  }
}
