import type { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { xsd } from "@tpluscode/rdf-ns-builders";

export function rdfjsTermExpression(
  rdfjsTerm: BlankNode | Literal | NamedNode,
  { dataFactoryVariable }: { dataFactoryVariable: string },
): string {
  switch (rdfjsTerm.termType) {
    case "BlankNode":
      return `${dataFactoryVariable}.blankNode("${rdfjsTerm.value}")`;
    case "Literal":
      if (rdfjsTerm.datatype.equals(xsd.string)) {
        return `${dataFactoryVariable}.literal("${rdfjsTerm.value}", "${rdfjsTerm.language}")`;
      }
      return `${dataFactoryVariable}.literal("${rdfjsTerm.value}", ${dataFactoryVariable}.namedNode("${rdfjsTerm.datatype.value}"))`;
    case "NamedNode":
      return `${dataFactoryVariable}.namedNode("${rdfjsTerm.value}")`;
  }
}
