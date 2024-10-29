import * as fs from "node:fs";
import PrefixMap, { type PrefixMapInit } from "@rdfjs/prefix-map/PrefixMap";
import {
  array,
  command,
  multioption,
  oneOf,
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
import * as generators from "./generators";
import { Configuration } from "./generators/ts/Configuration";
import { logger } from "./logger.js";
import { dashDataset } from "./vocabularies/dashDataset";

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
  for (const quad of dashDataset) {
    dataset.add(quad);
  }
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
      generate: command({
        name: "generate",
        description: "generate TypeScript for the SHACL Shapes Graph AST",
        args: {
          features: multioption({
            description: "generator features to enable",
            long: "feature",
            type: array(
              oneOf([
                "class",
                "equals",
                "fromRdf",
                "toRdf",
                "sparql-graph-patterns",
              ]),
            ),
          }),
          inputFilePaths,
          outputFilePath,
          objectTypeDiscriminatorPropertyName: option({
            defaultValue: () => "",
            description:
              "name of a property to add to generated object types to discriminate them with a string enum",
            long: "object-type-discriminator-property-name",
            type: string,
          }),
          objectTypeIdentifierPropertyName: option({
            defaultValue: () => "",
            description:
              "name of a property to add to generated object types to discriminate them with a string enum",
            long: "object-type-discriminator-property-name",
            type: string,
          }),
        },
        handler: async ({
          features,
          inputFilePaths,
          objectTypeIdentifierPropertyName,
          objectTypeDiscriminatorPropertyName,
          outputFilePath,
        }) => {
          writeOutput(
            new generators.ts.TsGenerator(
              readInput(inputFilePaths),
              new Configuration({
                features: new Set(features) as Configuration["features"],
                objectTypeIdentifierPropertyName:
                  objectTypeIdentifierPropertyName?.length > 0
                    ? objectTypeIdentifierPropertyName
                    : undefined,
                objectTypeDiscriminatorPropertyName:
                  objectTypeDiscriminatorPropertyName?.length > 0
                    ? objectTypeDiscriminatorPropertyName
                    : undefined,
              }),
            ).generate(),
            outputFilePath,
          );
        },
      }),
      "show-ast-json": command({
        name: "show-ast-json",
        description: "show AST JSON for the SHACL Shapes Graph AST",
        args: {
          inputFilePaths,
          outputFilePath,
        },
        handler: async ({ inputFilePaths, outputFilePath }) => {
          writeOutput(
            new generators.json.AstJsonGenerator(
              readInput(inputFilePaths),
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
