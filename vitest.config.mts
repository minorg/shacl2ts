/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["__tests__/**/*.test.ts"],
    passWithNoTests: true,
  },
});
