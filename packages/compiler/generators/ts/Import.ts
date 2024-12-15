import type { ImportDeclarationStructure, OptionalKind } from "ts-morph";

export type Import = OptionalKind<ImportDeclarationStructure> | string;

/**
 * Singleton values for common imports.
 */
export namespace Import {
  export const PURIFY: Import = {
    moduleSpecifier: "purify-ts",
    namespaceImport: "purify",
  };

  export const PURIFY_HELPERS: Import = {
    moduleSpecifier: "purify-ts-helpers",
    namespaceImport: "purifyHelpers",
  };

  export const RDFJS_RESOURCE: Import = {
    moduleSpecifier: "rdfjs-resource",
    namespaceImport: "rdfjsResource",
  };

  export const RDFJS_TYPES: Import = {
    isTypeOnly: true,
    moduleSpecifier: "@rdfjs/types",
    namespaceImport: "rdfjs",
  };

  export const SPARQL_BUILDER: Import = {
    moduleSpecifier: "@kos-kit/sparql-builder",
    namespaceImport: "sparqlBuilder",
  };
}
