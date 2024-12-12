import * as sparqlBuilder from "@kos-kit/sparql-builder";
import type { BlankNode, NamedNode } from "@rdfjs/types";
import type * as purify from "purify-ts";
import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import type * as rdfjsResource from "rdfjs-resource";
import type { Resource } from "rdfjs-resource";
import { AbstractBaseClassForImportedType } from "./generated/classes.js";

/**
 * Example of an imported object type that fulfills the same contract as a generated object type.
 *
 * It has both static methods (equals, hash, toRdf) and bound methods (equals, hash, toRdf) for use by
 * generated interface code (which has freestanding functions) and generated class code (which calls methods).
 *
 * Normally you would only need one or the other.
 */
export class KitchenSinkImportedType extends AbstractBaseClassForImportedType {
  readonly type = "KitchenSinkImportedType";

  constructor(readonly identifier: BlankNode | NamedNode<string>) {
    super({ abcStringProperty: "test" });
  }

  // Called by interface functions
  static equals(
    left: KitchenSinkImportedType,
    right: KitchenSinkImportedType,
  ): Equatable.EqualsResult {
    return left.equals(right);
  }

  static override fromRdf(
    resource: Resource,
  ): purify.Either<rdfjsResource.Resource.ValueError, KitchenSinkImportedType> {
    return Either.of(new KitchenSinkImportedType(resource.identifier));
  }

  // Called by interface functions
  static hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(instance: KitchenSinkImportedType, hasher: HasherT): void {
    instance.hash(hasher);
  }

  // Called by interface functions
  static toRdf(
    instance: KitchenSinkImportedType,
    parameters: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ) {
    return instance.toRdf(parameters);
  }

  // Called by class methods
  override equals(_other: KitchenSinkImportedType): Equatable.EqualsResult {
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
      resourceSet.dataFactory.namedNode("http://example.com/extrapropert"),
      resourceSet.dataFactory.literal("example"),
    );
    return resource;
  }
}

export namespace KitchenSinkImportedType {
  export class SparqlGraphPatterns extends sparqlBuilder.ResourceGraphPatterns {}
}
