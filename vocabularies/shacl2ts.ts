import namespace, { type NamespaceBuilder } from "@rdfjs/namespace";
import type { NamedNode } from "@rdfjs/types";

export interface Shacl2ts {
  "": NamedNode<"http://minorg.github.io/shaclmate/ns#">;

  // Properties
  inline: NamedNode<"http://minorg.github.io/shaclmate/ns#inline">;
  name: NamedNode<"http://minorg.github.io/shaclmate/ns#name">;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const builder = namespace("http://minorg.github.io/shaclmate/ns#") as any;
export const strict = builder as NamespaceBuilder<keyof Shacl2ts> & Shacl2ts;
export const loose = builder as NamespaceBuilder & Shacl2ts;
