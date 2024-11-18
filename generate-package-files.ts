import fs from "node:fs";
import path from "node:path";
import { stringify as stringifyYaml } from "yaml";

const VERSION = "2.0.12";

type PackageName = "cli" | "compiler" | "runtime";

interface Package {
  bin?: Record<string, string>;
  dependencies?: {
    external?: Record<string, string>;
    internal?: readonly string[];
  };
  devDependencies?: {
    external?: Record<string, string>;
    internal?: readonly string[];
  };
  files?: readonly string[];
  linkableDependencies?: readonly string[];
  name: PackageName;
}

const externalDependencyVersions = {
  n3: "^1.21.3",
  "@rdfjs/types": "^1.1.0",
  "@types/n3": "^1.21.1",
};

const packages: readonly Package[] = [
  {
    bin: {
      shaclmate: "cli.js",
    },
    dependencies: {
      external: {
        "cmd-ts": "^0.13.0",
      },
      internal: ["compiler"],
    },
    name: "cli",
  },
  {
    dependencies: {
      external: {
        "@rdfjs/prefix-map": "^0.1.2",
        "@rdfjs/term-map": "^2.0.2",
        "@rdfjs/term-set": "^2.0.3",
        "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
        "@sindresorhus/base62": "^0.1.0",
        "@tpluscode/rdf-ns-builders": "^4.3.0",
        "@types/n3": externalDependencyVersions["@types/n3"],
        "@types/rdfjs__prefix-map": "^0.1.5",
        "@types/rdfjs__term-map": "^2.0.10",
        "@types/rdfjs__term-set": "^2.0.9",
        "change-case": "^5.4.4",
        n3: externalDependencyVersions["n3"],
        "reserved-identifiers": "^1.0.0",
        "shacl-ast": "2.0.12",
        "ts-invariant": "^0.10.3",
        "ts-morph": "^24.0.0",
        "typescript-memoize": "^1.1.1",
      },
    },
    devDependencies: {
      internal: ["runtime"],
    },
    linkableDependencies: ["purify-ts-helpers", "rdfjs-resource", "shacl-ast"],
    name: "compiler",
  },
  {
    dependencies: {
      external: {
        "@kos-kit/sparql-builder": "2.0.94",
        "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
        "@types/n3": externalDependencyVersions["@types/n3"],
        "js-sha256": "^0.11.0",
        n3: externalDependencyVersions["n3"],
        "purify-ts": "^2.1.0",
        "purify-ts-helpers": "1.0.7",
        "rdf-literal": "^1.3.2",
        "rdfjs-resource": "1.0.12",
      },
    },
    linkableDependencies: [
      "@kos-kit/sparql-builder",
      "purify-ts-helpers",
      "rdfjs-resource",
    ],
    name: "runtime",
  },
];

for (const package_ of packages) {
  const internalDependencies: Record<string, string> = {};
  for (const internalDependency of package_.dependencies?.internal ?? []) {
    internalDependencies[`@shaclmate/${internalDependency}`] = VERSION;
  }
  const internalDevDependencies: Record<string, string> = {};
  for (const internalDevDependency of package_.devDependencies?.internal ??
    []) {
    internalDevDependencies[`@shaclmate/${internalDevDependency}`] = VERSION;
  }

  const packageDirectoryPath = path.join(__dirname, "packages", package_.name);

  fs.mkdirSync(packageDirectoryPath, { recursive: true });

  fs.writeFileSync(
    path.join(packageDirectoryPath, "package.json"),
    `${JSON.stringify(
      {
        bin: package_.bin,
        dependencies: {
          ...internalDependencies,
          ...package_?.dependencies?.external,
        },
        devDependencies: {
          ...internalDevDependencies,
          ...package_.devDependencies?.external,
        },
        main: "index.js",
        files: package_.files ?? ["*.d.ts", "*.js"],
        license: "Apache-2.0",
        name: `@shaclmate/${package_.name}`,
        scripts: {
          build: "tsc -b",
          check: "biome check",
          "check:write": "biome check --write",
          "check:write:unsafe": "biome check --write --unsafe",
          clean:
            "rimraf *.d.ts* *.js *.js.map __tests__/*.d.ts* __tests__/*.js __tests__/*.js.map tsconfig.tsbuildinfo",
          format: "biome format",
          "format:write": "biome format --write",
          "format:write:unsafe": "biome format --write --unsafe",
          rebuild: "run-s clean build",
          "link-dependencies": "npm link purify-ts-helpers rdfjs-resource",
          lint: "biome lint",
          "lint:write": "biome lint --write",
          "lint:write:unsafe": "biome lint --write --unsafe",
          test: "biome check && vitest run",
          "test:coverage": "biome check && vitest run --coverage",
          "test:watch": "vitest watch",
          unlink: `npm unlink -g @shaclmate/${package_.name}`,
          watch: "tsc -w --preserveWatchOutput",
        },
        repository: {
          type: "git",
          url: "git+https://github.com/minorg/shaclmate",
        },
        type: "module",
        types: "index.d.ts",
        version: "2.0.94",
      },
      undefined,
      2,
    )}\n`,
  );

  for (const fileName of ["biome.json", "LICENSE", "tsconfig.json"]) {
    // const rootFilePath = path.resolve(__dirname, fileName);
    const packageFilePath = path.resolve(packageDirectoryPath, fileName);
    if (fs.existsSync(packageFilePath)) {
      continue;
    }
    fs.symlinkSync(`../../${fileName}`, packageFilePath);
  }
}

// Root package.json
fs.writeFileSync(
  path.join(__dirname, "package.json"),
  `${JSON.stringify(
    {
      devDependencies: {
        "@biomejs/biome": "1.9.4",
        "@tsconfig/strictest": "^2.0.5",
        "@types/node": "^22",
        "@vitest/coverage-v8": "^2.0.5",
        "npm-run-all": "^4.1.5",
        rimraf: "^6.0.1",
        tsx: "^4.16.2",
        typescript: "~5.6",
        vitest: "^2.0.5",
        yaml: "^2.5.0",
      },
      name: "@shaclmate",
      optionalDependencies: {
        "@biomejs/cli-linux-x64": "1.9.4",
        "@rollup/rollup-linux-x64-gnu": "4.24.0",
      },
      private: true,
      scripts: {
        build: "npm run build --workspaces",
        check: "npm run check --workspaces",
        clean: "npm run clean --workspaces",
        "generate-package-files": "tsx generate-package-files.ts",
        link: "npm link --workspaces",
        "link-dependencies": "npm run link-dependencies --workspaces",
        lint: "npm run lint --workspaces",
        rebuild: "npm run rebuild --workspaces",
        test: "npm run test --if-present --workspaces",
        "test:coverage": "npm run test:coverage --if-present --workspaces",
        unlink: "npm run unlink --workspaces",
        watch: "run-p watch:*",
        ...packages.reduce(
          (watchEntries, package_) => {
            watchEntries[`watch:${package_.name}`] =
              `npm run watch -w @shaclmate/${package_.name}`;
            return watchEntries;
          },
          {} as Record<string, string>,
        ),
      },
      workspaces: packages.map((package_) => `packages/${package_.name}`),
    },
    undefined,
    2,
  )}\n`,
);

// Continuous Integration workflow file
fs.writeFileSync(
  path.join(__dirname, ".github", "workflows", "continuous-integration.yml"),
  stringifyYaml({
    name: "Continuous Integration",
    on: {
      push: {
        "branches-ignore": ["main"],
      },
      workflow_dispatch: null,
    },
    jobs: {
      build: {
        name: "Build and test",
        "runs-on": "ubuntu-latest",
        steps: [
          {
            uses: "actions/checkout@v4",
          },
          {
            uses: "actions/setup-node@v4",
            with: {
              cache: "npm",
              "node-version": 20,
            },
          },
          {
            name: "Install dependencies",
            run: "npm ci",
          },
          {
            name: "Build",
            run: "npm run build",
          },
          {
            name: "Test",
            run: "npm run test:coverage",
          },
          ...packages
            .filter((package_) =>
              fs.existsSync(
                path.join(__dirname, "packages", package_.name, "__tests__"),
              ),
            )
            .map((package_) => {
              return {
                if: "always()",
                uses: "davelosert/vitest-coverage-report-action@v2",
                with: {
                  "file-coverage-mode": "all",
                  name: package_.name,
                  "json-final-path": `./packages/${package_.name}/coverage/coverage-final.json`,
                  "json-summary-path": `./packages/${package_.name}/coverage/coverage-summary.json`,
                },
              };
            }),
        ],
      },
    },
  }),
);
