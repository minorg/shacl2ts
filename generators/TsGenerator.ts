import { Project, type SourceFile, ts } from "ts-morph";
import type * as ast from "../ast";
import ScriptTarget = ts.ScriptTarget;

export abstract class TsGenerator {
  private readonly project: Project;
  private readonly sourceFile: SourceFile;

  constructor(private readonly ast: ast.Ast) {
    this.project = new Project({
      compilerOptions: {
        target: ScriptTarget.ES2020,
      },
      useInMemoryFileSystem: true,
    });
    this.sourceFile = this.project.createSourceFile("generated.ts");
  }

  generate(): string {
    for (const objectType of this.ast.objectTypes) {
      this.addObjectType(objectType, this.sourceFile);
    }
    return this.project
      .getFileSystem()
      .readFileSync(this.sourceFile.getFilePath());
  }

  protected abstract addObjectType(
    objectType: ast.ObjectType,
    sourceFile: SourceFile,
  ): void;
}
