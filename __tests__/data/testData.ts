import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PrefixMap, { type PrefixMapInit } from "@rdfjs/prefix-map/PrefixMap";
import type { DatasetCore } from "@rdfjs/types";
import { DataFactory, Parser, Store } from "n3";
import { ShapesGraph } from "shacl-ast";
import { ShapesGraphToAstTransformer } from "../../ShapesGraphToAstTransformer.js";
import type { Ast } from "../../ast";

const iriPrefixes: PrefixMapInit = [];

interface TestData {
  ast: Ast;
  dataGraph: DatasetCore;
  shapesGraph: ShapesGraph;
}

function parseTestData(fileStem: string): TestData {
  const dataGraph = parseTurtleFile(`${fileStem}.data.ttl`);
  const shapesGraph = ShapesGraph.fromDataset(
    parseTurtleFile(`${fileStem}.shapes.ttl`),
  );
  const iriPrefixMap = new PrefixMap(iriPrefixes, { factory: DataFactory });
  const ast = new ShapesGraphToAstTransformer({
    iriPrefixMap,
    shapesGraph,
  })
    .transform()
    .extract();
  if (ast instanceof Error) {
    throw ast;
  }
  return {
    ast,
    dataGraph,
    shapesGraph,
  };
}

function parseTurtleFile(fileName: string): DatasetCore {
  const parser = new Parser({ format: "Turtle" });
  const store = new Store();
  store.addQuads(
    parser.parse(
      fs
        .readFileSync(
          path.join(path.dirname(fileURLToPath(import.meta.url)), fileName),
        )
        .toString(),
      null,
      (prefix, prefixNode) => iriPrefixes.push([prefix, prefixNode]),
    ),
  );
  return store;
}

export function testData(): {
  // schema.org test data
  sdo: TestData;
} {
  return {
    sdo: parseTestData("sdo"),
  };
}
