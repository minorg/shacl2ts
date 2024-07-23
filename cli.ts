import {
  command,
  run,
  restPositionals,
  option,
  string,
  subcommands,
} from "cmd-ts";
import { ExistingPath } from "cmd-ts/dist/esm/batteries/fs.js";
import * as fs from "node:fs";
import { Ast } from "./ast";
import { ShapesGraph } from "shacl-ast";
import { ShapesGraphToAstTransformer } from "./ShapesGraphToAstTransformer.js";
import { Parser, Store } from "n3";
import { AstJsonGenerator } from "./generators";

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

function readShapesGraph(inputFilePaths: readonly string[]): ShapesGraph {
  if (inputFilePaths.length === 0) {
    throw new Error("must specify at least one input shapes graph file path");
  }

  const parser = new Parser();
  const store = new Store();
  for (const inputFilePath of inputFilePaths) {
    store.addQuads(parser.parse(fs.readFileSync(inputFilePath).toString()));
  }
  return ShapesGraph.fromDataset(store);
}

function transformShapesGraphToAst(shapesGraph: ShapesGraph): Ast {
  return new ShapesGraphToAstTransformer(shapesGraph)
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
            new AstJsonGenerator(
              transformShapesGraphToAst(readShapesGraph(inputFilePaths)),
            ).generate(),
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
