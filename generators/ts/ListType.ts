import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { NodeKind } from "shacl-ast";
import { MintingStrategy } from "../../ast";
import { Type } from "./Type.js";

export class ListType extends Type {
  readonly itemType: Type;
  readonly kind = "ListType";
  private readonly identifierNodeKind: NodeKind.BLANK_NODE | NodeKind.IRI;
  private readonly mintingStrategy: MintingStrategy;
  private readonly rdfType: Maybe<NamedNode>;

  constructor({
    identifierNodeKind,
    itemType,
    mintingStrategy,
    rdfType,
    ...superParameters
  }: {
    identifierNodeKind: ListType["identifierNodeKind"];
    itemType: Type;
    mintingStrategy: Maybe<MintingStrategy>;
    rdfType: Maybe<NamedNode>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.identifierNodeKind = identifierNodeKind;
    this.itemType = itemType;
    this.mintingStrategy = mintingStrategy.orDefault(MintingStrategy.SHA256);
    this.rdfType = rdfType;
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get importStatements(): readonly string[] {
    if (this.identifierNodeKind === NodeKind.IRI) {
      return ['import { sha256 } from "js-sha256";'];
    }
    return [];
  }

  override get name(): string {
    return `readonly ${this.itemType.name}[]`;
  }

  override equalsFunction(): string {
    return `(left, right) => purifyHelpers.Arrays.equals(left, right, ${this.itemType.equalsFunction()})`;
  }

  override fromRdfResourceValueExpression({
    variables,
  }: Parameters<Type["fromRdfResourceValueExpression"]>[0]): string {
    return `${variables.resourceValue}.toList().map(values => values.flatMap(value => ${this.itemType.fromRdfResourceValueExpression({ variables: { ...variables, resourceValue: "value" } })}.toMaybe().toList()))`;
  }

  override hashStatements({
    variables,
  }: Parameters<Type["hashStatements"]>[0]): readonly string[] {
    return [
      `for (const _element of ${variables.value}) { ${this.itemType.hashStatements({ variables: { ...variables, value: "_element" } }).join("\n")} }`,
    ];
  }

  override sparqlGraphPatternExpression({
    variables,
  }: Parameters<
    Type["sparqlGraphPatternExpression"]
  >[0]): Type.SparqlGraphPatternsExpression {
    let itemGraphPatterns = "";
    const itemTypeSparqlGraphPatternsExpression =
      this.itemType.sparqlGraphPatternExpression({
        variables: {
          predicate: "SHOULDNOTBEUSED",
          object: "SHOULDNOTBEUSED",
          subject: "itemVariable",
        },
      });
    if (
      itemTypeSparqlGraphPatternsExpression instanceof
      Type.SparqlGraphPatternsExpression
    ) {
      itemGraphPatterns = `itemGraphPatterns: (itemVariable) => ${itemTypeSparqlGraphPatternsExpression},`;
    }

    // (itemVariable) => ${itemSparqlGraphPatternExpression.toSparqlGraphPatternsExpression()},
    return new Type.SparqlGraphPatternsExpression(
      `${super.sparqlGraphPatternExpression({ variables })}.chainObject(object => new sparqlBuilder.RdfListGraphPatterns({ ${itemGraphPatterns} rdfList: object }))`,
    );
  }

  override toRdfExpression({
    variables,
  }: Parameters<Type["toRdfExpression"]>[0]): string {
    let listIdentifier: string;
    let mutableResourceTypeName: string;
    let resourceSetMethodName: string;
    let subListIdentifier: string;
    switch (this.identifierNodeKind) {
      case NodeKind.BLANK_NODE: {
        listIdentifier = subListIdentifier = "dataFactory.blankNode()";
        mutableResourceTypeName = "rdfjsResource.MutableResource";
        resourceSetMethodName = "mutableResource";
        break;
      }
      case NodeKind.IRI: {
        switch (this.mintingStrategy) {
          case MintingStrategy.SHA256:
            listIdentifier = `dataFactory.namedNode(\`urn:shaclmate:list:\${${variables.value}.reduce(
        (hasher, item) => {
          ${this.itemType.hashStatements({ variables: { hasher: "hasher", value: "item" } })}
          return hasher;
        },
        sha256.create(),
      )}\`)`;
            break;
          case MintingStrategy.UUIDv4:
            listIdentifier =
              "dataFactory.namedNode(`urn:shaclmate:list:${uuid.v4()}`)";
            break;
        }
        mutableResourceTypeName =
          "rdfjsResource.MutableResource<rdfjs.NamedNode>";
        resourceSetMethodName = "mutableNamedResource";
        subListIdentifier =
          "dataFactory.namedNode(`${listResource.identifier.value}:${itemIndex}`)";
        break;
      }
    }

    return `${variables.value}.reduce(({ currentSubListResource, listResource }, item, itemIndex) => {
    if (itemIndex === 0) {
      currentSubListResource = listResource;
    } else {
      const newSubListResource = ${variables.resourceSet}.${resourceSetMethodName}({
        identifier: ${subListIdentifier},
        mutateGraph: ${variables.mutateGraph},
      });
      currentSubListResource!.add(dataFactory.namedNode("${rdf.rest.value}"), newSubListResource.identifier);
      currentSubListResource = newSubListResource;
    }
    
    ${this.rdfType.map((rdfType) => `currentSubListResource.add(dataFactory.namedNode("${rdf.type.value}"), dataFactory.namedNode("${rdfType.value}"))`).orDefault("")}
        
    currentSubListResource.add(dataFactory.namedNode("${rdf.first.value}"), ${this.itemType.toRdfExpression({ variables: { mutateGraph: variables.mutateGraph, predicate: `dataFactory.namedNode("${rdf.first.value}")`, resource: "currentSubListResource", resourceSet: variables.resourceSet, value: "item" } })});

    if (itemIndex + 1 === ${variables.value}.length) {
      currentSubListResource.add(dataFactory.namedNode("${rdf.rest.value}"), dataFactory.namedNode("${rdf.nil.value}"));
    }
    
    return { currentSubListResource, listResource };
  },
  {
    currentSubListResource: null,
    listResource: resourceSet.${resourceSetMethodName}({
      identifier: ${listIdentifier},
      mutateGraph: ${variables.mutateGraph}
    }),
  } as {
    currentSubListResource: ${mutableResourceTypeName} | null;
    listResource: ${mutableResourceTypeName};
  },
).listResource.identifier`;
  }
}
