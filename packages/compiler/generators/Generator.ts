import * as ast from "../ast";

export interface Generator {
  generate(ast: ast.Ast): string;
}
