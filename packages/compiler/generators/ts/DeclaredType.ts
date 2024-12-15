import type { TsFeature } from "../../enums/index.js";
import type { Import } from "./Import.js";
import { Type } from "./Type.js";

export abstract class DeclaredType extends Type {
  abstract readonly declarationImports: readonly Import[];
  readonly export: boolean;
  readonly features: Set<TsFeature>;
  readonly name: string;

  constructor({
    export_,
    features,
    name,
    ...superParameters
  }: {
    export_: boolean;
    features: Set<TsFeature>;
    name: string;
  } & ConstructorParameters<typeof Type>[0]) {
    super(superParameters);
    this.export = export_;
    this.features = features;
    this.name = name;
  }
}
