import type * as purify from "purify-ts";
import { Either } from "purify-ts";
import { Equatable } from "purify-ts-helpers";
import type * as rdfjsResource from "rdfjs-resource";
import type { Resource } from "rdfjs-resource";

export class KitchenSinkNativeType {}

export namespace KitchenSinkNativeType {
  export function equals(
    _left: KitchenSinkNativeType,
    _right: KitchenSinkNativeType,
  ): Equatable.EqualsResult {
    return Equatable.EqualsResult.Equal;
  }

  export function fromRdf(
    _resourceValue: Resource.Value,
  ): purify.Either<rdfjsResource.Resource.ValueError, KitchenSinkNativeType> {
    return Either.of(new KitchenSinkNativeType());
  }

  export function hash<
    HasherT extends {
      update: (message: string | number[] | ArrayBuffer | Uint8Array) => void;
    },
  >(_instance: KitchenSinkNativeType, _hasher: HasherT): void {}

  export function toRdf(
    _instance: KitchenSinkNativeType,
    {
      resourceSet,
    }: {
      mutateGraph: rdfjsResource.MutableResource.MutateGraph;
      resourceSet: rdfjsResource.MutableResourceSet;
    },
  ) {
    return resourceSet.resource(resourceSet.dataFactory.blankNode());
  }
}
