import * as ast from "../ast/index.js";

export interface Generator {
  generate(ast: ast.Ast): string;
}
