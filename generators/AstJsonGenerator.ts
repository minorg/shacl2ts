import type { Term as RdfjsTerm } from "@rdfjs/types";
import type * as ast from "../ast";

namespace AstJson {
  export interface Name {
    [index: string]: any;
    identifier: Term;
  }

  export interface Term {
    [index: string]: any;
    termType: RdfjsTerm["termType"];
    value: string;
  }

  export interface Type {
    [index: string]: any;
    kind: ast.Type["kind"];
  }
}

export class AstJsonGenerator {
  constructor(private readonly ast: ast.Ast) {}

  generate(): string {
    return JSON.stringify(
      {
        objectTypes: this.ast.objectTypes.map((objectType) => ({
          kind: objectType.kind,
          name: this.nameToJson(objectType.name),
          properties: objectType.properties.map((property) => {
            const json: any = {
              name: this.nameToJson(property.name),
              path: property.path.iri.value,
              type: this.typeToJson(property.type),
            };
            property.maxCount.ifJust(
              (maxCount) => (json["maxCount"] = maxCount),
            );
            property.maxCount.ifJust(
              (minCount) => (json["minCount"] = minCount),
            );
            return json;
          }),
        })),
      },
      undefined,
      2,
    );
  }

  private nameToJson(name: ast.Name): AstJson.Name {
    const json: AstJson.Name = {
      identifier: this.termToJson(name.identifier),
      tsName: name.tsName,
    };
    name.curie.ifJust((curie) => (json["curie"] = curie));
    name.shName.ifJust((shName) => (json["shName"] = shName));
    name.shacl2tsName.ifJust(
      (shacl2tsName) => (json["shacl2tsName"] = shacl2tsName),
    );
    return json;
  }

  private termToJson(term: RdfjsTerm): AstJson.Term {
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

  private typeToJson(type: ast.Type): AstJson.Type {
    switch (type.kind) {
      case "And":
      case "Or":
        return {
          kind: type.kind,
          types: type.types.map((type) => this.typeToJson(type)),
        };
      case "Enum":
        return {
          kind: type.kind,
          members: type.members.map((term) => this.termToJson(term)),
        };
      case "Literal": {
        const json: AstJson.Type & { name: AstJson.Name } = {
          kind: type.kind,
          name: this.nameToJson(type.name),
        };
        type.datatype.ifJust((datatype) => (json["datatype"] = datatype));
        type.hasValue.ifJust(
          (hasValue) => (json["hasValue"] = this.termToJson(hasValue)),
        );
        type.maxExclusive.ifJust(
          (maxExclusive) =>
            (json["maxExclusive"] = this.termToJson(maxExclusive)),
        );
        type.maxInclusive.ifJust(
          (maxInclusive) =>
            (json["maxInclusive"] = this.termToJson(maxInclusive)),
        );
        type.minExclusive.ifJust(
          (minExclusive) =>
            (json["minExclusive"] = this.termToJson(minExclusive)),
        );
        type.minInclusive.ifJust(
          (minInclusive) =>
            (json["minInclusive"] = this.termToJson(minInclusive)),
        );
        return json;
      }
      case "Object":
        return {
          kind: type.kind,
          name: this.nameToJson(type.name),
        };
    }
  }
}
