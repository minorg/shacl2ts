import type { Term as RdfjsTerm } from "@rdfjs/types";
import type * as ast from "../../ast";

namespace AstJson {
  export interface Name {
    [index: string]: boolean | number | object | string | undefined;
    identifier: Term;
  }

  export interface Term {
    [index: string]: string;
    termType: RdfjsTerm["termType"];
    value: string;
  }

  export interface Type {
    [index: string]: boolean | number | object | string | undefined;
    kind: ast.Type["kind"];
  }
}

function nameToJson(name: ast.Name): AstJson.Name {
  return {
    curie: name.curie.extract(),
    identifier: termToJson(name.identifier),
    shName: name.shName.extract(),
    shacl2tsName: name.shacl2tsName.extract(),
    tsName: name.tsName,
  };
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
    case "And":
    case "Or":
      return {
        kind: type.kind,
        types: type.types.map((type) => typeToJson(type)),
      };
    case "Enum":
      return {
        kind: type.kind,
        members: type.members.map((term) => termToJson(term)),
      };
    case "Literal": {
      return {
        datatype: type.datatype.extract(),
        hasValue: type.hasValue.map(termToJson).extract(),
        kind: type.kind,
        maxExclusive: type.maxExclusive.map(termToJson).extract(),
        maxInclusive: type.maxInclusive.map(termToJson).extract(),
        minExclusive: type.minExclusive.map(termToJson).extract(),
        minInclusive: type.minInclusive.map(termToJson).extract(),
        name: nameToJson(type.name),
      } satisfies AstJson.Type & { name: AstJson.Name };
    }
    case "Object":
      return {
        kind: type.kind,
        name: nameToJson(type.name),
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
