import type { NamedNode } from "@rdfjs/types";
import { NodeKind } from "@shaclmate/shacl-ast";
import { rdf } from "@tpluscode/rdf-ns-builders";
import { Maybe } from "purify-ts";
import type { MintingStrategy } from "../../enums/index.js";
import { Import } from "./Import.js";
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
    this.mintingStrategy = mintingStrategy.orDefault("sha256");
    this.rdfType = rdfType;
  }

  override get conversions(): readonly Type.Conversion[] {
    return [
      {
        conversionExpression: (value) => value,
        sourceTypeCheckExpression: (value) => `Array.isArray(${value})`,
        sourceTypeName: this.name,
      },
    ];
  }

  override get discriminatorProperty(): Maybe<Type.DiscriminatorProperty> {
    return Maybe.empty();
  }

  override get name(): string {
    return `readonly ${this.itemType.name}[]`;
  }

  override get useImports(): readonly Import[] {
    const imports: Import[] = this.itemType.useImports.concat();
    if (this.identifierNodeKind === NodeKind.IRI) {
      imports.push(Import.SHA256);
    }
    return imports;
  }

  override propertyChainSparqlGraphPatternExpression({
    variables,
  }: Parameters<
    Type["propertyChainSparqlGraphPatternExpression"]
  >[0]): Maybe<Type.SparqlGraphPatternsExpression> {
    return Maybe.of(
      new Type.SparqlGraphPatternsExpression(
        `new sparqlBuilder.RdfListGraphPatterns({ ${this.itemType
          .propertyChainSparqlGraphPatternExpression({
            variables: {
              subject: "_itemVariable",
            },
          })
          .map(
            (itemSparqlGraphPatternsExpression) =>
              `itemGraphPatterns: (_itemVariable) => ${itemSparqlGraphPatternsExpression.toSparqlGraphPatternsExpression()}, `,
          )
          .orDefault("")} rdfList: ${variables.subject} })`,
      ),
    );
  }

  override propertyEqualsFunction(): string {
    return `((left, right) => purifyHelpers.Arrays.equals(left, right, ${this.itemType.propertyEqualsFunction()}))`;
  }

  override propertyFromRdfExpression({
    variables,
  }: Parameters<Type["propertyFromRdfExpression"]>[0]): string {
    return `${variables.resourceValues}.head().chain(value => value.toList()).map(values => values.flatMap(_value => ${this.itemType.propertyFromRdfExpression({ variables: { ...variables, resourceValues: "_value.toValues()" } })}.toMaybe().toList()))`;
  }

  override propertyHashStatements({
    depth,
    variables,
  }: Parameters<Type["propertyHashStatements"]>[0]): readonly string[] {
    return [
      `for (const _element${depth} of ${variables.value}) { ${this.itemType.propertyHashStatements({ depth: depth + 1, variables: { ...variables, value: `_element${depth}` } }).join("\n")} }`,
    ];
  }

  override propertyToRdfExpression({
    variables,
  }: Parameters<Type["propertyToRdfExpression"]>[0]): string {
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
          case "sha256":
            listIdentifier = `dataFactory.namedNode(\`urn:shaclmate:list:\${${variables.value}.reduce(
        (_hasher, _item) => {
          ${this.itemType.propertyHashStatements({ depth: 0, variables: { hasher: "_hasher", value: "_item" } })}
          return _hasher;
        },
        sha256.create(),
      )}\`)`;
            break;
          case "uuidv4":
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

    return `${variables.value}.reduce(({ currentSubListResource, listResource }, item, itemIndex, list) => {
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
        
    currentSubListResource.add(dataFactory.namedNode("${rdf.first.value}"), ${this.itemType.propertyToRdfExpression({ variables: { mutateGraph: variables.mutateGraph, predicate: `dataFactory.namedNode("${rdf.first.value}")`, resource: "currentSubListResource", resourceSet: variables.resourceSet, value: "item" } })});

    if (itemIndex + 1 === list.length) {
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
