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

    abstract readonly name: string;
  }

  export class AndType extends Type<ast.AndType> {
    get name(): string {
      return `(${this.types.map((type) => type.name).join(" & ")})`;
    }

    @Memoize()
    private get types(): readonly Type<ast.Type>[] {
      return this.astType.types.map((astType) =>
        this.factory.createType(astType),
      );
    }
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
    get name(): string {
      throw new Error("not implemented");
    }
  }

  export class LiteralType extends Type<ast.LiteralType> {
    get name(): string {
      return "rdfjs.Literal";
    }
  }

  export class ObjectType extends Type<ast.ObjectType> {
    readonly properties: readonly Property[];

    constructor(astType: ast.ObjectType, factory: Factory) {
      super(astType, factory);
      this.properties = this.astType.properties.map((astProperty) =>
        this.factory.createProperty(astProperty),
      );
    }

    get name(): string {
      return this.astType.name.tsName;
    }

    get nodeType(): string {
      switch (this.astType.nodeKind) {
        case NodeKind.BLANK_NODE:
          return "rdfjs.BlankNode";
        case NodeKind.BLANK_NODE_OR_IRI:
          return "rdfjs.BlankNode | rdfjs.NamedNode";
        case NodeKind.IRI:
          return "rdfjs.NamedNode";
        default:
          throw new RangeError(this.astType.nodeKind);
      }
    }
  }

  export class OrType extends Type<ast.OrType> {
    get name(): string {
      return `(${this.types.map((type) => type.name).join(" | ")})`;
    }

    @Memoize()
    private get types(): readonly Type<ast.Type>[] {
      return this.astType.types.map((astType) =>
        this.factory.createType(astType),
      );
    }
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
      const minCount = this.astProperty.minCount.orDefault(0);
      const maxCount = this.astProperty.maxCount.extractNullable();
      let type = this.type.name;
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
    override get name(): string {
      return "number";
    }
  }

  export class StringType extends LiteralType {
    override get name(): string {
      return "string";
    }
  }
}
