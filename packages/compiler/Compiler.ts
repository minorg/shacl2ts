import PrefixMap from "@rdfjs/prefix-map/PrefixMap.js";
import type { DatasetCore } from "@rdfjs/types";
import type { Either } from "purify-ts";
import { ShapesGraphToAstTransformer } from "./ShapesGraphToAstTransformer.js";
import type { Generator } from "./generators/Generator.js";
import { ShapesGraph } from "./input/ShapesGraph.js";

export class Compiler {
  private readonly generator: Generator;
  private readonly iriPrefixMap: PrefixMap;

  constructor({
    generator,
    iriPrefixMap,
  }: { generator: Generator; iriPrefixMap?: PrefixMap }) {
    this.generator = generator;
    this.iriPrefixMap = iriPrefixMap ?? new PrefixMap();
  }

  compile(input: DatasetCore | ShapesGraph): Either<Error, string> {
    const shapesGraph =
      input instanceof ShapesGraph
        ? input
        : new ShapesGraph({ dataset: input });

    const astEither = new ShapesGraphToAstTransformer({
      iriPrefixMap: this.iriPrefixMap,
      shapesGraph,
    }).transform();

    return astEither.map((ast) => this.generator.generate(ast));
  }
}
