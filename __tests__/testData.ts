import { Parser, Store } from "n3";
import { DatasetCore, NamedNode } from "@rdfjs/types";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ShapesGraph } from "shacl-ast";

const iriPrefixes: Record<string, NamedNode> = {};

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
      (prefix, prefixNode) => (iriPrefixes[prefix] = prefixNode),
    ),
  );
  return store;
}

export const testData = {
  dataGraph: parseTurtleFile("testDataGraph.ttl"),
  iriPrefixes,
  shapesGraph: ShapesGraph.fromDataset(parseTurtleFile("testShapesGraph.ttl")),
};
