import * as fs from "node:fs";
import PrefixMap, { type PrefixMapInit } from "@rdfjs/prefix-map/PrefixMap";
import {
  command,
  option,
  restPositionals,
  run,
  string,
  subcommands,
} from "cmd-ts";
import { ExistingPath } from "cmd-ts/dist/esm/batteries/fs.js";
import { DataFactory, Parser, Store } from "n3";
import { ShapesGraph } from "shacl-ast";
import { ShapesGraphToAstTransformer } from "./ShapesGraphToAstTransformer.js";
import type { Ast } from "./ast";
import { AstJsonGenerator } from "./generators";
import { logger } from "./logger.js";

const inputFilePaths = restPositionals({
  displayName: "inputFilePaths",
  description: "paths to RDF files containing SHACL shapes",
  type: ExistingPath,
});

const outputFilePath = option({
  defaultValue: () => "",
  description:
    "path to a file to write output to; if not specified, write to stdout",
  long: "output-path",
  short: "o",
  type: string,
});

function readInput(inputFilePaths: readonly string[]) {
  if (inputFilePaths.length === 0) {
    throw new Error("must specify at least one input shapes graph file path");
  }

  const inputParser = new Parser();
  const dataset = new Store();
  const iriPrefixes: PrefixMapInit = [];
  for (const inputFilePath of inputFilePaths) {
    dataset.addQuads(
      inputParser.parse(
        fs.readFileSync(inputFilePath).toString(),
        null,
        (prefix, prefixNode) => {
          const existingIriPrefix = iriPrefixes.find(
            (iriPrefix) =>
              iriPrefix[0] === prefix || iriPrefix[1].equals(prefixNode),
          );
          if (existingIriPrefix) {
            if (
              existingIriPrefix[0] !== prefix ||
              !existingIriPrefix[1].equals(prefixNode)
            ) {
              logger.warn(
                "conflicting prefix %s: %s",
                prefix,
                prefixNode.value,
              );
            }
            return;
          }

          iriPrefixes.push([prefix, prefixNode]);
        },
      ),
    );
  }
  const shapesGraph = ShapesGraph.fromDataset(dataset);

  return new ShapesGraphToAstTransformer({
    iriPrefixMap: new PrefixMap(iriPrefixes, { factory: DataFactory }),
    shapesGraph,
  })
    .transform()
    .ifLeft((error) => {
      throw error;
    })
    .extract() as Ast;
}

function writeOutput(output: string, outputFilePath: string) {
  if (outputFilePath.length === 0) {
    process.stdout.write(output);
  } else {
    fs.writeFileSync(outputFilePath, output);
  }
}

run(
  subcommands({
    cmds: {
      "ast-json": command({
        name: "ast-json",
        description: "generate JSON for the SHACL Shapes Graph AST",
        args: {
          inputFilePaths,
          outputFilePath,
        },
        handler: async ({ inputFilePaths, outputFilePath }) => {
          writeOutput(
            new AstJsonGenerator(readInput(inputFilePaths)).generate(),
            outputFilePath,
          );
        },
      }),
    },
    description: "shacl2ts command line interface",
    name: "shacl2ts",
  }),
  process.argv.slice(2),
);
