import type { BlankNode, NamedNode } from "@rdfjs/types";
import { NodeKind } from "@shaclmate/shacl-ast";
import { Maybe } from "purify-ts";
import { invariant } from "ts-invariant";
import { Memoize } from "typescript-memoize";
import { Import } from "./Import.js";
import { RdfjsTermType } from "./RdfjsTermType.js";
import type { Type } from "./Type.js";

export class IdentifierType extends RdfjsTermType<
  BlankNode | NamedNode,
  NamedNode
> {
  readonly jsonDeclaration = "string";
  readonly kind = "IdentifierType";
  readonly nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;

  constructor({
    nodeKinds,
    ...superParameters
  }: {
    nodeKinds: Set<NodeKind.BLANK_NODE | NodeKind.IRI>;
  } & ConstructorParameters<
    typeof RdfjsTermType<BlankNode | NamedNode, NamedNode>
  >[0]) {
    super(superParameters);
    this.nodeKinds = new Set([...nodeKinds]);
    invariant(this.nodeKinds.size > 0);
  }

  override get conversions(): readonly Type.Conversion[] {
    const conversions: Type.Conversion[] = [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) => `typeof ${value} === "object"`,
        sourceTypeName: this.name,
      },
    ];

    this.defaultValue.ifJust((defaultValue) =>
      conversions.push({
        conversionExpression: () => this.rdfjsTermExpression(defaultValue),
        sourceTypeCheckExpression: (value) => `typeof ${value} === "undefined"`,
        sourceTypeName: "undefined",
      }),
    );

    return conversions;
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
    if (this.in_.isJust() && this.isNamedNodeKind) {
      // Treat sh:in as a union of the IRIs
      // rdfjs.NamedNode<"http://example.com/1" | "http://example.com/2">
      return `rdfjs.NamedNode<${this.in_
        .unsafeCoerce()
        .map((iri) => `"${iri.value}"`)
        .join(" | ")}>`;
    }

    const names: string[] = [];
    if (this.nodeKinds.has(NodeKind.BLANK_NODE)) {
      names.push("rdfjs.BlankNode");
    }
    if (this.nodeKinds.has(NodeKind.IRI)) {
      names.push("rdfjs.NamedNode");
    }
    return names.join(" | ");
  }

  get useImports(): readonly Import[] {
    return [Import.RDFJS_TYPES];
  }

  override propertyHashStatements({
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [
      `${variables.hasher}.update(rdfjsResource.Resource.Identifier.toString(${variables.value}));`,
    ];
  }

  override propertyToJsonExpression({
    variables,
  }: Parameters<Type["propertyToJsonExpression"]>[0]): string {
    return `${variables.value}.value`;
  }

  protected override fromRdfResourceValueExpression({
    variables,
  }: Parameters<
    RdfjsTermType<
      BlankNode | NamedNode,
      NamedNode
    >["fromRdfResourceValueExpression"]
  >[0]): string {
    if (this.nodeKinds.size === 2) {
      return `${variables.resourceValue}.toIdentifier()`;
    }

    if (this.isNamedNodeKind) {
      let expression = `${variables.resourceValue}.toIri()`;
      this.in_.ifJust((in_) => {
        expression = `${expression}.chain(iri => { switch (iri.value) { ${in_.map((iri) => `case "${iri.value}": return purify.Either.of<rdfjsResource.Resource.ValueError, ${this.name}>(iri as rdfjs.NamedNode<"${iri.value}">);`).join(" ")} default: return purify.Left(new rdfjsResource.Resource.MistypedValueError({ actualValue: iri, expectedValueType: ${JSON.stringify(this.name)}, focusResource: ${variables.resource}, predicate: ${variables.predicate} })); } } )`;
      });
      return expression;
    }

    throw new Error(`not implemented: ${this.name}`);
  }
}
