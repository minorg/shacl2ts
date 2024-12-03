import type { NodeKind } from "@shaclmate/shacl-ast";
import * as input from "../input/index.js";
import { termTypeToNodeKind } from "./termTypeToNodeKind.js";

export function propertyShapeNodeKinds(shape: input.Shape): Set<NodeKind> {
  const nodeKinds = new Set<NodeKind>([...shape.constraints.nodeKinds]);
  if (nodeKinds.size > 0) {
    return nodeKinds;
  }

  if (shape instanceof input.PropertyShape) {
    shape.defaultValue.ifJust((defaultValue) =>
      nodeKinds.add(termTypeToNodeKind(defaultValue.termType)),
    );
    if (nodeKinds.size > 0) {
      return nodeKinds;
    }
  }

  shape.constraints.hasValue.ifJust((hasValue) =>
    nodeKinds.add(termTypeToNodeKind(hasValue.termType)),
  );
  if (nodeKinds.size > 0) {
    return nodeKinds;
  }

  shape.constraints.in_.ifJust((in_) => {
    for (const term of in_) {
      nodeKinds.add(termTypeToNodeKind(term.termType));
    }
  });

  return nodeKinds;
}
