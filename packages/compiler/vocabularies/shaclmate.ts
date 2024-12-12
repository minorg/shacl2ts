import namespace, { type NamespaceBuilder } from "@rdfjs/namespace";
import type { NamedNode } from "@rdfjs/types";

export interface Shaclmate {
  "": NamedNode<"http://minorg.github.io/shaclmate/ns#">;

  // Resources
  Private: NamedNode<"http://minorg.github.io/shaclmate/ns#Private">;
  Protected: NamedNode<"http://minorg.github.io/shaclmate/ns#Protected">;
  Public: NamedNode<"http://minorg.github.io/shaclmate/ns#Public">;
  SHA256: NamedNode<"http://minorg.github.io/shaclmate/ns#SHA256">;
  UUIDv4: NamedNode<"http://minorg.github.io/shaclmate/ns#UUIDv4">;

  // Properties
  abstract: NamedNode<"http://minorg.github.io/shaclmate/ns#abstract">;
  export: NamedNode<"http://minorg.github.io/shaclmate/ns#export">;
  inline: NamedNode<"http://minorg.github.io/shaclmate/ns#inline">;
  mintingStrategy: NamedNode<"http://minorg.github.io/shaclmate/ns#mintingStrategy">;
  name: NamedNode<"http://minorg.github.io/shaclmate/ns#name">;
  native: NamedNode<"http://minorg.github.io/shaclmate/ns#native">;
  tsEqualsFunction: NamedNode<"http://minorg.github.io/shaclmate/ns#tsEqualsFunction">;
  tsFromRdfFunction: NamedNode<"http://minorg.github.io/shaclmate/ns#tsFromRdfFunction">;
  tsHashFunction: NamedNode<"http://minorg.github.io/shaclmate/ns#tsHashFunction">;
  tsImport: NamedNode<"http://minorg.github.io/shaclmate/ns#tsImport">;
  tsName: NamedNode<"http://minorg.github.io/shaclmate/ns#tsName">;
  tsToRdfFunction: NamedNode<"http://minorg.github.io/shaclmate/ns#tsToRdfFunction">;
  visibility: NamedNode<"http://minorg.github.io/shaclmate/ns#visibility">;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const builder = namespace("http://minorg.github.io/shaclmate/ns#") as any;
export const strict = builder as NamespaceBuilder<keyof Shaclmate> & Shaclmate;
export const loose = builder as NamespaceBuilder & Shaclmate;
