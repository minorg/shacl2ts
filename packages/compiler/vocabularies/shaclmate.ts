import namespace, { type NamespaceBuilder } from "@rdfjs/namespace";
import type { NamedNode } from "@rdfjs/types";

export interface Shaclmate {
  "": NamedNode<"http://minorg.github.io/shaclmate/ns#">;

  // Resources
  _MintingStrategy_SHA256: NamedNode<"http://minorg.github.io/shaclmate/ns#_MintingStrategy_SHA256">;
  _MintingStrategy_UUIDv4: NamedNode<"http://minorg.github.io/shaclmate/ns#_MintingStrategy_UUIDv4">;
  _Visibility_Private: NamedNode<"http://minorg.github.io/shaclmate/ns#_Visibility_Private">;
  _Visibility_Protected: NamedNode<"http://minorg.github.io/shaclmate/ns#_Visibility_Protected">;
  _Visibility_Public: NamedNode<"http://minorg.github.io/shaclmate/ns#_Visibility_Public">;

  // Properties
  abstract: NamedNode<"http://minorg.github.io/shaclmate/ns#abstract">;
  export: NamedNode<"http://minorg.github.io/shaclmate/ns#export">;
  extern: NamedNode<"http://minorg.github.io/shaclmate/ns#extern">;
  mintingStrategy: NamedNode<"http://minorg.github.io/shaclmate/ns#mintingStrategy">;
  name: NamedNode<"http://minorg.github.io/shaclmate/ns#name">;
  tsFromRdfParameter: NamedNode<"http://minorg.github.io/shaclmate/ns#tsFromRdfParameter">;
  tsImport: NamedNode<"http://minorg.github.io/shaclmate/ns#tsImport">;
  visibility: NamedNode<"http://minorg.github.io/shaclmate/ns#visibility">;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const builder = namespace("http://minorg.github.io/shaclmate/ns#") as any;
export const strict = builder as NamespaceBuilder<keyof Shaclmate> & Shaclmate;
export const loose = builder as NamespaceBuilder & Shaclmate;
