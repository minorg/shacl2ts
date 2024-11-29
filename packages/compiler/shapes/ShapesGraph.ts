import type { RdfjsShapesGraph } from "@shaclmate/shacl-ast";
import type { NodeShape } from "./NodeShape";
import type { PropertyShape } from "./PropertyShape";
import type { Shape } from "./Shape";

export type ShapesGraph = RdfjsShapesGraph<NodeShape, PropertyShape, Shape>;
