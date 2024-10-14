import { Project, type SourceFile } from "ts-morph";
import type * as ast from "../../ast";
import * as types from "./types";

export abstract class TsGenerator {
  private readonly project: Project;
  private readonly sourceFile: SourceFile;

  constructor(private readonly ast: ast.Ast) {
    this.project = new Project({
      useInMemoryFileSystem: true,
    });
    this.sourceFile = this.project.createSourceFile("generated.ts");
  }

  protected abstract addImportDeclarations(toSourceFile: SourceFile): void;

  protected abstract addObjectType(
    astObjectType: types.ObjectType,
    toSourceFile: SourceFile,
  ): void;

  generate(): string {
    this.addImportDeclarations(this.sourceFile);

    const astObjectTypes = this.ast.objectTypes.concat();
    astObjectTypes.sort((left, right) => {
      if (
        left.ancestorObjectTypes.some((ancestorObjectType) =>
          ancestorObjectType.name.identifier.equals(right.name.identifier),
        )
      ) {
        // Right is an ancestor of left, right must come first
        return 1;
      }
      if (
        right.ancestorObjectTypes.some((ancestorObjectType) =>
          ancestorObjectType.name.identifier.equals(left.name.identifier),
        )
      ) {
        // Left is an ancestor of right, left must come first
        return -1;
      }
      // Neither is an ancestor of the other, sort by name
      return left.name.tsName.localeCompare(right.name.tsName);
    });
    for (const astObjectType of astObjectTypes) {
      this.addObjectType(
        types.ObjectType.fromAstType(astObjectType),
        this.sourceFile,
      );
    }

    this.sourceFile.saveSync();
    return this.project
      .getFileSystem()
      .readFileSync(this.sourceFile.getFilePath());
  }
}
