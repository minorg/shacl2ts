import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DatasetCore } from "@rdfjs/types";
import { Parser, Store } from "n3";

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
    ),
  );
  return store;
}

export const testData = {
  shapesGraph: parseTurtleFile("testShapesGraph.ttl"),
};
