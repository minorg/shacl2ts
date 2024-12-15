import namespace, { type NamespaceBuilder } from "@rdfjs/namespace";
import type { NamedNode } from "@rdfjs/types";

export interface Shaclmate {
  "": NamedNode<"http://minorg.github.io/shaclmate/ns#">;

  // Resources
  _MintingStrategy_SHA256: NamedNode<"http://minorg.github.io/shaclmate/ns#_MintingStrategy_SHA256">;
  _MintingStrategy_UUIDv4: NamedNode<"http://minorg.github.io/shaclmate/ns#_MintingStrategy_UUIDv4">;
  _TsFeature_Equals: NamedNode<"http://minorg.github.io/shaclmate/ns#_TsFeature_Equals">;
  _TsFeature_FromRdf: NamedNode<"http://minorg.github.io/shaclmate/ns#_TsFeature_FromRdf">;
  _TsFeature_SparqlGraphPatterns: NamedNode<"http://minorg.github.io/shaclmate/ns#_TsFeature_SparqlGraphPatterns">;
  _TsFeature_ToRdf: NamedNode<"http://minorg.github.io/shaclmate/ns#_TsFeature_ToRdf">;
  _TsObjectDeclarationType_Class: NamedNode<"http://minorg.github.io/shaclmate/ns#_TsObjectDeclarationType_Class">;
  _TsObjectDeclarationType_Interface: NamedNode<"http://minorg.github.io/shaclmate/ns#_TsObjectDeclarationType_Interface">;
  _Visibility_Private: NamedNode<"http://minorg.github.io/shaclmate/ns#_Visibility_Private">;
  _Visibility_Protected: NamedNode<"http://minorg.github.io/shaclmate/ns#_Visibility_Protected">;
  _Visibility_Public: NamedNode<"http://minorg.github.io/shaclmate/ns#_Visibility_Public">;

  // Properties
  abstract: NamedNode<"http://minorg.github.io/shaclmate/ns#abstract">;
  export: NamedNode<"http://minorg.github.io/shaclmate/ns#export">;
  extern: NamedNode<"http://minorg.github.io/shaclmate/ns#extern">;
  mintingStrategy: NamedNode<"http://minorg.github.io/shaclmate/ns#mintingStrategy">;
  name: NamedNode<"http://minorg.github.io/shaclmate/ns#name">;
  tsDataFactoryImport: NamedNode<"http://minorg.github.io/shaclmate/ns#tsDataFactoryImport">;
  tsDataFactoryVariable: NamedNode<"http://minorg.github.io/shaclmate/ns#tsDataFactoryVariable">;
  tsFeature: NamedNode<"http://minorg.github.io/shaclmate/ns#tsFeature">;
  tsImport: NamedNode<"http://minorg.github.io/shaclmate/ns#tsImport">;
  tsObjectDeclarationType: NamedNode<"http://minorg.github.io/shaclmate/ns#tsObjectDeclarationType">;
  tsObjectIdentifierPropertyName: NamedNode<"http://minorg.github.io/shaclmate/ns#tsObjectIdentifierPropertyName">;
  tsObjectTypeDiscriminatorPropertyName: NamedNode<"http://minorg.github.io/shaclmate/ns#tsObjectTypeDiscriminatorPropertyName">;
  visibility: NamedNode<"http://minorg.github.io/shaclmate/ns#visibility">;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const builder = namespace("http://minorg.github.io/shaclmate/ns#") as any;
export const strict = builder as NamespaceBuilder<keyof Shaclmate> & Shaclmate;
export const loose = builder as NamespaceBuilder & Shaclmate;
