import type { Term as RdfjsTerm } from "@rdfjs/types";
import * as shaclAst from "shacl-ast";
import type * as ast from "../../ast";

namespace AstJson {
  export interface Name {
    identifier: Term;

    [index: string]: boolean | number | object | string | undefined;
  }

  export interface Term {
    termType: RdfjsTerm["termType"];
    value: string;

    [index: string]: string;
  }

  export interface Type {
    kind: ast.Type["kind"];

    [index: string]: boolean | number | object | string | undefined;
  }
}

function nameToJson(name: ast.Name): AstJson.Name {
  return {
    curie: name.curie.extract(),
    identifier: termToJson(name.identifier),
    shName: name.shName.extract(),
    shaclmateName: name.shaclmateName.extract(),
  };
}

function nodeKindToJson(nodeKind: shaclAst.NodeKind): string {
  switch (nodeKind) {
    case shaclAst.NodeKind.BLANK_NODE:
      return "BlankNode";
    case shaclAst.NodeKind.IRI:
      return "NamedNode";
    case shaclAst.NodeKind.LITERAL:
      return "Literal";
  }
}

function termToJson(term: RdfjsTerm): AstJson.Term {
  switch (term.termType) {
    case "BlankNode":
      return { termType: term.termType, value: term.value };
    case "Literal":
      return {
        datatype: term.datatype.value,
        language: term.language,
        termType: term.termType,
        value: term.value,
      };
    case "NamedNode":
      return { termType: term.termType, value: term.value };
    default:
      throw new Error(`unsupported term type: ${term.termType}`);
  }
}

function typeToJson(type: ast.Type): AstJson.Type {
  switch (type.kind) {
    case "IdentifierType":
      return {
        kind: type.kind,
        nodeKinds: [...type.nodeKinds].map(nodeKindToJson),
      };
    case "IntersectionType":
    case "UnionType":
      return {
        kind: type.kind,
        types: type.types.map((type) => typeToJson(type)),
      };
    case "LiteralType": {
      return {
        datatype: type.datatype.extract(),
        kind: type.kind,
        maxExclusive: type.maxExclusive.map(termToJson).extract(),
        maxInclusive: type.maxInclusive.map(termToJson).extract(),
        minExclusive: type.minExclusive.map(termToJson).extract(),
        minInclusive: type.minInclusive.map(termToJson).extract(),
      } satisfies AstJson.Type;
    }
    case "ObjectType":
      return {
        kind: type.kind,
        listItemType: type.listItemType.map(typeToJson).extract(),
        name: nameToJson(type.name),
        parentObjectTypes: type.parentObjectTypes.map(typeToJson),
        nodeKinds: [...type.nodeKinds].map(nodeKindToJson),
        rdfType: type.rdfType.map(termToJson).extract(),
      };
  }
}

export class AstJsonGenerator {
  constructor(private readonly ast: ast.Ast) {}

  generate(): string {
    return JSON.stringify(
      {
        objectTypes: this.ast.objectTypes.map((objectType) => ({
          kind: objectType.kind,
          name: nameToJson(objectType.name),
          properties: objectType.properties.map((property) => ({
            hasValue: property.hasValue.map(termToJson).extract(),
            maxCount: property.maxCount.extract(),
            minCount: property.minCount,
            name: nameToJson(property.name),
            path: property.path.iri.value,
            type: typeToJson(property.type),
          })),
        })),
      },
      undefined,
      2,
    );
  }
}
