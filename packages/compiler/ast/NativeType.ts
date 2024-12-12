import type { Maybe } from "purify-ts";

export interface NativeType {
  readonly kind: "NativeType";
  readonly tsEqualsFunction: Maybe<string>;
  readonly tsFromRdfFunction: Maybe<string>;
  readonly tsHashFunction: Maybe<string>;
  readonly tsImport: Maybe<string>;
  readonly tsName: string;
  readonly tsToRdfFunction: Maybe<string>;
}
