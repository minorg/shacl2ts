import TermSet from "@rdfjs/term-set";
import { BlankNode, DatasetCore, NamedNode } from "@rdfjs/types";
import { rdf, rdfs } from "@tpluscode/rdf-ns-builders";

export function isRdfInstanceOf({
  class_,
  instance,
  dataset,
}: {
  class_: NamedNode;
  dataset: DatasetCore;
  instance: BlankNode | NamedNode;
} & {}): boolean {
  return isRdfInstanceOfRecursive({
    class_,
    dataset,
    instance,
    visitedClasses: new TermSet<NamedNode>(),
  });
}

function isRdfInstanceOfRecursive({
  class_,
  dataset,
  instance,
  visitedClasses,
}: {
  class_: NamedNode;
  dataset: DatasetCore;
  excludeSubclasses: boolean;
  instance: BlankNode | NamedNode;
  instanceOfPredicate: NamedNode;
  subClassOfPredicate: NamedNode;
  visitedClasses: TermSet<NamedNode>;
}): boolean {
  for (const _ of dataset.match(instance, rdf.type, class_)) {
    return true;
  }

  visitedClasses.add(class_);

  // Recurse into class's sub-classes that haven't been visited yet.
  for (const quad of dataset.match(null, rdfs.subClassOf, class_, null)) {
    if (quad.subject.termType !== "NamedNode") {
      continue;
    } else if (visitedClasses.has(quad.subject)) {
      continue;
    }
    if (
      isRdfInstanceOfRecursive({
        class_: quad.subject,
        dataset,
        excludeSubclasses,
        instance,
        instanceOfPredicate,
        subClassOfPredicate,
        visitedClasses,
      })
    ) {
      return true;
    }
  }

  return false;
}
