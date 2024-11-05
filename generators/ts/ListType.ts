import type { NamedNode } from "@rdfjs/types";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import { NodeKind } from "shacl-ast";
import type { RdfjsTermType } from "./RdfjsTermType.js";
import { Type } from "./Type.js";

export class ListType extends Type {
  readonly itemType: Type;
  readonly kind = "List";
  private readonly identifierNodeKind: NodeKind.BLANK_NODE | NodeKind.IRI;
  private readonly rdfType: Maybe<NamedNode>;

  constructor({
    identifierNodeKind,
    itemType,
    rdfType,
    ...superParameters
  }: {
    identifierNodeKind: ListType["identifierNodeKind"];
    itemType: Type;
    rdfType: Maybe<NamedNode>;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.identifierNodeKind = identifierNodeKind;
    this.itemType = itemType;
    this.rdfType = rdfType;
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get name(): string {
    return `readonly ${this.itemType.name}[]`;
  }

  override equalsFunction(): string {
    return `(left, right) => purifyHelpers.Arrays.equals(left, right, ${this.itemType.equalsFunction()})`;
  }

  override fromRdfExpression({
    resourceValueVariable,
    ...otherParameters
  }: Parameters<Type["fromRdfExpression"]>[0]): string {
    return `${resourceValueVariable}.toList().map(values => values.flatMap(value => ${this.itemType.fromRdfExpression({ resourceValueVariable: "value", ...otherParameters })}.toMaybe().toList()))`;
  }

  override hashStatements({
    hasherVariable,
    valueVariable,
  }: Parameters<RdfjsTermType["hashStatements"]>[0]): readonly string[] {
    return [
      `for (const _element of ${valueVariable}) { ${this.itemType.hashStatements({ hasherVariable, valueVariable: "_element" }).join("\n")} }`,
    ];
  }

  override importStatements(): readonly string[] {
    if (this.identifierNodeKind === NodeKind.IRI) {
      return ['import { sha256 } from "js-sha256";'];
    }
    return [];
  }

  override sparqlGraphPatternExpression({
    subjectVariable,
  }: Parameters<
    Type["sparqlGraphPatternExpression"]
  >[0]): Maybe<Type.SparqlGraphPatternExpression> {
    const itemVariable = "itemVariable";
    return this.itemType
      .sparqlGraphPatternExpression({
        subjectVariable: itemVariable,
      })
      .map((itemSparqlGraphPatternExpression) => {
        return {
          type: "GraphPatterns" as const,
          value: `new sparqlBuilder.RdfListGraphPatterns({ itemGraphPatterns: (itemVariable) => ${itemSparqlGraphPatternExpression.type === "GraphPatterns" ? itemSparqlGraphPatternExpression.value : `[${itemSparqlGraphPatternExpression.value}]`}, rdfList: ${subjectVariable} })`,
        };
      })
      .altLazy(() =>
        Maybe.of({
          type: "GraphPatterns" as const,
          value: `new sparqlBuilder.RdfListGraphPatterns({ rdfList: ${subjectVariable} })`,
        }),
      );
  }

  override toRdfExpression({
    mutateGraphVariable,
    resourceSetVariable,
    valueVariable,
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
        listIdentifier = `dataFactory.namedNode(\`urn:shacl2ts:list:\${${valueVariable}.reduce(
        (hasher, item) => {
          ${this.itemType.hashStatements({ hasherVariable: "hasher", valueVariable: "item" })}
          return hasher;
        },
        sha256.create(),
      )}\`)`;
        mutableResourceTypeName =
          "rdfjsResource.MutableResource<rdfjs.NamedNode>";
        resourceSetMethodName = "mutableNamedResource";
        subListIdentifier =
          "dataFactory.namedNode(`${listResource.identifier.value}:${itemIndex}`)";
        break;
      }
    }

    return `\
${valueVariable}.reduce(
  ({ currentSubListResource, listResource }, item, itemIndex) => {
    if (itemIndex === 0) {
      currentSubListResource = listResource;
    } else {
      const newSubListResource = ${resourceSetVariable}.${resourceSetMethodName}({
        identifier: ${subListIdentifier},
        mutateGraph: ${mutateGraphVariable},
      });
      currentSubListResource!.add(dataFactory.namedNode("${rdf.rest.value}"), newSubListResource.identifier);
      currentSubListResource = newSubListResource;
    }
    
    ${this.rdfType.map((rdfType) => `currentSubListResource.add(dataFactory.namedNode("${rdf.type.value}"), dataFactory.namedNode("${rdfType.value}"))`).orDefault("")}
        
    currentSubListResource.add(dataFactory.namedNode("${rdf.first.value}"), ${this.itemType.toRdfExpression({ mutateGraphVariable, resourceSetVariable, valueVariable: "item" })});

    if (itemIndex + 1 === ${valueVariable}.length) {
      currentSubListResource.add(dataFactory.namedNode("${rdf.rest.value}"), dataFactory.namedNode("${rdf.nil.value}"));
    }
    
    return { currentSubListResource, listResource };
  },
  {
    currentSubListResource: null,
    listResource: resourceSet.${resourceSetMethodName}({
      identifier: ${listIdentifier},
      mutateGraph: ${mutateGraphVariable}
    }),
  } as {
    currentSubListResource: ${mutableResourceTypeName} | null;
    listResource: rdfjsResource.MutableResource;
  },
).listResource.identifier,
`;
  }
}
