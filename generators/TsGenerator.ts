import { xsd } from "@tpluscode/rdf-ns-builders";
import { NodeKind } from "shacl-ast";
import { Project, type SourceFile } from "ts-morph";
import { Memoize } from "typescript-memoize";
import type * as ast from "../ast";

export abstract class TsGenerator {
  private readonly project: Project;
  private readonly sourceFile: SourceFile;

  constructor(private readonly ast: ast.Ast) {
    this.project = new Project({
      useInMemoryFileSystem: true,
    });
    this.sourceFile = this.project.createSourceFile("generated.ts");
  }

  protected addImportDeclarations(toSourceFile: SourceFile): void {
    toSourceFile.addImportDeclaration({
      moduleSpecifier: "@rdfjs/types",
      namespaceImport: "rdfjs",
    });
    toSourceFile.addImportDeclaration({
      moduleSpecifier: "purify-ts",
      namespaceImport: "purify",
    });
  }

  protected abstract addObjectType(
    astObjectType: ast.ObjectType,
    toSourceFile: SourceFile,
  ): void;

  generate(): string {
    this.addImportDeclarations(this.sourceFile);
    for (const objectType of this.ast.objectTypes) {
      this.addObjectType(objectType, this.sourceFile);
    }
    this.sourceFile.saveSync();
    return this.project
      .getFileSystem()
      .readFileSync(this.sourceFile.getFilePath());
  }
}

export namespace TsGenerator {
  export abstract class Type<AstType extends ast.Type> {
    constructor(
      protected readonly astType: AstType,
      protected readonly factory: Factory,
    ) {}

    /**
     * TypeScript type when the property is externed/not inlined.
     */
    abstract readonly externName: string;

    /**
     * TypeScript type when the property is inlined.
     */
    abstract readonly inlineName: string;
  }

  abstract class ComposedType<
    AstType extends ast.AndType | ast.OrType,
  > extends Type<AstType> {
    get externName(): string {
      if (this.types.every((type) => type instanceof LiteralType)) {
        return "rdfjs.Literal";
      }

      return `(${this.types.map((type) => type.externName).join(` ${this.separator} `)})`;
    }

    get inlineName(): string {
      if (this.types.every((type) => type instanceof LiteralType)) {
        return "rdfjs.Literal";
      }

      return `(${this.types.map((type) => type.inlineName).join(` ${this.separator} `)})`;
    }

    @Memoize()
    private get types(): readonly Type<ast.Type>[] {
      return this.astType.types.map((astType) =>
        this.factory.createType(astType),
      );
    }

    protected abstract readonly separator: string;
  }

  export class AndType extends ComposedType<ast.AndType> {
    protected readonly separator = "&";
  }

  export abstract class Factory {
    createAndType(astType: ast.AndType): AndType {
      return new AndType(astType, this);
    }

    createEnumType(astType: ast.EnumType): EnumType {
      return new EnumType(astType, this);
    }

    createLiteralType(astType: ast.LiteralType): LiteralType {
      return new LiteralType(astType, this);
    }

    createNumberType(astType: ast.LiteralType): LiteralType {
      return new NumberType(astType, this);
    }

    abstract createObjectType(astType: ast.ObjectType): ObjectType;

    createOrType(astType: ast.OrType): OrType {
      return new OrType(astType, this);
    }

    createProperty(astProperty: ast.Property): Property {
      return new Property(astProperty, this);
    }

    createStringType(astType: ast.LiteralType): LiteralType {
      return new StringType(astType, this);
    }

    createType(astType: ast.Type): Type<ast.Type> {
      switch (astType.kind) {
        case "And":
          return this.createAndType(astType);
        case "Enum":
          return this.createEnumType(astType);
        case "Literal": {
          const datatype = astType.datatype.orDefault(xsd.string);
          if (datatype.equals(xsd.integer)) {
            return this.createNumberType(astType);
          }
          if (datatype.equals(xsd.anyURI) || datatype.equals(xsd.string)) {
            return this.createStringType(astType);
          }
          return this.createLiteralType(astType);
        }
        case "Object":
          return this.createObjectType(astType);
        case "Or":
          return this.createOrType(astType);
      }
    }
  }

  export class EnumType extends Type<ast.EnumType> {
    get externName(): string {
      throw new Error("not implemented");
    }

    get inlineName(): string {
      throw new Error("not implemented");
    }
  }

  export class LiteralType extends Type<ast.LiteralType> {
    get externName(): string {
      return this.inlineName;
    }

    get inlineName(): string {
      return "rdfjs.Literal";
    }
  }

  export class ObjectType extends Type<ast.ObjectType> {
    readonly ancestorObjectTypes: readonly ObjectType[];
    readonly properties: readonly Property[];
    readonly superObjectTypes: readonly ObjectType[];

    constructor(astType: ast.ObjectType, factory: Factory) {
      super(astType, factory);
      this.ancestorObjectTypes = this.astType.ancestorObjectTypes.map(
        (astObjectType) => this.factory.createObjectType(astObjectType),
      );
      this.properties = this.astType.properties.map((astProperty) =>
        this.factory.createProperty(astProperty),
      );
      this.superObjectTypes = this.astType.superObjectTypes.map(
        (astObjectType) => this.factory.createObjectType(astObjectType),
      );
    }

    get externName(): string {
      return this.identifierTypeName;
    }

    get identifierTypeName(): string {
      const identifierTypeNames: string[] = [];
      if (this.astType.nodeKinds.has(NodeKind.BLANK_NODE)) {
        identifierTypeNames.push("rdfjs.BlankNode");
      }
      if (this.astType.nodeKinds.has(NodeKind.IRI)) {
        identifierTypeNames.push("rdfjs.NamedNode");
      }
      return identifierTypeNames.join(" | ");
    }

    get inlineName(): string {
      return this.astType.name.tsName;
    }
  }

  export class OrType extends ComposedType<ast.OrType> {
    protected readonly separator = "|";
  }

  export class Property {
    readonly type: Type<ast.Type>;

    constructor(
      private readonly astProperty: ast.Property,
      private readonly factory: Factory,
    ) {
      this.type = this.factory.createType(astProperty.type);
    }

    get inline(): boolean {
      return this.astProperty.inline;
    }

    get name(): string {
      return this.astProperty.name.tsName;
    }

    @Memoize()
    get typeName(): string {
      const minCount = this.astProperty.minCount;
      const maxCount = this.astProperty.maxCount.extractNullable();
      let type = this.inline ? this.type.inlineName : this.type.externName;
      if (minCount === 0 && maxCount === 1) {
        type = `purify.Maybe<${type}>`;
      } else if (minCount === 1 && maxCount === 1) {
      } else {
        type = `readonly (${type})[]`;
      }
      return type;
    }
  }

  // LiteralType subclasses
  export class NumberType extends LiteralType {
    override get inlineName(): string {
      return "number";
    }
  }

  export class StringType extends LiteralType {
    override get inlineName(): string {
      return "string";
    }
  }
}
