import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type { BlankNode, NamedNode } from "@rdfjs/types";
import type * as purify from "purify-ts";
import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import type * as rdfjsResource from "rdfjs-resource";
import { AbstractBaseClassForImportedType } from "./generated/classes.js";

/**
 * Example of an imported object type that fulfills the same contract as a generated object type.
 *
 * It has both static methods (equals, hash, toRdf) and bound methods (equals, hash, toRdf) for use by
 * generated interface code (which has freestanding functions) and generated class code (which calls methods).
 *
 * Normally you would only need one or the other.
 */
export class ImportedType extends AbstractBaseClassForImportedType {
  readonly type = "ImportedType";

  constructor(readonly identifier: BlankNode | NamedNode<string>) {
    super({ abcStringProperty: "test" });
  }

  // Called by interface functions
  static equals(
    left: ImportedType,
    right: ImportedType,
  ): Equatable.EqualsResult {
    return left.equals(right);
  }

  static override fromRdf({
    extra,
    resource,
  }: {
    extra?: number;
    ignoreRdfType?: boolean;
    resource: rdfjsResource.Resource;
  }): purify.Either<rdfjsResource.Resource.ValueError, ImportedType> {
    if (extra !== 1) {
      throw new Error("extra didn't come through");
    }
    return Either.of(new ImportedType(resource.identifier));
  }

  // Called by interface functions
  static hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(instance: ImportedType, hasher: HasherT): HasherT {
    instance.hash(hasher);
    return hasher;
  }

  // Called by interface functions
  static toRdf(
    instance: ImportedType,
    parameters: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ) {
    return instance.toRdf(parameters);
  }

  // Called by class methods
  override equals(_other: ImportedType): Equatable.EqualsResult {
    return Equatable.EqualsResult.Equal;
  }

  // Called by class methods
  override hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_hasher: HasherT): HasherT {
    return super.hash(_hasher);
  }

  // Called by class methods
  override toRdf({
    mutateGraph,
    resourceSet,
  }: {
    mutateGraph: rdfjsResource.MutableResource.MutateGraph;
    resourceSet: rdfjsResource.MutableResourceSet;
  }) {
    const resource = super.toRdf({ mutateGraph, resourceSet });
    resource.add(
      resourceSet.dataFactory.namedNode("http://example.com/extraproperty"),
      resourceSet.dataFactory.literal("example"),
    );
    return resource;
  }
}

export namespace ImportedType {
  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {}
}
