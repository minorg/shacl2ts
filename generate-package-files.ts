import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { stringify as stringifyYaml } from "yaml";

const VERSION = "2.0.13";

type PackageName = "cli" | "compiler" | "runtime" | "shacl-ast";

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
  linkableDependencies?: readonly string[];
  name: PackageName;
}

const externalDependencyVersions = {
  "@rdfjs/term-map": "^2.0.2",
  "@rdfjs/term-set": "^2.0.3",
  "@rdfjs/types": "^1.1.0",
  "@tpluscode/rdf-ns-builders": "^4.3.0",
  "@types/n3": "^1.21.1",
  "@types/rdfjs__term-map": "^2.0.10",
  "@types/rdfjs__term-set": "^2.0.9",
  n3: "^1.21.3",
  pino: "^9.1.0",
  "purify-ts": "^2.1.0",
  "rdfjs-resource": "1.0.14",
};

const packages: readonly Package[] = [
  {
    bin: {
      shaclmate: "cli.js",
    },
    dependencies: {
      external: {
        "@types/n3": externalDependencyVersions["@types/n3"],
        "@types/rdf-validate-shacl": "^0.4.7",
        "cmd-ts": "^0.13.0",
        n3: externalDependencyVersions["n3"],
        pino: externalDependencyVersions["pino"],
        "rdf-validate-shacl": "^0.5.6",
      },
      internal: ["compiler"],
    },
    name: "cli",
  },
  {
    dependencies: {
      external: {
        "@rdfjs/prefix-map": "^0.1.2",
        "@rdfjs/term-map": externalDependencyVersions["@rdfjs/term-map"],
        "@rdfjs/term-set": externalDependencyVersions["@rdfjs/term-set"],
        "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
        "@sindresorhus/base62": "^0.1.0",
        "@tpluscode/rdf-ns-builders":
          externalDependencyVersions["@tpluscode/rdf-ns-builders"],
        "@types/rdfjs__prefix-map": "^0.1.5",
        "@types/rdfjs__term-map":
          externalDependencyVersions["@types/rdfjs__term-map"],
        "@types/rdfjs__term-set":
          externalDependencyVersions["@types/rdfjs__term-set"],
        "@types/toposort": "2.0.7",
        "change-case": "^5.4.4",
        pino: externalDependencyVersions["pino"],
        "reserved-identifiers": "^1.0.0",
        toposort: "2.0.2",
        "ts-invariant": "^0.10.3",
        "ts-morph": "^24.0.0",
        "typescript-memoize": "^1.1.1",
      },
      internal: ["shacl-ast"],
    },
    devDependencies: {
      internal: ["runtime"],
    },
    linkableDependencies: ["purify-ts-helpers", "rdfjs-resource"],
    name: "compiler",
  },
  {
    dependencies: {
      external: {
        "@kos-kit/sparql-builder": "2.0.106",
        "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
        "@types/n3": externalDependencyVersions["@types/n3"],
        "@types/uuid": "^9.0.1",
        "js-sha256": "^0.11.0",
        n3: externalDependencyVersions["n3"],
        "purify-ts": externalDependencyVersions["purify-ts"],
        "purify-ts-helpers": "1.0.7",
        "rdf-literal": "^1.3.2",
        "rdfjs-resource": externalDependencyVersions["rdfjs-resource"],
        uuid: "^9.0.1",
      },
    },
    linkableDependencies: [
      "@kos-kit/sparql-builder",
      "purify-ts-helpers",
      "rdfjs-resource",
    ],
    name: "runtime",
  },
  {
    dependencies: {
      external: {
        "@rdfjs/term-map": externalDependencyVersions["@rdfjs/term-map"],
        "@rdfjs/term-set": externalDependencyVersions["@rdfjs/term-set"],
        "@rdfjs/types": externalDependencyVersions["@rdfjs/types"],
        "@tpluscode/rdf-ns-builders":
          externalDependencyVersions["@tpluscode/rdf-ns-builders"],
        "@types/rdfjs__term-map":
          externalDependencyVersions["@types/rdfjs__term-map"],
        "@types/rdfjs__term-set":
          externalDependencyVersions["@types/rdfjs__term-set"],
        "purify-ts": externalDependencyVersions["purify-ts"],
        "rdfjs-resource": externalDependencyVersions["rdfjs-resource"],
      },
    },
    devDependencies: {
      external: {
        "@types/n3": externalDependencyVersions["@types/n3"],
        n3: externalDependencyVersions["n3"],
      },
    },
    linkableDependencies: ["rdfjs-resource"],
    name: "shacl-ast",
  },
];

const myDirPath = path.dirname(url.fileURLToPath(import.meta.url));

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

  const packageDirectoryPath = path.join(myDirPath, "packages", package_.name);

  fs.mkdirSync(packageDirectoryPath, { recursive: true });

  const files = new Set<string>();
  for (const dirent of fs.readdirSync(packageDirectoryPath, {
    withFileTypes: true,
    recursive: true,
  })) {
    if (
      !dirent.name.endsWith(".ts") ||
      !dirent.isFile() ||
      dirent.path.startsWith(path.join(packageDirectoryPath, "node_modules")) ||
      dirent.path.startsWith(path.join(packageDirectoryPath, "__tests__"))
    ) {
      continue;
    }
    for (const fileNameGlob of ["*.js", "*.d.ts"]) {
      files.add(
        path.join(
          path.relative(packageDirectoryPath, dirent.parentPath),
          fileNameGlob,
        ),
      );
    }
  }

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
        files: files.size > 0 ? [...files].sort() : undefined,
        main: files.size > 0 ? "index.js" : undefined,
        license: "Apache-2.0",
        name: `@shaclmate/${package_.name}`,
        scripts: {
          build: "tsc -b",
          check: "biome check",
          "check:write": "biome check --write",
          "check:write:unsafe": "biome check --write --unsafe",
          clean:
            "rimraf -g **/*.d.ts* **/*.js **/*.js.map tsconfig.tsbuildinfo",
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
        version: VERSION,
      },
      undefined,
      2,
    )}\n`,
  );

  for (const fileName of ["biome.json", "LICENSE", "tsconfig.json"]) {
    // const rootFilePath = path.resolve(myDirPath, fileName);
    const packageFilePath = path.resolve(packageDirectoryPath, fileName);
    if (fs.existsSync(packageFilePath)) {
      continue;
    }
    fs.symlinkSync(`../../${fileName}`, packageFilePath);
  }
}

// Root package.json
fs.writeFileSync(
  path.join(myDirPath, "package.json"),
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
      name: "shaclmate",
      optionalDependencies: {
        "@biomejs/cli-linux-x64": "1.9.4",
        "@rollup/rollup-linux-x64-gnu": "4.24.0",
      },
      private: true,
      scripts: {
        build: "npm run build --workspaces",
        check: "biome check",
        "check:write": "biome check --write",
        "check:write:unsafe": "biome check --write --unsafe",
        clean: "npm run clean --workspaces",
        "generate-package-files": "tsx generate-package-files.ts",
        link: "npm link --workspaces",
        "link-dependencies": "npm run link-dependencies --workspaces",
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
  path.join(myDirPath, ".github", "workflows", "continuous-integration.yml"),
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
                path.join(myDirPath, "packages", package_.name, "__tests__"),
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
