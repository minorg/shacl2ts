import type { DatasetCore } from "@rdfjs/types";
import { Parser, Store } from "n3";

export const dashDataset: DatasetCore = new Store(
  new Parser({ format: "text/turtle" }).parse(`
# baseURI: http://datashapes.org/dash
# imports: http://www.w3.org/ns/shacl#
# prefix: dash

@prefix dash: <http://datashapes.org/dash#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix tosh: <http://topbraid.org/tosh#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<http://datashapes.org/dash>
  a owl:Ontology ;
  rdfs:comment "DASH is a SHACL library for frequently needed features and design patterns. The constraint components in this library are 100% standards compliant and will work on any engine that fully supports SHACL." ;
  rdfs:label "DASH Data Shapes Vocabulary" ;
  owl:imports sh: ;
  sh:declare [
      sh:namespace "http://datashapes.org/dash#"^^xsd:anyURI ;
      sh:prefix "dash" ;
    ] ;
  sh:declare [
      sh:namespace "http://purl.org/dc/terms/"^^xsd:anyURI ;
      sh:prefix "dcterms" ;
    ] ;
  sh:declare [
      sh:namespace "http://www.w3.org/1999/02/22-rdf-syntax-ns#"^^xsd:anyURI ;
      sh:prefix "rdf" ;
    ] ;
  sh:declare [
      sh:namespace "http://www.w3.org/2000/01/rdf-schema#"^^xsd:anyURI ;
      sh:prefix "rdfs" ;
    ] ;
  sh:declare [
      sh:namespace "http://www.w3.org/2001/XMLSchema#"^^xsd:anyURI ;
      sh:prefix "xsd" ;
    ] ;
  sh:declare [
      sh:namespace "http://www.w3.org/2002/07/owl#"^^xsd:anyURI ;
      sh:prefix "owl" ;
    ] ;
  sh:declare [
      sh:namespace "http://www.w3.org/2004/02/skos/core#"^^xsd:anyURI ;
      sh:prefix "skos" ;
    ] ;
.
dash:APIStatus
  a rdfs:Class ;
  a sh:NodeShape ;
  rdfs:comment "The class of possible values for dash:apiStatus." ;
  rdfs:label "API Status" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:Action
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "An executable command triggered by an agent, backed by a Script implementation. Actions may get deactivated using sh:deactivated." ;
  rdfs:label "Action" ;
  rdfs:subClassOf dash:Script ;
  rdfs:subClassOf sh:Parameterizable ;
.
dash:ActionGroup
  a dash:ShapeClass ;
  rdfs:comment "A group of ResourceActions, used to arrange items in menus etc. Similar to sh:PropertyGroups, they may have a sh:order and should have labels (in multiple languages if applicable)." ;
  rdfs:label "Action group" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:ActionTestCase
  a dash:ShapeClass ;
  rdfs:comment """A test case that evaluates a dash:Action using provided input parameters. Requires exactly one value for dash:action and will operate on the test case's graph (with imports) as both data and shapes graph.

Currently only supports read-only actions, allowing the comparison of actual results with the expected results.""" ;
  rdfs:label "Action test case" ;
  rdfs:subClassOf dash:TestCase ;
.
dash:AllObjects
  a dash:AllObjectsTarget ;
  rdfs:comment "A reusable instance of dash:AllObjectsTarget." ;
  rdfs:label "All objects" ;
.
dash:AllObjectsTarget
  a sh:SPARQLTargetType ;
  rdfs:comment "A target containing all objects in the data graph as focus nodes." ;
  rdfs:label "All objects target" ;
  rdfs:subClassOf sh:Target ;
  sh:labelTemplate "All objects" ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:select """SELECT DISTINCT ?this
WHERE {
    ?anyS ?anyP ?this .
}""" ;
.
dash:AllSubjects
  a dash:AllSubjectsTarget ;
  rdfs:comment "A reusable instance of dash:AllSubjectsTarget." ;
  rdfs:label "All subjects" ;
.
dash:AllSubjectsTarget
  a sh:SPARQLTargetType ;
  rdfs:comment "A target containing all subjects in the data graph as focus nodes." ;
  rdfs:label "All subjects target" ;
  rdfs:subClassOf sh:Target ;
  sh:labelTemplate "All subjects" ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:select """SELECT DISTINCT ?this
WHERE {
    ?this ?anyP ?anyO .
}""" ;
.
dash:AutoCompleteEditor
  a dash:SingleEditor ;
  rdfs:comment "An auto-complete field to enter the label of instances of a class. This is the fallback editor for any URI resource if no other editors are more suitable." ;
  rdfs:label "Auto-complete editor" ;
.
dash:BlankNodeViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for blank nodes, rendering as the label of the blank node." ;
  rdfs:label "Blank node viewer" ;
.
dash:BooleanSelectEditor
  a dash:SingleEditor ;
  rdfs:comment """An editor for boolean literals, rendering as a select box with values true and false.

Also displays the current value (such as "1"^^xsd:boolean), but only allows to switch to true or false.""" ;
  rdfs:label "Boolean select editor" ;
.
dash:ChangeScript
  a dash:ShapeClass ;
  rdfs:comment """Class of ADS scripts that are executed after edits to the data graph were made, but within the same edit.

These scripts may access the current changes from the graphs with names dataset.addedGraphURI and dataset.deletedGraphURI to learn about which resource values have been added or deleted. For example query them using graph.withDataGraph(dataset.addedGraphURI, ...) or via SPARQL's GRAPH keyword.

Change scripts may then perform further changes which would again become visible to other change scripts. They MUST NOT have other side effects though, because they may get executed in Preview mode, or the change may cause constraint violations and then be rejected. For side effects, after the change has been applied, use commit scripts (dash:CommitScript).

Change scripts are executed by their relative sh:order, with a default value of 0. Use lower values to execute before other scripts.""" ;
  rdfs:label "Change script" ;
  rdfs:subClassOf dash:Script ;
.
dash:ClosedByTypesConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A constraint component that can be used to declare that focus nodes are \\"closed\\" based on their rdf:types, meaning that focus nodes may only have values for the properties that are explicitly enumerated via sh:property/sh:path in property constraints at their rdf:types and the superclasses of those. This assumes that the type classes are also shapes." ;
  rdfs:label "Closed by types constraint component" ;
  sh:nodeValidator [
      a sh:SPARQLSelectValidator ;
      sh:message "Property {?path} is not among those permitted for any of the types" ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT $this (?predicate AS ?path) ?value
WHERE {
\tFILTER ($closedByTypes) .
    $this ?predicate ?value .
\tFILTER (?predicate != rdf:type) .
\tFILTER NOT EXISTS {
\t\t$this rdf:type ?type .
\t\t?type rdfs:subClassOf* ?class .
\t\tGRAPH $shapesGraph {
\t\t\t?class sh:property/sh:path ?predicate .
\t\t}
\t}
}""" ;
    ] ;
  sh:parameter dash:ClosedByTypesConstraintComponent-closedByTypes ;
.
dash:ClosedByTypesConstraintComponent-closedByTypes
  a sh:Parameter ;
  sh:path dash:closedByTypes ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:datatype xsd:boolean ;
  sh:description "True to indicate that the focus nodes are closed by their types. A constraint violation is reported for each property value of the focus node where the property is not among those that are explicitly declared via sh:property/sh:path in any of the rdf:types of the focus node (and their superclasses). The property rdf:type is always permitted." ;
  sh:maxCount 1 ;
.
dash:CoExistsWithConstraintComponent
  a sh:ConstraintComponent ;
  dash:localConstraint true ;
  rdfs:comment "A constraint component that can be used to express a constraint on property shapes so that if the property path has any value then the given property must also have a value, and vice versa." ;
  rdfs:label "Co-exists-with constraint component" ;
  sh:message "Values must co-exist with values of {$coExistsWith}" ;
  sh:parameter dash:CoExistsWithConstraintComponent-coExistsWith ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT $this
WHERE {
\t{
    \tFILTER (EXISTS { $this $PATH ?any } && NOT EXISTS { $this $coExistsWith ?any })
\t}
\tUNION
\t{
    \tFILTER (NOT EXISTS { $this $PATH ?any } && EXISTS { $this $coExistsWith ?any })
\t}
}""" ;
    ] ;
.
dash:CoExistsWithConstraintComponent-coExistsWith
  a sh:Parameter ;
  sh:path dash:coExistsWith ;
  dash:editor dash:PropertyAutoCompleteEditor ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  dash:viewer dash:PropertyLabelViewer ;
  sh:description "The properties that must co-exist with the surrounding property (path). If the surrounding property path has any value then the given property must also have a value, and vice versa." ;
  sh:name "co-exists with" ;
  sh:nodeKind sh:IRI ;
.
dash:CommitScript
  a dash:ShapeClass ;
  rdfs:comment """Class of ADS scripts that are executed after edits to the data graph were made and have been committed.

These scripts may access the changes that have just happened from the graphs with names dataset.addedGraphURI and dataset.deletedGraphURI to learn about which resource values have been added or deleted. For example query them using graph.withDataGraph(dataset.addedGraphURI, ...) or via SPARQL's GRAPH keyword.

Commit scripts may then perform side effects such as updating other graphs or sending out notifications to external systems. For edits that should be made within a finishing change, use change scripts (dash:ChangeScript).

Commit scripts are executed by their relative sh:order, with a default value of 0. Use lower values to execute before other scripts.""" ;
  rdfs:label "Commit script" ;
  rdfs:subClassOf dash:Script ;
.
dash:ConstraintReificationShape
  a sh:NodeShape ;
  rdfs:comment "Can be used to attach sh:severity and sh:messages to individual constraints using reification." ;
  rdfs:label "Constraint reification shape" ;
  sh:property dash:ConstraintReificationShape-message ;
  sh:property dash:ConstraintReificationShape-severity ;
.
dash:ConstraintReificationShape-message
  a sh:PropertyShape ;
  sh:path sh:message ;
  dash:singleLine true ;
  sh:name "messages" ;
  sh:nodeKind sh:Literal ;
  sh:or dash:StringOrLangString ;
.
dash:ConstraintReificationShape-severity
  a sh:PropertyShape ;
  sh:path sh:severity ;
  sh:class sh:Severity ;
  sh:maxCount 1 ;
  sh:name "severity" ;
  sh:nodeKind sh:IRI ;
.
dash:Constructor
  a dash:ShapeClass ;
  rdfs:comment """A script that is executed when a new instance of the class associated via dash:constructor is created, e.g. from a New button. Such scripts typically declare one or more parameters that are collected from the user when the script starts. The values of these parameters can be used as named variables in the script for arbitrary purposes such as setting the URI or initializing some property values of the new instance.

The variable focusNode will hold the named node of the selected type, for example when a constructor is associated with a superclass but the user has pressed New for a subclass.

The last expression of the script will be used as result of the constructor, so that the surrounding tool knows which resource shall be navigated to next.""" ;
  rdfs:label "Constructor" ;
  rdfs:subClassOf dash:Script ;
  rdfs:subClassOf sh:Parameterizable ;
.
dash:DateOrDateTime
  a rdf:List ;
  rdf:first [
      sh:datatype xsd:date ;
    ] ;
  rdf:rest (
      [
        sh:datatype xsd:dateTime ;
      ]
    ) ;
  rdfs:comment "An rdf:List that can be used in property constraints as value for sh:or to indicate that all values of a property must be either xsd:date or xsd:dateTime." ;
  rdfs:label "Date or date time" ;
.
dash:DatePickerEditor
  a dash:SingleEditor ;
  rdfs:comment "An editor for xsd:date literals, offering a calendar-like date picker." ;
  rdfs:label "Date picker editor" ;
.
dash:DateTimePickerEditor
  a dash:SingleEditor ;
  rdfs:comment "An editor for xsd:dateTime literals, offering a calendar-like date picker and a time selector." ;
  rdfs:label "Date time picker editor" ;
.
dash:DepictionRole
  a dash:PropertyRole ;
  rdfs:comment "Depiction properties provide images representing the focus nodes. Typical examples may be a photo of an animal or the map of a country." ;
  rdfs:label "Depiction" ;
.
dash:Deprecated
  a dash:APIStatus ;
  rdfs:comment "Features that have been marked deprecated will remain in the API but should no longer be used by new code and may get deleted in the foreseeable future (e.g., with the next major release)." ;
  rdfs:label "deprecated" ;
.
dash:DescriptionRole
  a dash:PropertyRole ;
  rdfs:comment "Description properties should produce text literals that may be used as an introduction/summary of what a focus node does." ;
  rdfs:label "Description" ;
.
dash:DetailsEditor
  a dash:SingleEditor ;
  rdfs:comment "An editor for non-literal values, typically displaying a nested form where the values of the linked resource can be edited directly on the \\"parent\\" form. Implementations that do not support this (yet) could fall back to an auto-complete widget." ;
  rdfs:label "Details editor" ;
.
dash:DetailsViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for resources that shows the details of the value using its default view shape as a nested form-like display." ;
  rdfs:label "Details viewer" ;
.
dash:Editor
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "The class of widgets for editing value nodes." ;
  rdfs:label "Editor" ;
  rdfs:subClassOf dash:Widget ;
.
dash:EnumSelectEditor
  a dash:SingleEditor ;
  rdfs:comment "A drop-down editor for enumerated values (typically based on sh:in lists)." ;
  rdfs:label "Enum select editor" ;
.
dash:Experimental
  a dash:APIStatus ;
  rdfs:comment "Features that are marked experimental can be used by early adopters but there is no guarantee that they will reach stable state." ;
  rdfs:label "experimental" ;
.
dash:ExploreAction
  a dash:ShapeClass ;
  rdfs:comment "An action typically showing up in an Explore section of a selected resource. Cannot make changes to the data." ;
  rdfs:label "Explore action" ;
  rdfs:subClassOf dash:ResourceAction ;
.
dash:FailureResult
  a rdfs:Class ;
  rdfs:comment "A result representing a validation failure such as an unsupported recursion." ;
  rdfs:label "Failure result" ;
  rdfs:subClassOf sh:AbstractResult ;
.
dash:FailureTestCaseResult
  a rdfs:Class ;
  rdfs:comment "Represents a failure of a test case." ;
  rdfs:label "Failure test case result" ;
  rdfs:subClassOf dash:TestCaseResult ;
.
dash:FunctionTestCase
  a dash:ShapeClass ;
  rdfs:comment "A test case that verifies that a given SPARQL expression produces a given, expected result." ;
  rdfs:label "Function test case" ;
  rdfs:subClassOf dash:TestCase ;
.
dash:GraphService
  a dash:ShapeClass ;
  rdfs:comment "A service that does not apply to a specific resource (as ResourceService does) but operates on the whole graph. The focusNode variable will be the URI of the current base graph (e.g. <urn:x-evn-master:geo> as a NamedNode." ;
  rdfs:label "Graph service" ;
  rdfs:subClassOf dash:Service ;
.
dash:GraphStoreTestCase
  a dash:ShapeClass ;
  rdfs:comment "A test case that can be used to verify that an RDF file could be loaded (from a file) and that the resulting RDF graph is equivalent to a given TTL file." ;
  rdfs:label "Graph store test case" ;
  rdfs:subClassOf dash:TestCase ;
.
dash:GraphUpdate
  a rdfs:Class ;
  rdfs:comment "A suggestion consisting of added and/or deleted triples, represented as rdf:Statements via dash:addedTriple and dash:deletedTriple." ;
  rdfs:label "Graph update" ;
  rdfs:subClassOf dash:Suggestion ;
.
dash:GraphValidationTestCase
  a dash:ShapeClass ;
  rdfs:comment "A test case that performs SHACL constraint validation on the whole graph and compares the results with the expected validation results stored with the test case. By default this excludes meta-validation (i.e. the validation of the shape definitions themselves). If that's desired, set dash:validateShapes to true." ;
  rdfs:label "Graph validation test case" ;
  rdfs:subClassOf dash:ValidationTestCase ;
.
dash:HTMLOrStringOrLangString
  a rdf:List ;
  rdf:first [
      sh:datatype rdf:HTML ;
    ] ;
  rdf:rest (
      [
        sh:datatype xsd:string ;
      ]
      [
        sh:datatype rdf:langString ;
      ]
    ) ;
  rdfs:comment "An rdf:List that can be used in property constraints as value for sh:or to indicate that all values of a property must be either rdf:HTML, xsd:string or rdf:langString (in that order of preference)." ;
  rdfs:label "HTML or string or langString" ;
.
dash:HTMLViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for HTML encoded text from rdf:HTML literals, rendering as parsed HTML DOM elements. Also displays the language if the HTML has a lang attribute on its root DOM element." ;
  rdfs:label "HTML viewer" ;
.
dash:HasValueInConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A constraint component that can be used to express a constraint on property shapes so that one of the values of the property path must be a member of a given list of nodes." ;
  rdfs:label "Has value in constraint component" ;
  sh:message "At least one of the values must be in {$hasValueIn}" ;
  sh:parameter dash:HasValueInConstraintComponent-hasValueIn ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT $this
WHERE {
\tFILTER NOT EXISTS {
    \t$this $PATH ?value .
\t\tGRAPH $shapesGraph {
\t\t\t$hasValueIn rdf:rest*/rdf:first ?value .
\t\t}
\t}
}""" ;
    ] ;
.
dash:HasValueInConstraintComponent-hasValueIn
  a sh:Parameter ;
  sh:path dash:hasValueIn ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:description "At least one of the value nodes must be a member of the given list." ;
  sh:name "has value in" ;
  sh:node dash:ListShape ;
.
dash:HasValueTarget
  a sh:SPARQLTargetType ;
  rdfs:comment "A target type for all subjects where a given predicate has a certain object value." ;
  rdfs:label "Has Value target" ;
  rdfs:subClassOf sh:Target ;
  sh:labelTemplate "All subjects where {$predicate} has value {$object}" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:object ;
      sh:description "The value that is expected to be present." ;
      sh:name "object" ;
    ] ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:predicate ;
      sh:description "The predicate property." ;
      sh:name "predicate" ;
      sh:nodeKind sh:IRI ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:select """SELECT DISTINCT ?this
WHERE {
    ?this $predicate $object .
}""" ;
.
dash:HasValueWithClassConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A constraint component that can be used to express a constraint on property shapes so that one of the values of the property path must be an instance of a given class." ;
  rdfs:label "Has value with class constraint component" ;
  sh:message "At least one of the values must be an instance of class {$hasValueWithClass}" ;
  sh:parameter dash:HasValueWithClassConstraintComponent-hasValueWithClass ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT $this
WHERE {
\tFILTER NOT EXISTS {
    \t$this $PATH ?value .
\t\t?value a ?type .
\t\t?type rdfs:subClassOf* $hasValueWithClass .
\t}
}""" ;
    ] ;
.
dash:HasValueWithClassConstraintComponent-hasValueWithClass
  a sh:Parameter ;
  sh:path dash:hasValueWithClass ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:class rdfs:Class ;
  sh:description "One of the values of the property path must be an instance of the given class." ;
  sh:name "has value with class" ;
  sh:nodeKind sh:IRI ;
.
dash:HyperlinkViewer
  a dash:SingleViewer ;
  rdfs:comment """A Viewer for literals, rendering as a hyperlink to a URL.

For literals it assumes the lexical form is the URL.

This is often used as default viewer for xsd:anyURI literals. Unsupported for blank nodes.""" ;
  rdfs:label "Hyperlink viewer" ;
.
dash:IDRole
  a dash:PropertyRole ;
  rdfs:comment "ID properties are short strings or other literals that identify the focus node among siblings. Examples may include social security numbers." ;
  rdfs:label "ID" ;
.
dash:IconRole
  a dash:PropertyRole ;
  rdfs:comment """Icon properties produce images that are typically small and almost square-shaped, and that may be displayed in the upper left corner of a focus node's display. Values should be xsd:string or xsd:anyURI literals or IRI nodes pointing at URLs. Those URLs should ideally be vector graphics such as .svg files.

Instances of the same class often have the same icon, and this icon may be computed using a sh:values rule or as sh:defaultValue.

If the value is a relative URL then those should be resolved against the server that delivered the surrounding page.""" ;
  rdfs:label "Icon" ;
.
dash:ImageViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for URI values that are recognized as images by a browser, rendering as an image." ;
  rdfs:label "Image viewer" ;
.
dash:IncludedScript
  a dash:ShapeClass ;
  rdfs:comment """The code associated with instances of this class will get injected into the generated APIs, as global code snippets. Typically used to declare libraries of utility functions or constants that are (compared to shape scripts) not necessarily associated with specific classes or shapes.

Note that the JavaScript code stored in dash:js cannot use the export keyword because the code must also work in external scripts (such as on Node.js). Instead, you need to enumerate the exported symbols via dash:exports.""" ;
  rdfs:label "Included script" ;
  rdfs:subClassOf dash:Script ;
.
dash:IndexedConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A constraint component that can be used to mark property shapes to be indexed, meaning that each of its value nodes must carry a dash:index from 0 to N." ;
  rdfs:label "Indexed constraint component" ;
  sh:parameter dash:IndexedConstraintComponent-indexed ;
.
dash:IndexedConstraintComponent-indexed
  a sh:Parameter ;
  sh:path dash:indexed ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:datatype xsd:boolean ;
  sh:description "True to activate indexing for this property." ;
  sh:maxCount 1 ;
  sh:name "indexed" ;
.
dash:InferencingTestCase
  a dash:ShapeClass ;
  rdfs:comment "A test case to verify whether an inferencing engine is producing identical results to those stored as expected results." ;
  rdfs:label "Inferencing test case" ;
  rdfs:subClassOf dash:TestCase ;
.
dash:InlineViewer
  a dash:MultiViewer ;
  rdfs:comment "A multi-viewer that renders all values horizontally, in a more compact form that just a single value per row." ;
  rdfs:label "Inline viewer" ;
.
dash:InstancesSelectEditor
  a dash:SingleEditor ;
  rdfs:comment "A drop-down editor for all instances of the target class (based on sh:class of the property)." ;
  rdfs:label "Instances select editor" ;
.
dash:JSONTableViewer
  a dash:SingleViewer ;
  rdfs:comment """A tabular viewer for rdf:JSON literals with a lexical form in the following format:

{
\tvars: [ 'col1', 'col2' ],                   // These are the column keys
\theaderLabels: [ 'Column 1', 'Column 2' ],   // Optional, for the column headers
\tbindings: [                                 // These become the rows
\t\t{
\t\t\tcol1: {
\t\t\t\tlex: 'Value2',
\t\t\t\tdatatype: '...#string',
\t\t\t},
\t\t\tcol2: {
\t\t\t\turi: 'http://.../Instance',
\t\t\t\tlabel: 'Example Instance',
\t\t\t},
\t\t},
\t\t...
\t],
}

The resulting table will use the headerLabels (if they exist) as column headers, otherwise derive the headers from the variable names. The vars must match the fields in the bindings. The table will contain one row for each binding.

Using Active Data Shapes, you can construct such literals dynamically using a sh:values rule, e.g.

ex:MyClass-myProperty
\ta sh:PropertyShape ;
\tsh:path ex:myProperty ;
\tsh:values [
\t\tdash:js ""\\"
\t\t\tDataViewers.createTableViewerJSON(focusNode.select(\`
\t\t\t\tSELECT ?col1 ?col2
\t\t\t\tWHERE {
\t\t\t\t\t$this ex:prop1 ?col1 .
\t\t\t\t\t$this ex:prop2 ?col2 .
\t\t\t\t}
\t\t\t\`))""\\"
\t] .

You may also produce the JSON literal programmatically in JavaScript, or assert the triples by other means.""" ;
  rdfs:label "JSON table viewer" ;
.
dash:KeyInfoRole
  a dash:PropertyRole ;
  rdfs:comment "The Key info role may be assigned to properties that are likely of special interest to a reader, so that they should appear whenever a summary of a focus node is shown." ;
  rdfs:label "Key info" ;
.
dash:LabelRole
  a dash:PropertyRole ;
  rdfs:comment "Properties with this role produce strings that may serve as display label for the focus nodes. Labels should be either plain string literals or strings with a language tag. The values should also be single-line." ;
  rdfs:label "Label" ;
.
dash:LabelViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for URI resources, rendering as a hyperlink to that URI based on the display label of the resource. Also includes other ways of interacting with the URI such as opening a nested summary display." ;
  rdfs:label "Label viewer" ;
.
dash:LangStringViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for literals with a language tag, rendering as the text plus a language indicator." ;
  rdfs:label "LangString viewer" ;
.
dash:ListNodeShape
  a sh:NodeShape ;
  rdfs:comment "Defines constraints on what it means for a node to be a node within a well-formed RDF list. Note that this does not check whether the rdf:rest items are also well-formed lists as this would lead to unsupported recursion." ;
  rdfs:label "List node shape" ;
  sh:or (
      [
        sh:hasValue () ;
        sh:property [
            a sh:PropertyShape ;
            sh:path rdf:first ;
            sh:maxCount 0 ;
          ] ;
        sh:property [
            a sh:PropertyShape ;
            sh:path rdf:rest ;
            sh:maxCount 0 ;
          ] ;
      ]
      [
        sh:not [
            sh:hasValue () ;
          ] ;
        sh:property [
            a sh:PropertyShape ;
            sh:path rdf:first ;
            sh:maxCount 1 ;
            sh:minCount 1 ;
          ] ;
        sh:property [
            a sh:PropertyShape ;
            sh:path rdf:rest ;
            sh:maxCount 1 ;
            sh:minCount 1 ;
          ] ;
      ]
    ) ;
.
dash:ListShape
  a sh:NodeShape ;
  rdfs:comment """Defines constraints on what it means for a node to be a well-formed RDF list.

The focus node must either be rdf:nil or not recursive. Furthermore, this shape uses dash:ListNodeShape as a "helper" to walk through all members of the whole list (including itself).""" ;
  rdfs:label "List shape" ;
  sh:or (
      [
        sh:hasValue () ;
      ]
      [
        sh:not [
            sh:hasValue () ;
          ] ;
        sh:property [
            a sh:PropertyShape ;
            sh:path [
                sh:oneOrMorePath rdf:rest ;
              ] ;
            dash:nonRecursive true ;
          ] ;
      ]
    ) ;
  sh:property [
      a sh:PropertyShape ;
      sh:path [
          sh:zeroOrMorePath rdf:rest ;
        ] ;
      rdfs:comment "Each list member (including this node) must be have the shape dash:ListNodeShape." ;
      sh:node dash:ListNodeShape ;
    ] ;
.
dash:LiteralViewer
  a dash:SingleViewer ;
  rdfs:comment "A simple viewer for literals, rendering the lexical form of the value." ;
  rdfs:label "Literal viewer" ;
.
dash:ModifyAction
  a dash:ShapeClass ;
  rdfs:comment "An action typically showing up in a Modify section of a selected resource. May make changes to the data." ;
  rdfs:label "Modify action" ;
  rdfs:subClassOf dash:ResourceAction ;
.
dash:MultiEditor
  a dash:ShapeClass ;
  rdfs:comment "An editor for multiple/all value nodes at once." ;
  rdfs:label "Multi editor" ;
  rdfs:subClassOf dash:Editor ;
.
dash:MultiFunction
  a rdfs:Class ;
  a sh:NodeShape ;
  rdfs:comment """A multi-function is a function that can return zero or more result objects consisting of one or more result variables. While normal (SPARQL/SHACL) functions can only return a single result node, multi-functions may not only return multiple nodes but even multiple individual variables per solution.

A common way of defining multi-functions is by wrapping a SPARQL SELECT query, using dash:SPARQLMultiFunction. However, some MultiFunctions (in TopBraid) may also be implemented natively.""" ;
  rdfs:label "Multi-function" ;
  rdfs:subClassOf sh:Parameterizable ;
  sh:nodeKind sh:IRI ;
.
dash:MultiViewer
  a dash:ShapeClass ;
  rdfs:comment "A viewer for multiple/all values at once." ;
  rdfs:label "Multi viewer" ;
  rdfs:subClassOf dash:Viewer ;
.
dash:NoSuitableEditor
  a dash:SingleEditor ;
  rdfs:comment "An \\"editor\\" that simply informs the user that the values cannot be edited here, but for example through source code editing." ;
  rdfs:label "No suitable editor" ;
.
dash:NodeExpressionViewer
  a dash:SingleViewer ;
  rdfs:comment "A viewer for SHACL Node Expressions."^^rdf:HTML ;
  rdfs:label "Node expression viewer" ;
.
dash:NonRecursiveConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "Used to state that a property or path must not point back to itself." ;
  rdfs:label "Non-recursive constraint component" ;
  sh:message "Points back at itself (recursively)" ;
  sh:parameter dash:NonRecursiveConstraintComponent-nonRecursive ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT DISTINCT $this ($this AS ?value)
WHERE {
\t{
\t\tFILTER (?nonRecursive)
\t}
    $this $PATH $this .
}""" ;
    ] ;
.
dash:NonRecursiveConstraintComponent-nonRecursive
  a sh:Parameter ;
  sh:path dash:nonRecursive ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:datatype xsd:boolean ;
  sh:description """Used to state that a property or path must not point back to itself.

For example, "a person cannot have itself as parent" can be expressed by setting dash:nonRecursive=true for a given sh:path.

To express that a person cannot have itself among any of its (recursive) parents, use a sh:path with the + operator such as ex:parent+.""" ;
  sh:maxCount 1 ;
  sh:name "non-recursive" ;
.
dash:None
  a sh:NodeShape ;
  rdfs:comment "A Shape that is no node can conform to." ;
  rdfs:label "None" ;
  sh:in () ;
.
dash:ParameterConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A constraint component that can be used to verify that all value nodes conform to the given Parameter."@en ;
  rdfs:label "Parameter constraint component"@en ;
  sh:parameter dash:ParameterConstraintComponent-parameter ;
.
dash:ParameterConstraintComponent-parameter
  a sh:Parameter ;
  sh:path sh:parameter ;
.
dash:PrimaryKeyConstraintComponent
  a sh:ConstraintComponent ;
  dash:localConstraint true ;
  rdfs:comment "Enforces a constraint that the given property (sh:path) serves as primary key for all resources in the target of the shape. If a property has been declared to be the primary key then each resource must have exactly one value for that property. Furthermore, the URIs of those resources must start with a given string (dash:uriStart), followed by the URL-encoded primary key value. For example if dash:uriStart is \\"http://example.org/country-\\" and the primary key for an instance is \\"de\\" then the URI must be \\"http://example.org/country-de\\". Finally, as a result of the URI policy, there can not be any other resource with the same value under the same primary key policy." ;
  rdfs:label "Primary key constraint component" ;
  sh:labelTemplate "The property {?predicate} is the primary key and URIs start with {?uriStart}" ;
  sh:message "Violation of primary key constraint" ;
  sh:parameter dash:PrimaryKeyConstraintComponent-uriStart ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT DISTINCT $this
WHERE {
        FILTER (
\t\t\t# Must have a value for the primary key
\t\t\tNOT EXISTS { ?this $PATH ?any }
\t\t\t||
\t\t\t# Must have no more than one value for the primary key
\t\t\tEXISTS {
\t\t\t\t?this $PATH ?value1 .
\t\t\t\t?this $PATH ?value2 .
\t\t\t\tFILTER (?value1 != ?value2) .
\t\t\t}
\t\t\t||
\t\t\t# The value of the primary key must align with the derived URI
\t\t\tEXISTS {
\t\t\t\t{
        \t\t\t?this $PATH ?value .
\t\t\t\t\tFILTER NOT EXISTS { ?this $PATH ?value2 . FILTER (?value != ?value2) }
\t\t\t\t}
        \t\tBIND (CONCAT($uriStart, ENCODE_FOR_URI(str(?value))) AS ?uri) .
        \t\tFILTER (str(?this) != ?uri) .
    \t\t}
\t\t)
}""" ;
    ] ;
.
dash:PrimaryKeyConstraintComponent-uriStart
  a sh:Parameter ;
  sh:path dash:uriStart ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:datatype xsd:string ;
  sh:description "The start of the URIs of well-formed resources. If specified then the associated property/path serves as \\"primary key\\" for all target nodes (instances). All such target nodes need to have a URI that starts with the given string, followed by the URI-encoded value of the primary key property." ;
  sh:maxCount 1 ;
  sh:name "URI start" ;
.
dash:PropertyAutoCompleteEditor
  a dash:SingleEditor ;
  rdfs:comment "An editor for properties that are either defined as instances of rdf:Property or used as IRI values of sh:path. The component uses auto-complete to find these properties by their rdfs:labels or sh:names." ;
  rdfs:label "Property auto-complete editor" ;
.
dash:PropertyLabelViewer
  a dash:SingleViewer ;
  rdfs:comment "A viewer for properties that renders a hyperlink using the display label or sh:name, allowing users to either navigate to the rdf:Property resource or the property shape definition. Should be used in conjunction with PropertyAutoCompleteEditor." ;
  rdfs:label "Property label viewer" ;
.
dash:PropertyRole
  a rdfs:Class ;
  a sh:NodeShape ;
  rdfs:comment "The class of roles that a property (shape) may take for its focus nodes." ;
  rdfs:label "Property role" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:QueryTestCase
  a dash:ShapeClass ;
  rdfs:comment "A test case running a given SPARQL SELECT query and comparing its results with those stored as JSON Result Set in the expected result property." ;
  rdfs:label "Query test case" ;
  rdfs:subClassOf dash:TestCase ;
  rdfs:subClassOf sh:SPARQLSelectExecutable ;
.
dash:ReifiableByConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:label "Reifiable-by constraint component" ;
  sh:labelTemplate "Reifiable by {$reifiableBy}" ;
  sh:parameter dash:ReifiableByConstraintComponent-reifiableBy ;
.
dash:ReifiableByConstraintComponent-reifiableBy
  a sh:Parameter ;
  sh:path dash:reifiableBy ;
  sh:class sh:NodeShape ;
  sh:description "Can be used to specify the node shape that may be applied to reified statements produced by a property shape. The property shape must have a URI resource as its sh:path. The values of this property must be node shapes. User interfaces can use this information to determine which properties to present to users when reified statements are explored or edited. Also, SHACL validators can use it to determine how to validate reified triples. Use dash:None to indicate that no reification should be permitted." ;
  sh:maxCount 1 ;
  sh:name "reifiable by" ;
  sh:nodeKind sh:IRI ;
.
dash:ResourceAction
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "An Action that can be executed for a selected resource. Such Actions show up in context menus once they have been assigned a sh:group." ;
  rdfs:label "Resource action" ;
  rdfs:subClassOf dash:Action ;
.
dash:ResourceService
  a dash:ShapeClass ;
  rdfs:comment "A Service that can (and must) be applied to a given resource as focus node. Use dash:resourceService to link a class to the services that apply to its instances." ;
  rdfs:label "Resource service" ;
  rdfs:subClassOf dash:Service ;
.
dash:RichTextEditor
  a dash:SingleEditor ;
  rdfs:comment "A rich text editor to enter the lexical value of a literal and a drop down to select language. The selected language is stored in the HTML lang attribute of the root node in the HTML DOM tree." ;
  rdfs:label "Rich text editor" ;
.
dash:RootClassConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A constraint component defining the parameter dash:rootClass, which restricts the values to be either the root class itself or one of its subclasses. This is typically used in conjunction with properties that have rdfs:Class as their type." ;
  rdfs:label "Root class constraint component" ;
  sh:labelTemplate "Root class {$rootClass}" ;
  sh:message "Value must be subclass of {$rootClass}" ;
  sh:parameter dash:RootClassConstraintComponent-rootClass ;
  sh:validator dash:hasRootClass ;
.
dash:RootClassConstraintComponent-rootClass
  a sh:Parameter ;
  sh:path dash:rootClass ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:class rdfs:Class ;
  sh:description "The root class." ;
  sh:name "root class" ;
  sh:nodeKind sh:IRI ;
.
dash:SPARQLConstructTemplate
  a rdfs:Class ;
  rdfs:comment "Encapsulates one or more SPARQL CONSTRUCT queries that can be parameterized. Parameters will become pre-bound variables in the queries." ;
  rdfs:label "SPARQL CONSTRUCT template" ;
  rdfs:subClassOf sh:Parameterizable ;
  rdfs:subClassOf sh:SPARQLConstructExecutable ;
.
dash:SPARQLMultiFunction
  a rdfs:Class ;
  a sh:NodeShape ;
  rdfs:comment "A multi-function based on a SPARQL SELECT query. The query gets executed with the arguments pre-bound to the variables declared as parameters. The results of the multi-function are all result bindings from the SPARQL result set." ;
  rdfs:label "SPARQL multi-function" ;
  rdfs:subClassOf dash:MultiFunction ;
  rdfs:subClassOf sh:SPARQLSelectExecutable ;
.
dash:SPARQLSelectTemplate
  a rdfs:Class ;
  rdfs:comment "Encapsulates a SPARQL SELECT query that can be parameterized. Parameters will become pre-bound variables in the query." ;
  rdfs:label "SPARQL SELECT template" ;
  rdfs:subClassOf sh:Parameterizable ;
  rdfs:subClassOf sh:SPARQLSelectExecutable ;
.
dash:SPARQLUpdateSuggestionGenerator
  a rdfs:Class ;
  rdfs:comment """A SuggestionGenerator based on a SPARQL UPDATE query (sh:update), producing an instance of dash:GraphUpdate. The INSERTs become dash:addedTriple and the DELETEs become dash:deletedTriple. The WHERE clause operates on the data graph with the pre-bound variables $focusNode, $predicate and $value, as well as the other pre-bound variables for the parameters of the constraint.

In many cases, there may be multiple possible suggestions to fix a problem. For example, with sh:maxLength there are many ways to slice a string. In those cases, the system will first iterate through the result variables from a SELECT query (sh:select) and apply these results as pre-bound variables into the UPDATE query.""" ;
  rdfs:label "SPARQL UPDATE suggestion generator" ;
  rdfs:subClassOf dash:SuggestionGenerator ;
  rdfs:subClassOf sh:SPARQLSelectExecutable ;
  rdfs:subClassOf sh:SPARQLUpdateExecutable ;
.
dash:Script
  a dash:ShapeClass ;
  rdfs:comment "An executable unit implemented in one or more languages such as JavaScript." ;
  rdfs:label "Script" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:ScriptAPIGenerationRules
  a sh:PropertyGroup ;
  rdfs:label "Script API Generation Rules" ;
.
dash:ScriptAPIShape
  a sh:NodeShape ;
  rdfs:comment "Defines the properties that instruct the ADS Script API generator about what prefixes, constants and classes to generate." ;
  rdfs:label "Script API" ;
  sh:property dash:ScriptAPIShape-generateClass ;
  sh:property dash:ScriptAPIShape-generatePrefixClasses ;
  sh:property dash:ScriptAPIShape-generatePrefixConstants ;
  sh:targetClass owl:Ontology ;
.
dash:ScriptAPIShape-generateClass
  a sh:PropertyShape ;
  sh:path dash:generateClass ;
  sh:class sh:NodeShape ;
  sh:description "The API generator will produce classes for each value of this property and all its subclasses and superclasses." ;
  sh:group dash:ScriptAPIGenerationRules ;
  sh:name "generate class" ;
  sh:nodeKind sh:IRI ;
  sh:order "0"^^xsd:decimal ;
.
dash:ScriptAPIShape-generatePrefixClasses
  a sh:PropertyShape ;
  sh:path dash:generatePrefixClasses ;
  sh:datatype xsd:string ;
  sh:description "If a prefix (such as \\"edg\\") is listed here then the API generator will produce classes for all RDFS classes or node shapes from the associated namespace." ;
  sh:group dash:ScriptAPIGenerationRules ;
  sh:name "generate prefix classes" ;
  sh:order "15"^^xsd:decimal ;
.
dash:ScriptAPIShape-generatePrefixConstants
  a sh:PropertyShape ;
  sh:path dash:generatePrefixConstants ;
  sh:datatype xsd:string ;
  sh:description "If a prefix (such as \\"edg\\") is listed here then the API generator will produce constants for class, datatype, shape and property names." ;
  sh:group dash:ScriptAPIGenerationRules ;
  sh:name "generate prefix constants" ;
  sh:order "10"^^xsd:decimal ;
.
dash:ScriptConstraint
  a dash:ShapeClass ;
  rdfs:comment """The class of constraints that are based on Scripts. Depending on whether dash:onAllValues is set to true, these scripts can access the following pre-assigned variables:

- focusNode: the focus node of the constraint (a NamedNode)
- if dash:onAllValues is not true: value: the current value node (e.g. a JavaScript string for xsd:string literals, a number for numeric literals or true or false for xsd:boolean literals. All other literals become LiteralNodes, and non-literals become instances of NamedNode)
- if dash:onAllValues is true: values: an array of current value nodes, as above.

If the expression returns an array then each array member will be mapped to one validation result, following the mapping rules below.

For string results, a validation result will use the string as sh:resultMessage.
For boolean results, a validation result will be produced if the result is false (true means no violation).

For object results, a validation result will be produced using the value of the field "message" of the object as result message. If the field "value" has a value then this will become the sh:value in the violation.

Unless another sh:message has been directly returned, the sh:message of the dash:ScriptConstraint will be used, similar to sh:message at SPARQL Constraints. These sh:messages can access the values {$focusNode}, {$value} etc as template variables.""" ;
  rdfs:label "Script constraint" ;
  rdfs:subClassOf dash:Script ;
.
dash:ScriptConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:label "Script constraint component" ;
  sh:parameter dash:ScriptConstraintComponent-scriptConstraint ;
.
dash:ScriptConstraintComponent-scriptConstraint
  a sh:Parameter ;
  sh:path dash:scriptConstraint ;
  sh:class dash:ScriptConstraint ;
  sh:description "The Script constraint(s) to apply." ;
  sh:name "script constraint" ;
.
dash:ScriptFunction
  a rdfs:Class ;
  a sh:NodeShape ;
  rdfs:comment """Script functions can be used from SPARQL queries and will be injected into the generated prefix object (in JavaScript, for ADS scripts). The dash:js will be inserted into a generated JavaScript function and therefore needs to use the return keyword to produce results. These JS snippets can access the parameter values based on the local name of the sh:Parameter's path. For example ex:value can be accessed using value.

SPARQL use note: Since these functions may be used from any data graph and any shapes graph, they must not rely on any API apart from what's available in the shapes graph that holds the rdf:type triple of the function itself. In other words, at execution time from SPARQL, the ADS shapes graph will be the home graph of the function's declaration.""" ;
  rdfs:label "Script function" ;
  rdfs:subClassOf dash:Script ;
  rdfs:subClassOf sh:Function ;
.
dash:ScriptSuggestionGenerator
  a dash:ShapeClass ;
  rdfs:comment """A Suggestion Generator that is backed by an Active Data Shapes script. The script needs to return a JSON object or an array of JSON objects if it shall generate multiple suggestions. It may also return null to indicate that nothing was suggested. Note that the whole script is evaluated as a (JavaScript) expression, and those will use the last value as result. So simply putting an object at the end of your script should do. Alternatively, define the bulk of the operation as a function and simply call that function in the script.

Each response object can have the following fields:

{
\tmessage: "The human readable message",  // Defaults to the rdfs:label(s) of the suggestion generator
\tadd: [ // An array of triples to add, each triple as an array with three nodes
\t\t[ subject, predicate, object ],
\t\t[ ... ]
\t],
\tdelete: [
\t\t... like add, for the triples to delete
\t]
}

Suggestions with neither added nor deleted triples will be discarded.

At execution time, the script operates on the data graph as the active graph, with the following pre-bound variables:
- focusNode: the NamedNode that is the sh:focusNode of the validation result
- predicate: the NamedNode representing the predicate of the validation result, assuming sh:resultPath is a URI
- value: the value node from the validation result's sh:value, cast into the most suitable JS object
- the other pre-bound variables for the parameters of the constraint, e.g. in a sh:maxCount constraint it would be maxCount

The script will be executed in read-only mode, i.e. it cannot modify the graph.

Example with dash:js:

({
\tmessage: \`\`,
\tadd: focusNode.values(rdfs.label).map(label => 
\t\t[ focusNode, predicate, label ]
    )
})""" ;
  rdfs:label "Script suggestion generator" ;
  rdfs:subClassOf dash:Script ;
  rdfs:subClassOf dash:SuggestionGenerator ;
.
dash:ScriptTestCase
  a dash:ShapeClass ;
  rdfs:comment """A test case that evaluates a script. Requires exactly one value for dash:js and will operate on the test case's graph (with imports) as both data and shapes graph.

Supports read-only scripts only at this stage.""" ;
  rdfs:label "Script test case" ;
  rdfs:subClassOf dash:Script ;
  rdfs:subClassOf dash:TestCase ;
.
dash:ScriptValidator
  a dash:ShapeClass ;
  rdfs:comment """A SHACL validator based on an Active Data Shapes script.

See the comment at dash:ScriptConstraint for the basic evaluation approach. Note that in addition to focusNode and value/values, the script can access pre-bound variables for each declared argument of the constraint component.""" ;
  rdfs:label "Script validator" ;
  rdfs:subClassOf dash:Script ;
  rdfs:subClassOf sh:Validator ;
.
dash:Service
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "A script that gets exposed as a web service, e.g. /tbl/service/ex/MyService" ;
  rdfs:label "Service" ;
  rdfs:subClassOf dash:Script ;
  rdfs:subClassOf sh:Parameterizable ;
.
dash:ShapeClass
  a dash:ShapeClass ;
  dash:hidden true ;
  rdfs:comment "A class that is also a node shape. This class can be used as rdf:type instead of the combination of rdfs:Class and sh:NodeShape." ;
  rdfs:label "Shape class" ;
  rdfs:subClassOf rdfs:Class ;
  rdfs:subClassOf sh:NodeShape ;
.
dash:ShapeScript
  a rdfs:Class ;
  rdfs:comment "A shape script contains extra code that gets injected into the API for the associated node shape. In particular you can use this to define additional functions that operate on the current focus node (the this variable in JavaScript)." ;
  rdfs:label "Shape script" ;
  rdfs:subClassOf dash:Script ;
.
dash:SingleEditor
  a dash:ShapeClass ;
  rdfs:comment "An editor for individual value nodes." ;
  rdfs:label "Single editor" ;
  rdfs:subClassOf dash:Editor ;
.
dash:SingleLineConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment """A constraint component that can be used to declare that all values that are literals must have a lexical form that contains no line breaks ('\\\\n' or '\\\\r').

User interfaces may use the dash:singleLine flag to prefer a text field over a (multi-line) text area.""" ;
  rdfs:label "Single line constraint component" ;
  sh:message "Must not contain line breaks." ;
  sh:parameter dash:SingleLineConstraintComponent-singleLine ;
  sh:validator [
      a sh:SPARQLAskValidator ;
      sh:ask """ASK {
    FILTER (!$singleLine || !isLiteral($value) || (!contains(str($value), '\\\\n') && !contains(str($value), '\\\\r')))
}""" ;
      sh:prefixes <http://datashapes.org/dash> ;
    ] ;
.
dash:SingleLineConstraintComponent-singleLine
  a sh:Parameter ;
  sh:path dash:singleLine ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:datatype xsd:boolean ;
  sh:description "True to state that the lexical form of literal value nodes must not contain any line breaks. False to state that line breaks are explicitly permitted." ;
  sh:maxCount 1 ;
  sh:name "single line" ;
.
dash:SingleViewer
  a dash:ShapeClass ;
  rdfs:comment "A viewer for a single value." ;
  rdfs:label "Single viewer" ;
  rdfs:subClassOf dash:Viewer ;
.
dash:Stable
  a dash:APIStatus ;
  rdfs:comment "Features that have been marked stable are deemed of good quality and can be used until marked deprecated." ;
  rdfs:label "stable" ;
.
dash:StemConstraintComponent
  a sh:ConstraintComponent ;
  dash:staticConstraint true ;
  rdfs:comment "A constraint component that can be used to verify that every value node is an IRI and the IRI starts with a given string value."@en ;
  rdfs:label "Stem constraint component"@en ;
  sh:labelTemplate "Value needs to have stem {$stem}" ;
  sh:message "Value does not have stem {$stem}" ;
  sh:parameter dash:StemConstraintComponent-stem ;
  sh:validator dash:hasStem ;
.
dash:StemConstraintComponent-stem
  a sh:Parameter ;
  sh:path dash:stem ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:datatype xsd:string ;
  sh:description "If specified then every value node must be an IRI and the IRI must start with the given string value." ;
  sh:maxCount 1 ;
  sh:name "stem" ;
.
dash:StringOrLangString
  a rdf:List ;
  rdf:first [
      sh:datatype xsd:string ;
    ] ;
  rdf:rest (
      [
        sh:datatype rdf:langString ;
      ]
    ) ;
  rdfs:comment "An rdf:List that can be used in property constraints as value for sh:or to indicate that all values of a property must be either xsd:string or rdf:langString." ;
  rdfs:label "String or langString" ;
.
dash:StringOrLangStringOrHTML
  a rdf:List ;
  rdf:first [
      sh:datatype xsd:string ;
    ] ;
  rdf:rest (
      [
        sh:datatype rdf:langString ;
      ]
      [
        sh:datatype rdf:HTML ;
      ]
    ) ;
  rdfs:comment "An rdf:List that can be used in property constraints as value for sh:or to indicate that all values of a property must be either xsd:string, rdf:langString or rdf:HTML (in that order of preference)." ;
  rdfs:label "string or langString or HTML" ;
.
dash:SubClassEditor
  a dash:SingleEditor ;
  rdfs:comment "An editor for properties that declare a dash:rootClass. The editor allows selecting either the class itself or one of its subclasses." ;
  rdfs:label "Sub-Class editor" ;
.
dash:SubSetOfConstraintComponent
  a sh:ConstraintComponent ;
  dash:localConstraint true ;
  rdfs:comment "A constraint component that can be used to state that the set of value nodes must be a subset of the value of a given property." ;
  rdfs:label "Sub set of constraint component" ;
  sh:message "Must be one of the values of {$subSetOf}" ;
  sh:parameter dash:SubSetOfConstraintComponent-subSetOf ;
  sh:propertyValidator [
      a sh:SPARQLAskValidator ;
      sh:ask """ASK {
    $this $subSetOf $value .
}""" ;
      sh:prefixes <http://datashapes.org/dash> ;
    ] ;
.
dash:SubSetOfConstraintComponent-subSetOf
  a sh:Parameter ;
  sh:path dash:subSetOf ;
  dash:editor dash:PropertyAutoCompleteEditor ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  dash:viewer dash:PropertyLabelViewer ;
  sh:description "Can be used to state that all value nodes must also be values of a specified other property at the same focus node." ;
  sh:name "sub-set of" ;
  sh:nodeKind sh:IRI ;
.
dash:SuccessResult
  a rdfs:Class ;
  rdfs:comment "A result representing a successfully validated constraint." ;
  rdfs:label "Success result" ;
  rdfs:subClassOf sh:AbstractResult ;
.
dash:SuccessTestCaseResult
  a rdfs:Class ;
  rdfs:comment "Represents a successful run of a test case." ;
  rdfs:label "Success test case result" ;
  rdfs:subClassOf dash:TestCaseResult ;
.
dash:Suggestion
  a rdfs:Class ;
  dash:abstract true ;
  rdfs:comment "Base class of suggestions that modify a graph to \\"fix\\" the source of a validation result." ;
  rdfs:label "Suggestion" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:SuggestionGenerator
  a rdfs:Class ;
  dash:abstract true ;
  rdfs:comment "Base class of objects that can generate suggestions (added or deleted triples) for a validation result of a given constraint component." ;
  rdfs:label "Suggestion generator" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:SuggestionResult
  a rdfs:Class ;
  rdfs:comment "Class of results that have been produced as suggestions, not through SHACL validation. How the actual results are produced is up to implementers. Each instance of this class should have values for sh:focusNode, sh:resultMessage, sh:resultSeverity (suggested default: sh:Info), and dash:suggestion to point at one or more suggestions." ;
  rdfs:label "Suggestion result" ;
  rdfs:subClassOf sh:AbstractResult ;
.
dash:SymmetricConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A contraint component for property shapes to validate that a property is symmetric. For symmetric properties, if A relates to B then B must relate to A." ;
  rdfs:label "Symmetric constraint component" ;
  sh:message "Symmetric value expected" ;
  sh:parameter dash:SymmetricConstraintComponent-symmetric ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT $this ?value {
\tFILTER ($symmetric) .
\t$this $PATH ?value .
\tFILTER NOT EXISTS {
    \t?value $PATH $this .
\t}
}""" ;
    ] ;
.
dash:SymmetricConstraintComponent-symmetric
  a sh:Parameter ;
  sh:path dash:symmetric ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:datatype xsd:boolean ;
  sh:description "If set to true then if A relates to B then B must relate to A." ;
  sh:maxCount 1 ;
  sh:name "symmetric" ;
.
dash:TestCase
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "A test case to verify that a (SHACL-based) feature works as expected." ;
  rdfs:label "Test case" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:TestCaseResult
  a rdfs:Class ;
  dash:abstract true ;
  rdfs:comment "Base class for results produced by running test cases." ;
  rdfs:label "Test case result" ;
  rdfs:subClassOf sh:AbstractResult ;
.
dash:TestEnvironment
  a rdfs:Class ;
  dash:abstract true ;
  rdfs:comment "Abstract base class for test environments, holding information on how to set up a test case." ;
  rdfs:label "Test environment" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:TextAreaEditor
  a dash:SingleEditor ;
  rdfs:comment "A multi-line text area to enter the value of a literal." ;
  rdfs:label "Text area editor" ;
.
dash:TextAreaWithLangEditor
  a dash:SingleEditor ;
  rdfs:comment "A multi-line text area to enter the value of a literal and a drop down to select a language." ;
  rdfs:label "Text area with lang editor" ;
.
dash:TextFieldEditor
  a dash:SingleEditor ;
  rdfs:comment """A simple input field to enter the value of a literal, without the ability to change language or datatype.

This is the fallback editor for any literal if no other editors are more suitable.""" ;
  rdfs:label "Text field editor" ;
.
dash:TextFieldWithLangEditor
  a dash:SingleEditor ;
  rdfs:comment "A single-line input field to enter the value of a literal and a drop down to select language, which is mandatory unless xsd:string is among the permissible datatypes." ;
  rdfs:label "Text field with lang editor" ;
.
dash:URIEditor
  a dash:SingleEditor ;
  rdfs:comment "An input field to enter the URI of a resource, e.g. rdfs:seeAlso links or images." ;
  rdfs:label "URI editor" ;
.
dash:URIViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for URI resources, rendering as a hyperlink to that URI. Also includes other ways of interacting with the URI such as opening a nested summary display." ;
  rdfs:label "URI viewer" ;
.
dash:UniqueValueForClassConstraintComponent
  a sh:ConstraintComponent ;
  rdfs:comment "A constraint component that can be used to state that the values of a property must be unique for all instances of a given class (and its subclasses)." ;
  rdfs:label "Unique value for class constraint component" ;
  sh:labelTemplate "Values must be unique among all instances of {?uniqueValueForClass}" ;
  sh:parameter dash:UniqueValueForClassConstraintComponent-uniqueValueForClass ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:message "Value {?value} must be unique but is also used by {?other}" ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """SELECT DISTINCT $this ?value ?other
WHERE {
\t{
    \t$this $PATH ?value .
\t\t?other $PATH ?value .
\t\tFILTER (?other != $this) .
\t}
\t?other a ?type .
\t?type rdfs:subClassOf* $uniqueValueForClass .
}""" ;
    ] ;
.
dash:UniqueValueForClassConstraintComponent-uniqueValueForClass
  a sh:Parameter ;
  sh:path dash:uniqueValueForClass ;
  dash:reifiableBy dash:ConstraintReificationShape ;
  sh:class rdfs:Class ;
  sh:description "States that the values of the property must be unique for all instances of a given class (and its subclasses)." ;
  sh:name "unique value for class" ;
  sh:nodeKind sh:IRI ;
.
dash:UntrustedHTMLViewer
  a dash:SingleViewer ;
  rdfs:comment "A Viewer for HTML content from untrusted sources. This viewer will sanitize the HTML before rendering. Any a, button, checkbox, form, hidden, input, img, script, select, style and textarea tags and class and style attributes will be removed." ;
  rdfs:label "Untrusted HTML viewer" ;
.
dash:ValidationTestCase
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "Abstract superclass for test cases concerning SHACL constraint validation. Future versions may add new kinds of validatin test cases, e.g. to validate a single resource only." ;
  rdfs:label "Validation test case" ;
  rdfs:subClassOf dash:TestCase ;
.
dash:ValueTableViewer
  a dash:MultiViewer ;
  rdfs:comment "A viewer that renders all values of a given property as a table, with one value per row, and the columns defined by the shape that is the sh:node or sh:class of the property." ;
  rdfs:label "Value table viewer" ;
.
dash:Viewer
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "The class of widgets for viewing value nodes." ;
  rdfs:label "Viewer" ;
  rdfs:subClassOf dash:Widget ;
.
dash:Widget
  a dash:ShapeClass ;
  dash:abstract true ;
  rdfs:comment "Base class of user interface components that can be used to display or edit value nodes." ;
  rdfs:label "Widget" ;
  rdfs:subClassOf rdfs:Resource ;
.
dash:abstract
  a rdf:Property ;
  rdfs:comment "Indicates that a class is \\"abstract\\" and cannot be used in asserted rdf:type triples. Only non-abstract subclasses of abstract classes should be instantiated directly." ;
  rdfs:domain rdfs:Class ;
  rdfs:label "abstract" ;
  rdfs:range xsd:boolean ;
.
dash:actionGroup
  a rdf:Property ;
  rdfs:comment "Links an Action with the ActionGroup that it should be arranged in." ;
  rdfs:domain dash:Action ;
  rdfs:label "action group" ;
  rdfs:range dash:ActionGroup ;
.
dash:actionIconClass
  a rdf:Property ;
  rdfs:comment "The (CSS) class of an Action for display purposes alongside the label." ;
  rdfs:domain dash:Action ;
  rdfs:label "action icon class" ;
  rdfs:range xsd:string ;
.
dash:addedTriple
  a rdf:Property ;
  rdfs:comment "May link a dash:GraphUpdate with one or more triples (represented as instances of rdf:Statement) that should be added to fix the source of the result." ;
  rdfs:domain dash:GraphUpdate ;
  rdfs:label "added triple" ;
  rdfs:range rdf:Statement ;
.
dash:all
  a rdfs:Resource ;
  rdfs:comment "Represents all users/roles, for example as a possible value of the default view for role property." ;
  rdfs:label "all" ;
.
dash:apiStatus
  a rdf:Property ;
  rdfs:comment "Defines how and whether the associated feature is part of an external API. APIs may be implemented as (REST) web services, via GraphQL or ADS Script APIs." ;
  rdfs:label "API status" ;
  rdfs:range dash:APIStatus ;
.
dash:applicableToClass
  a rdf:Property ;
  rdfs:comment "Can be used to state that a shape is applicable to instances of a given class. This is a softer statement than \\"target class\\": a target means that all instances of the class must conform to the shape. Being applicable to simply means that the shape may apply to (some) instances of the class. This information can be used by algorithms or humans." ;
  rdfs:domain sh:Shape ;
  rdfs:label "applicable to class" ;
  rdfs:range rdfs:Class ;
.
dash:cachable
  a rdf:Property ;
  rdfs:comment "If set to true then the results of the SHACL function can be cached in between invocations with the same arguments. In other words, they are stateless and do not depend on triples in any graph, or the current time stamp etc." ;
  rdfs:domain sh:Function ;
  rdfs:label "cachable" ;
  rdfs:range xsd:boolean ;
.
dash:closedByTypes
  a rdf:Property ;
  rdfs:label "closed by types" ;
.
dash:coExistsWith
  a rdf:Property ;
  rdfs:comment "Specifies a property that must have a value whenever the property path has a value, and must have no value whenever the property path has no value." ;
  rdfs:label "co-exists with" ;
  rdfs:range rdf:Property ;
.
dash:composite
  a rdf:Property ;
  rdfs:comment "Can be used to indicate that a property/path represented by a property constraint represents a composite relationship. In a composite relationship, the life cycle of a \\"child\\" object (value of the property/path) depends on the \\"parent\\" object (focus node). If the parent gets deleted, then the child objects should be deleted, too. Tools may use dash:composite (if set to true) to implement cascading delete operations." ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "composite" ;
  rdfs:range xsd:boolean ;
.
dash:contextFree
  a rdf:Property ;
  rdfs:comment "Used to mark certain parameterizables as context-free, meaning that the outcome of a process does not depend on the currently active query graph." ;
  rdfs:label "context-free" ;
  rdfs:range xsd:boolean ;
.
dash:defaultLang
  a rdf:Property ;
  rdfs:comment "Can be used to annotate a graph (usually the owl:Ontology) with the default language that tools should suggest for new literal values. For example, predominantly English graphs should have \\"en\\" as default language." ;
  rdfs:domain owl:Ontology ;
  rdfs:label "default language" ;
  rdfs:range xsd:string ;
.
dash:defaultViewForRole
  a rdf:Property ;
  rdfs:comment "Links a node shape with the roles for which it shall be used as default view. User interfaces can use these values to select how to present a given RDF resource. The values of this property are URIs representing a group of users or agents. There is a dedicated URI dash:all representing all users." ;
  rdfs:domain sh:NodeShape ;
  rdfs:label "default view for role" ;
.
dash:deletedTriple
  a rdf:Property ;
  rdfs:comment "May link a dash:GraphUpdate result with one or more triples (represented as instances of rdf:Statement) that should be deleted to fix the source of the result." ;
  rdfs:domain dash:GraphUpdate ;
  rdfs:label "deleted triple" ;
  rdfs:range rdf:Statement ;
.
dash:dependencyPredicate
  a rdf:Property ;
  rdfs:comment "Can be used in dash:js node expressions to enumerate the predicates that the computation of the values may depend on. This can be used by clients to determine whether an edit requires re-computation of values on a form or elsewhere. For example, if the dash:js is something like \\"focusNode.firstName + focusNode.lastName\\" then the dependency predicates should be ex:firstName and ex:lastName." ;
  rdfs:label "dependency predicate" ;
  rdfs:range rdf:Property ;
.
dash:detailsEndpoint
  a rdf:Property ;
  rdfs:comment """Can be used to link a SHACL property shape with the URL of a SPARQL endpoint that may contain further RDF triples for the value nodes delivered by the property. This can be used to inform a processor that it should switch to values from an external graph when the user wants to retrieve more information about a value.

This property should be regarded as an "annotation", i.e. it does not have any impact on validation or other built-in SHACL features. However, selected tools may want to use this information. One implementation strategy would be to periodically fetch the values specified by the sh:node or sh:class shape associated with the property, using the property shapes in that shape, and add the resulting triples into the main query graph.

An example value is "https://query.wikidata.org/sparql".""" ;
  rdfs:label "details endpoint" ;
.
dash:detailsGraph
  a rdf:Property ;
  rdfs:comment """Can be used to link a SHACL property shape with a SHACL node expression that produces the URIs of one or more graphs that contain further RDF triples for the value nodes delivered by the property. This can be used to inform a processor that it should switch to another data graph when the user wants to retrieve more information about a value.

The node expressions are evaluated with the focus node as input. (It is unclear whether there are also cases where the result may be different for each specific value, in which case the node expression would need a second input argument).

This property should be regarded as an "annotation", i.e. it does not have any impact on validation or other built-in SHACL features. However, selected tools may want to use this information.""" ;
  rdfs:label "details graph" ;
.
dash:editor
  a rdf:Property ;
  rdfs:comment "Can be used to link a property shape with an editor, to state a preferred editing widget in user interfaces." ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "editor" ;
  rdfs:range dash:Editor ;
.
dash:expectedResult
  a rdf:Property ;
  rdfs:comment "The expected result(s) of a test case. The value range of this property is different for each kind of test cases." ;
  rdfs:domain dash:TestCase ;
  rdfs:label "expected result" ;
.
dash:expectedResultIsJSON
  a rdf:Property ;
  rdfs:comment "A flag to indicate that the expected result represents a JSON string. If set to true, then tests would compare JSON structures (regardless of whitespaces) instead of actual syntax." ;
  rdfs:label "expected result is JSON" ;
  rdfs:range xsd:boolean ;
.
dash:expectedResultIsTTL
  a rdf:Property ;
  rdfs:comment "A flag to indicate that the expected result represents an RDF graph encoded as a Turtle file. If set to true, then tests would compare graphs instead of actual syntax." ;
  rdfs:domain dash:TestCase ;
  rdfs:label "expected result is Turtle" ;
  rdfs:range xsd:boolean ;
.
dash:fixed
  a rdf:Property ;
  rdfs:comment "Can be used to mark that certain validation results have already been fixed." ;
  rdfs:domain sh:ValidationResult ;
  rdfs:label "fixed" ;
  rdfs:range xsd:boolean ;
.
dash:hasClass
  a sh:SPARQLAskValidator ;
  rdfs:label "has class" ;
  sh:ask """
\t\tASK {
\t\t\t$value rdf:type/rdfs:subClassOf* $class .
\t\t}
\t\t""" ;
  sh:message "Value does not have class {$class}" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasMaxExclusive
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given node (?value) has a value less than (<) the provided ?maxExclusive. Returns false if this cannot be determined, e.g. because values do not have comparable types." ;
  rdfs:label "has max exclusive" ;
  sh:ask "ASK { FILTER ($value < $maxExclusive) }" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasMaxInclusive
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given node (?value) has a value less than or equal to (<=) the provided ?maxInclusive. Returns false if this cannot be determined, e.g. because values do not have comparable types." ;
  rdfs:label "has max inclusive" ;
  sh:ask "ASK { FILTER ($value <= $maxInclusive) }" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasMaxLength
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given string (?value) has a length within a given maximum string length." ;
  rdfs:label "has max length" ;
  sh:ask """
\t\tASK {
\t\t\tFILTER (STRLEN(str($value)) <= $maxLength) .
\t\t}
\t\t""" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasMinExclusive
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given node (?value) has value greater than (>) the provided ?minExclusive. Returns false if this cannot be determined, e.g. because values do not have comparable types." ;
  rdfs:label "has min exclusive" ;
  sh:ask "ASK { FILTER ($value > $minExclusive) }" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasMinInclusive
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given node (?value) has value greater than or equal to (>=) the provided ?minInclusive. Returns false if this cannot be determined, e.g. because values do not have comparable types." ;
  rdfs:label "has min inclusive" ;
  sh:ask "ASK { FILTER ($value >= $minInclusive) }" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasMinLength
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given string (?value) has a length within a given minimum string length." ;
  rdfs:label "has min length" ;
  sh:ask """
\t\tASK {
\t\t\tFILTER (STRLEN(str($value)) >= $minLength) .
\t\t}
\t\t""" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasNodeKind
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given node (?value) has a given sh:NodeKind (?nodeKind). For example, sh:hasNodeKind(42, sh:Literal) = true." ;
  rdfs:label "has node kind" ;
  sh:ask """
\t\tASK {
\t\t\tFILTER ((isIRI($value) && $nodeKind IN ( sh:IRI, sh:BlankNodeOrIRI, sh:IRIOrLiteral ) ) ||
\t\t\t\t(isLiteral($value) && $nodeKind IN ( sh:Literal, sh:BlankNodeOrLiteral, sh:IRIOrLiteral ) ) ||
\t\t\t\t(isBlank($value)   && $nodeKind IN ( sh:BlankNode, sh:BlankNodeOrIRI, sh:BlankNodeOrLiteral ) )) .
\t\t}
\t\t""" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasPattern
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether the string representation of a given node (?value) matches a given regular expression (?pattern). Returns false if the value is a blank node." ;
  rdfs:label "has pattern" ;
  sh:ask "ASK { FILTER (!isBlank($value) && IF(bound($flags), regex(str($value), $pattern, $flags), regex(str($value), $pattern))) }" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasRootClass
  a sh:SPARQLAskValidator ;
  rdfs:label "has root class" ;
  sh:ask """ASK {
    $value rdfs:subClassOf* $rootClass .
}""" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasStem
  a sh:SPARQLAskValidator ;
  rdfs:comment "Checks whether a given node is an IRI starting with a given stem." ;
  rdfs:label "has stem" ;
  sh:ask "ASK { FILTER (isIRI($value) && STRSTARTS(str($value), $stem)) }" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:hasValueIn
  a rdf:Property ;
  rdfs:comment "Specifies a constraint that at least one of the value nodes must be a member of the given list." ;
  rdfs:label "has value in" ;
  rdfs:range rdf:List ;
.
dash:hasValueWithClass
  a rdf:Property ;
  rdfs:comment "Specifies a constraint that at least one of the value nodes must be an instance of a given class." ;
  rdfs:label "has value with class" ;
  rdfs:range rdfs:Class ;
.
dash:height
  a rdf:Property ;
  rdfs:comment "The height." ;
  rdfs:label "height" ;
  rdfs:range xsd:integer ;
.
dash:hidden
  a rdf:Property ;
  rdfs:comment "Properties marked as hidden do not appear in user interfaces, yet remain part of the shape for other purposes such as validation and scripting or GraphQL schema generation." ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "hidden" ;
  rdfs:range xsd:boolean ;
.
dash:index
  a rdf:Property ;
  rdfs:label "index" ;
  rdfs:range xsd:integer ;
.
dash:indexed
  a rdf:Property ;
  rdfs:domain sh:PropertyShape ;
  rdfs:range xsd:boolean ;
.
dash:isDeactivated
  a sh:SPARQLFunction ;
  dash:apiStatus dash:Stable ;
  rdfs:comment "Checks whether a given shape or constraint has been marked as \\"deactivated\\" using sh:deactivated." ;
  rdfs:label "is deactivated" ;
  sh:ask """ASK {
    ?constraintOrShape sh:deactivated true .
}""" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:constraintOrShape ;
      sh:description "The sh:Constraint or sh:Shape to test." ;
      sh:name "constraint or shape" ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:boolean ;
.
dash:isIn
  a sh:SPARQLAskValidator ;
  rdfs:label "is in" ;
  sh:ask """
\t\tASK {
\t\t\tGRAPH $shapesGraph {
\t\t\t\t$in (rdf:rest*)/rdf:first $value .
\t\t\t}
\t\t}
\t\t""" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:isLanguageIn
  a sh:SPARQLAskValidator ;
  rdfs:label "is language in" ;
  sh:ask """
\t\tASK {
\t\t\tBIND (lang($value) AS ?valueLang) .
\t\t\tFILTER EXISTS {
\t\t\t\tGRAPH $shapesGraph {
\t\t\t\t\t$languageIn (rdf:rest*)/rdf:first ?lang .
\t\t\t\t    FILTER (langMatches(?valueLang, ?lang))
\t\t\t\t} }
\t\t}
\t\t""" ;
  sh:prefixes <http://datashapes.org/dash> ;
.
dash:isNodeKindBlankNode
  a sh:SPARQLFunction ;
  dash:apiStatus dash:Stable ;
  dash:cachable true ;
  dash:contextFree true ;
  rdfs:comment "Checks if a given sh:NodeKind is one that includes BlankNodes." ;
  rdfs:label "is NodeKind BlankNode" ;
  sh:ask """ASK {
\tFILTER ($nodeKind IN ( sh:BlankNode, sh:BlankNodeOrIRI, sh:BlankNodeOrLiteral ))
}""" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:nodeKind ;
      sh:class sh:NodeKind ;
      sh:description "The sh:NodeKind to check." ;
      sh:name "node kind" ;
      sh:nodeKind sh:IRI ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:boolean ;
.
dash:isNodeKindIRI
  a sh:SPARQLFunction ;
  dash:apiStatus dash:Stable ;
  dash:cachable true ;
  dash:contextFree true ;
  rdfs:comment "Checks if a given sh:NodeKind is one that includes IRIs." ;
  rdfs:label "is NodeKind IRI" ;
  sh:ask """ASK {
\tFILTER ($nodeKind IN ( sh:IRI, sh:BlankNodeOrIRI, sh:IRIOrLiteral ))
}""" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:nodeKind ;
      sh:class sh:NodeKind ;
      sh:description "The sh:NodeKind to check." ;
      sh:name "node kind" ;
      sh:nodeKind sh:IRI ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:boolean ;
.
dash:isNodeKindLiteral
  a sh:SPARQLFunction ;
  dash:apiStatus dash:Stable ;
  dash:cachable true ;
  dash:contextFree true ;
  rdfs:comment "Checks if a given sh:NodeKind is one that includes Literals." ;
  rdfs:label "is NodeKind Literal" ;
  sh:ask """ASK {
\tFILTER ($nodeKind IN ( sh:Literal, sh:BlankNodeOrLiteral, sh:IRIOrLiteral ))
}""" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:nodeKind ;
      sh:class sh:NodeKind ;
      sh:description "The sh:NodeKind to check." ;
      sh:name "node kind" ;
      sh:nodeKind sh:IRI ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:boolean ;
.
dash:isSubClassOf
  a sh:SPARQLFunction ;
  dash:apiStatus dash:Stable ;
  rdfs:comment "Returns true if a given class (first argument) is a subclass of a given other class (second argument), or identical to that class. This is equivalent to an rdfs:subClassOf* check." ;
  rdfs:label "is subclass of" ;
  sh:ask """ASK {
    $subclass rdfs:subClassOf* $superclass .
}""" ;
  sh:parameter dash:isSubClassOf-subclass ;
  sh:parameter dash:isSubClassOf-superclass ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:boolean ;
.
dash:isSubClassOf-subclass
  a sh:Parameter ;
  sh:path dash:subclass ;
  sh:class rdfs:Class ;
  sh:description "The (potential) subclass." ;
  sh:name "subclass" ;
.
dash:isSubClassOf-superclass
  a sh:Parameter ;
  sh:path dash:superclass ;
  sh:class rdfs:Class ;
  sh:description "The (potential) superclass." ;
  sh:name "superclass" ;
  sh:order "1"^^xsd:decimal ;
.
dash:js
  a rdf:Property ;
  rdfs:comment "The JavaScript source code of a Script." ;
  rdfs:domain dash:Script ;
  rdfs:label "JavaScript source code" ;
  rdfs:range xsd:string ;
.
dash:localConstraint
  a rdf:Property ;
  rdfs:comment """Can be set to true for those constraint components where the validation does not require to visit any other triples than the shape definitions and the direct property values of the focus node mentioned in the property constraints. Examples of this include sh:minCount and sh:hasValue.

Constraint components that are marked as such can be optimized by engines, e.g. they can be evaluated client-side at form submission time, without having to make a round-trip to a server, assuming the client has downloaded a complete snapshot of the resource.

Any component marked with dash:staticConstraint is also a dash:localConstraint.""" ;
  rdfs:domain sh:ConstraintComponent ;
  rdfs:label "local constraint" ;
  rdfs:range xsd:boolean ;
.
dash:mimeTypes
  a rdf:Property ;
  rdfs:comment """For file-typed properties, this can be used to specify the expected/allowed mime types of its values. This can be used, for example, to limit file input boxes or file selectors. If multiple values are allowed then they need to be separated by commas.

Example values are listed at https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types""" ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "mime types" ;
  rdfs:range xsd:string ;
.
dash:neverMaterialize
  a rdf:Property ;
  rdfs:comment "If set to true at a property shape then any sh:values and sh:defaultValue rules of this property will be ignored when 'all inferences' are computed. This is useful for property values that shall only be computed for individual focus nodes (e.g. when a user visits a resource) but not for large inference runs." ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "never materialize" ;
  rdfs:range xsd:boolean ;
.
dash:onAllValues
  a rdf:Property ;
  rdfs:comment "If set to true for a ScriptConstraint or ScriptValidator, then the associated script will receive all value nodes at once, as a value of the variable values. By default (or false), the script is called for each value node individually." ;
  rdfs:label "on all values" ;
  rdfs:range xsd:boolean ;
.
dash:propertySuggestionGenerator
  a rdf:Property ;
  rdfs:comment "Links the constraint component with instances of dash:SuggestionGenerator that may be used to produce suggestions for a given validation result that was produced by a property constraint." ;
  rdfs:domain sh:ConstraintComponent ;
  rdfs:label "property suggestion generator" ;
  rdfs:range dash:SuggestionGenerator ;
.
dash:readOnly
  a rdf:Property ;
  rdfs:comment "Used as a hint for user interfaces that values of the associated property should not be editable. The values of this may be the boolean literals true or false or, more generally, a SHACL node expression that must evaluate to true or false." ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "read only" ;
.
dash:reifiableBy
  a rdf:Property ;
  rdfs:comment "Can be used to specify the node shape that may be applied to reified statements produced by a property shape. The property shape must have a URI resource as its sh:path. The values of this property must be node shapes. User interfaces can use this information to determine which properties to present to users when reified statements are explored or edited. Use dash:None to indicate that no reification should be permitted." ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "reifiable by" ;
  rdfs:range sh:NodeShape ;
.
dash:resourceAction
  a rdf:Property ;
  rdfs:comment "Links a class with the Resource Actions that can be applied to instances of that class." ;
  rdfs:domain rdfs:Class ;
  rdfs:label "resource action" ;
  rdfs:range dash:ResourceAction ;
.
dash:rootClass
  a rdf:Property ;
  rdfs:label "root class" ;
.
dash:shape
  a rdf:Property ;
  rdfs:comment "States that a subject resource has a given shape. This property can, for example, be used to capture results of SHACL validation on static data." ;
  rdfs:label "shape" ;
  rdfs:range sh:Shape ;
.
dash:shapeScript
  a rdf:Property ;
  rdfs:domain sh:NodeShape ;
  rdfs:label "shape script" ;
.
dash:singleLine
  a rdf:Property ;
  rdfs:label "single line" ;
  rdfs:range xsd:boolean ;
.
dash:staticConstraint
  a rdf:Property ;
  rdfs:comment """Can be set to true for those constraint components where the validation does not require to visit any other triples than the parameters. Examples of this include sh:datatype or sh:nodeKind, where no further triples need to be queried to determine the result.

Constraint components that are marked as such can be optimized by engines, e.g. they can be evaluated client-side at form submission time, without having to make a round-trip to a server.""" ;
  rdfs:domain sh:ConstraintComponent ;
  rdfs:label "static constraint" ;
  rdfs:range xsd:boolean ;
.
dash:stem
  a rdf:Property ;
  rdfs:comment "Specifies a string value that the IRI of the value nodes must start with."@en ;
  rdfs:label "stem"@en ;
  rdfs:range xsd:string ;
.
dash:subSetOf
  a rdf:Property ;
  rdfs:label "sub set of" ;
.
dash:suggestion
  a rdf:Property ;
  rdfs:comment "Can be used to link a result with one or more suggestions on how to address or improve the underlying issue." ;
  rdfs:domain sh:AbstractResult ;
  rdfs:label "suggestion" ;
  rdfs:range dash:Suggestion ;
.
dash:suggestionConfidence
  a rdf:Property ;
  rdfs:comment "An optional confidence between 0% and 100%. Suggestions with 100% confidence are strongly recommended. Can be used to sort recommended updates." ;
  rdfs:domain dash:Suggestion ;
  rdfs:label "suggestion confidence" ;
  rdfs:range xsd:decimal ;
.
dash:suggestionGenerator
  a rdf:Property ;
  rdfs:comment "Links a sh:SPARQLConstraint or sh:JSConstraint with instances of dash:SuggestionGenerator that may be used to produce suggestions for a given validation result that was produced by the constraint." ;
  rdfs:label "suggestion generator" ;
  rdfs:range dash:SuggestionGenerator ;
.
dash:suggestionGroup
  a rdf:Property ;
  rdfs:comment "Can be used to link a suggestion with the group identifier to which it belongs. By default this is a link to the dash:SuggestionGenerator, but in principle this could be any value." ;
  rdfs:domain dash:Suggestion ;
  rdfs:label "suggestion" ;
.
dash:symmetric
  a rdf:Property ;
  rdfs:comment "True to declare that the associated property path is symmetric." ;
  rdfs:label "symmetric" ;
.
dash:toString
  a sh:SPARQLFunction ;
  dash:cachable true ;
  rdfs:comment "Returns a literal with datatype xsd:string that has the input value as its string. If the input value is an (URI) resource then its URI will be used." ;
  rdfs:label "to string" ;
  sh:labelTemplate "Convert {$arg} to xsd:string" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:arg ;
      sh:description "The input value." ;
      sh:name "arg" ;
      sh:nodeKind sh:IRIOrLiteral ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:string ;
  sh:select """SELECT (xsd:string($arg) AS ?result)
WHERE {
}""" ;
.
dash:uniqueValueForClass
  a rdf:Property ;
  rdfs:label "unique value for class" ;
.
dash:uriTemplate
  a sh:SPARQLFunction ;
  dash:apiStatus dash:Stable ;
  dash:cachable true ;
  dash:contextFree true ;
  rdfs:comment """Inserts a given value into a given URI template, producing a new xsd:anyURI literal.

In the future this should support RFC 6570 but for now it is limited to simple {...} patterns.""" ;
  rdfs:label "URI template" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:template ;
      sh:datatype xsd:string ;
      sh:description "The URI template, e.g. \\"http://example.org/{symbol}\\"." ;
      sh:name "template" ;
      sh:order 0 ;
    ] ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:value ;
      sh:description "The literal value to insert into the template. Will use the URI-encoded string of the lexical form (for now)." ;
      sh:name "value" ;
      sh:nodeKind sh:Literal ;
      sh:order 1 ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:anyURI ;
  sh:select """SELECT ?result
WHERE {
    \tBIND (xsd:anyURI(REPLACE(?template, "\\\\\\\\{[a-zA-Z]+\\\\\\\\}", $value)) AS ?result)
}""" ;
.
dash:validateShapes
  a rdf:Property ;
  rdfs:comment "True to also validate the shapes itself (i.e. parameter declarations)." ;
  rdfs:domain dash:GraphValidationTestCase ;
  rdfs:label "validate shapes" ;
  rdfs:range xsd:boolean ;
.
dash:valueCount
  a sh:SPARQLFunction ;
  dash:apiStatus dash:Stable ;
  rdfs:comment "Computes the number of objects for a given subject/predicate combination." ;
  rdfs:label "value count" ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:predicate ;
      sh:class rdfs:Resource ;
      sh:description "The predicate to get the number of objects of." ;
      sh:name "predicate" ;
      sh:order 1 ;
    ] ;
  sh:parameter [
      a sh:Parameter ;
      sh:path dash:subject ;
      sh:class rdfs:Resource ;
      sh:description "The subject to get the number of objects of." ;
      sh:name "subject" ;
      sh:order 0 ;
    ] ;
  sh:prefixes <http://datashapes.org/dash> ;
  sh:returnType xsd:integer ;
  sh:select """
\t\tSELECT (COUNT(?object) AS ?result)
\t\tWHERE {
    \t\t$subject $predicate ?object .
\t\t}
""" ;
.
dash:viewer
  a rdf:Property ;
  rdfs:comment "Can be used to link a property shape with a viewer, to state a preferred viewing widget in user interfaces." ;
  rdfs:domain sh:PropertyShape ;
  rdfs:label "viewer" ;
  rdfs:range dash:Viewer ;
.
dash:width
  a rdf:Property ;
  rdfs:comment "The width." ;
  rdfs:label "width" ;
  rdfs:range xsd:integer ;
.
dash:x
  a rdf:Property ;
  rdfs:comment "The x position." ;
  rdfs:label "x" ;
  rdfs:range xsd:integer ;
.
dash:y
  a rdf:Property ;
  rdfs:comment "The y position." ;
  rdfs:label "y" ;
  rdfs:range xsd:integer ;
.
owl:Class
  a rdfs:Class ;
  rdfs:subClassOf rdfs:Class ;
.
sh:AbstractResult
  dash:abstract true ;
.
sh:ClassConstraintComponent
  sh:labelTemplate "Value needs to have class {$class}" ;
  sh:validator dash:hasClass ;
.
sh:ClosedConstraintComponent
  dash:localConstraint true ;
  sh:labelTemplate "Closed shape: only the enumerated properties can be used" ;
  sh:nodeValidator [
      a sh:SPARQLSelectValidator ;
      sh:message "Predicate {?path} is not allowed (closed shape)" ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT $this (?predicate AS ?path) ?value
\t\tWHERE {
\t\t\t{
\t\t\t\tFILTER ($closed) .
\t\t\t}
\t\t\t$this ?predicate ?value .
\t\t\tFILTER (NOT EXISTS {
\t\t\t\tGRAPH $shapesGraph {
\t\t\t\t\t$currentShape sh:property/sh:path ?predicate .
\t\t\t\t}
\t\t\t} && (!bound($ignoredProperties) || NOT EXISTS {
\t\t\t\tGRAPH $shapesGraph {
\t\t\t\t\t$ignoredProperties rdf:rest*/rdf:first ?predicate .
\t\t\t\t}
\t\t\t}))
\t\t}
""" ;
    ] ;
.
sh:DatatypeConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Values must have datatype {$datatype}" ;
  sh:message "Value does not have datatype {$datatype}" ;
.
sh:DisjointConstraintComponent
  dash:localConstraint true ;
  sh:validator [
      a sh:SPARQLAskValidator ;
      sh:ask """
\t\tASK {
\t\t\tFILTER NOT EXISTS {
\t\t\t\t$this $disjoint $value .
\t\t\t}
\t\t}
\t\t""" ;
      sh:message "Property must not share any values with {$disjoint}" ;
      sh:prefixes <http://datashapes.org/dash> ;
    ] ;
.
sh:EqualsConstraintComponent
  dash:localConstraint true ;
  sh:message "Must have same values as {$equals}" ;
  sh:nodeValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT DISTINCT $this ?value
\t\tWHERE {
\t\t\t{
\t\t\t\tFILTER NOT EXISTS { $this $equals $this }
\t\t\t\tBIND ($this AS ?value) .
\t\t\t}
\t\t\tUNION
\t\t\t{
\t\t\t\t$this $equals ?value .
\t\t\t\tFILTER (?value != $this) .
\t\t\t}
\t\t}
\t\t""" ;
    ] ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT DISTINCT $this ?value
\t\tWHERE {
\t\t\t{
\t\t\t\t$this $PATH ?value .
\t\t\t\tMINUS {
\t\t\t\t\t$this $equals ?value .
\t\t\t\t}
\t\t\t}
\t\t\tUNION
\t\t\t{
\t\t\t\t$this $equals ?value .
\t\t\t\tMINUS {
\t\t\t\t\t$this $PATH ?value .
\t\t\t\t}
\t\t\t}
\t\t}
\t\t""" ;
    ] ;
.
sh:Function
  dash:abstract true ;
.
sh:HasValueConstraintComponent
  dash:localConstraint true ;
  sh:labelTemplate "Must have value {$hasValue}" ;
  sh:nodeValidator [
      a sh:SPARQLAskValidator ;
      sh:ask """ASK {
    FILTER ($value = $hasValue)
}""" ;
      sh:message "Value must be {$hasValue}" ;
      sh:prefixes <http://datashapes.org/dash> ;
    ] ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:message "Missing expected value {$hasValue}" ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT $this
\t\tWHERE {
\t\t\tFILTER NOT EXISTS { $this $PATH $hasValue }
\t\t}
\t\t""" ;
    ] ;
.
sh:InConstraintComponent
  dash:localConstraint true ;
  sh:labelTemplate "Value must be in {$in}" ;
  sh:message "Value is not in {$in}" ;
  sh:validator dash:isIn ;
.
sh:LanguageInConstraintComponent
  dash:localConstraint true ;
  sh:labelTemplate "Language must match any of {$languageIn}" ;
  sh:message "Language does not match any of {$languageIn}" ;
  sh:validator dash:isLanguageIn ;
.
sh:LessThanConstraintComponent
  dash:localConstraint true ;
  sh:message "Value is not < value of {$lessThan}" ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT $this ?value
\t\tWHERE {
\t\t\t$this $PATH ?value .
\t\t\t$this $lessThan ?otherValue .
\t\t\tBIND (?value < ?otherValue AS ?result) .
\t\t\tFILTER (!bound(?result) || !(?result)) .
\t\t}
\t\t""" ;
    ] ;
.
sh:LessThanOrEqualsConstraintComponent
  dash:localConstraint true ;
  sh:message "Value is not <= value of {$lessThanOrEquals}" ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT DISTINCT $this ?value
\t\tWHERE {
\t\t\t$this $PATH ?value .
\t\t\t$this $lessThanOrEquals ?otherValue .
\t\t\tBIND (?value <= ?otherValue AS ?result) .
\t\t\tFILTER (!bound(?result) || !(?result)) .
\t\t}
""" ;
    ] ;
.
sh:MaxCountConstraintComponent
  dash:localConstraint true ;
  sh:labelTemplate "Must not have more than {$maxCount} values" ;
  sh:message "More than {$maxCount} values" ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT $this
\t\tWHERE {
\t\t\t$this $PATH ?value .
\t\t}
\t\tGROUP BY $this
\t\tHAVING (COUNT(DISTINCT ?value) > $maxCount)
\t\t""" ;
    ] ;
.
sh:MaxExclusiveConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must be < {$maxExclusive}" ;
  sh:message "Value is not < {$maxExclusive}" ;
  sh:validator dash:hasMaxExclusive ;
.
sh:MaxInclusiveConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must be <= {$maxInclusive}" ;
  sh:message "Value is not <= {$maxInclusive}" ;
  sh:validator dash:hasMaxInclusive ;
.
sh:MaxLengthConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must not have more than {$maxLength} characters" ;
  sh:message "Value has more than {$maxLength} characters" ;
  sh:validator dash:hasMaxLength ;
.
sh:MinCountConstraintComponent
  dash:localConstraint true ;
  sh:labelTemplate "Must have at least {$minCount} values" ;
  sh:message "Fewer than {$minCount} values" ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT $this
\t\tWHERE {
\t\t\tOPTIONAL {
\t\t\t\t$this $PATH ?value .
\t\t\t}
\t\t}
\t\tGROUP BY $this
\t\tHAVING (COUNT(DISTINCT ?value) < $minCount)
\t\t""" ;
    ] ;
.
sh:MinExclusiveConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must be > {$minExclusive}" ;
  sh:message "Value is not > {$minExclusive}" ;
  sh:validator dash:hasMinExclusive ;
.
sh:MinInclusiveConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must be >= {$minInclusive}" ;
  sh:message "Value is not >= {$minInclusive}" ;
  sh:validator dash:hasMinInclusive ;
.
sh:MinLengthConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must have less than {$minLength} characters" ;
  sh:message "Value has less than {$minLength} characters" ;
  sh:validator dash:hasMinLength ;
.
sh:NodeConstraintComponent
  sh:message "Value does not have shape {$node}" ;
.
sh:NodeKindConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must have node kind {$nodeKind}" ;
  sh:message "Value does not have node kind {$nodeKind}" ;
  sh:validator dash:hasNodeKind ;
.
sh:NotConstraintComponent
  sh:labelTemplate "Value must not have shape {$not}" ;
  sh:message "Value does have shape {$not}" ;
.
sh:Parameterizable
  dash:abstract true ;
.
sh:PatternConstraintComponent
  dash:staticConstraint true ;
  sh:labelTemplate "Value must match pattern \\"{$pattern}\\"" ;
  sh:message "Value does not match pattern \\"{$pattern}\\"" ;
  sh:validator dash:hasPattern ;
.
sh:QualifiedMaxCountConstraintComponent
  sh:labelTemplate "No more than {$qualifiedMaxCount} values can have shape {$qualifiedValueShape}" ;
  sh:message "More than {$qualifiedMaxCount} values have shape {$qualifiedValueShape}" ;
.
sh:QualifiedMinCountConstraintComponent
  sh:labelTemplate "No fewer than {$qualifiedMinCount} values can have shape {$qualifiedValueShape}" ;
  sh:message "Fewer than {$qualifiedMinCount} values have shape {$qualifiedValueShape}" ;
.
sh:Rule
  dash:abstract true ;
.
sh:Rules
  a rdfs:Resource ;
  rdfs:comment "The SHACL rules entailment regime." ;
  rdfs:label "SHACL Rules" ;
  rdfs:seeAlso <https://www.w3.org/TR/shacl-af/#Rules> ;
.
sh:SPARQLExecutable
  dash:abstract true ;
.
sh:Shape
  dash:abstract true ;
.
sh:Target
  dash:abstract true ;
.
sh:TargetType
  dash:abstract true ;
.
sh:UniqueLangConstraintComponent
  dash:localConstraint true ;
  sh:labelTemplate "No language can be used more than once" ;
  sh:message "Language \\"{?lang}\\" used more than once" ;
  sh:propertyValidator [
      a sh:SPARQLSelectValidator ;
      sh:prefixes <http://datashapes.org/dash> ;
      sh:select """
\t\tSELECT DISTINCT $this ?lang
\t\tWHERE {
\t\t\t{
\t\t\t\tFILTER sameTerm($uniqueLang, true) .
\t\t\t}
\t\t\t$this $PATH ?value .
\t\t\tBIND (lang(?value) AS ?lang) .
\t\t\tFILTER (bound(?lang) && ?lang != "") .
\t\t\tFILTER EXISTS {
\t\t\t\t$this $PATH ?otherValue .
\t\t\t\tFILTER (?otherValue != ?value && ?lang = lang(?otherValue)) .
\t\t\t}
\t\t}
\t\t""" ;
    ] ;
.
sh:Validator
  dash:abstract true ;
.
sh:order
  rdfs:range xsd:decimal ;
.
`),
);
