import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "vitest";

describe("AstJsonGenerator", () => {
  for (const directoryName of ["kitchen-sink", "skos"]) {
    //["mlm", "sdo"]) {
    it(`should generate valid JSON for ${directoryName}`, async ({
      expect,
    }) => {
      const jsonString = (
        await fs.promises.readFile(
          path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "..",
            "..",
            "..",
            "..",
            "..",
            "examples",
            directoryName,
            "generated",
            "ast.json",
          ),
        )
      ).toString();
      const json = JSON.parse(jsonString);
      expect(Object.entries(json)).not.toHaveLength(0);
    });
  }
});
