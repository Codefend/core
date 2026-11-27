import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const commonjs = require("codefend");
const esm = await import("codefend");
const packageRoot = resolve(dirname(require.resolve("codefend")), "..");
const manifest = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"));
const expectedExports = [
  "buildDebugOptions",
  "buildParserOptions",
  "buildRuntimeOptions",
  "buildTransformationOptions",
  "obfuscate",
  "startCLI",
  "stats",
];

assert.deepEqual(Object.keys(commonjs).sort(), expectedExports);
assert.deepEqual(Object.keys(esm).sort(), expectedExports);

for (const target of [
  manifest.main,
  manifest.module,
  manifest.types,
  manifest.exports.import.import,
  manifest.exports.import.types,
  manifest.exports.require.require,
  manifest.exports.require.types,
  manifest.bin.codefend,
]) {
  assert.ok(readFileSync(resolve(packageRoot, target)).length, "Missing package target: " + target);
}

for (const entry of [manifest.main, manifest.module]) {
  const code = readFileSync(resolve(packageRoot, entry), "utf8");
  const map = JSON.parse(readFileSync(resolve(packageRoot, entry + ".map"), "utf8"));
  assert.ok(code.includes("sourceMappingURL="), "Missing source map reference: " + entry);
  assert.ok(map.sources.length > 0, "Empty source map: " + entry);
  assert.ok(map.sourcesContent.some((source) => source?.includes("function obfuscate(")));
}

function checkAPI(api) {
  const parser = api.buildParserOptions().data;
  assert.ok(parser);
  const defaults = api.buildTransformationOptions();
  assert.equal(api.obfuscate("const l_value = 1;", defaults, parser, api.buildRuntimeOptions()), "const Ox0 = 1;");
  const prefixed = api.buildParserOptions({ name: "prefixed" }).data;
  assert.ok(prefixed);
  assert.equal(
    api.obfuscate("l_total external_value LED_BUILTIN pkg-file", defaults, prefixed, api.buildRuntimeOptions()),
    "Ox0 external_value LED_BUILTIN pkg-file",
  );
  assert.equal(
    api.obfuscate(
      "const l_value = 1;",
      api.buildTransformationOptions({ prefix: "Zx" }),
      parser,
      api.buildRuntimeOptions(),
    ),
    "const Zx0 = 1;",
  );
  assert.equal(
    api.obfuscate(
      "l_first l_second",
      api.buildTransformationOptions({ pool: ["alpha", "bravo"] }),
      parser,
      api.buildRuntimeOptions(),
    ),
    "alpha bravo",
  );
  assert.equal(
    api.obfuscate(
      "l_value",
      api.buildTransformationOptions({ static: [{ from: "l_value", to: "changed" }], ignore: ["l_value"] }),
      parser,
      api.buildRuntimeOptions(),
    ),
    "l_value",
  );
  assert.equal(api.buildDebugOptions().stats, true);
  assert.equal(api.stats({ stats: false }, api.buildRuntimeOptions()), undefined);
}

checkAPI(commonjs);
checkAPI(esm);

for (const [argument, expected] of [
  ["--version", manifest.version],
  ["--help", "Usage: codefend [options]"],
]) {
  const result = spawnSync(process.execPath, [resolve(packageRoot, manifest.bin.codefend), argument], {
    encoding: "utf8",
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(expected), "Unexpected CLI output for " + argument);
  if (argument === "--help") {
    assert.match(result.stdout, /^  -c, --check\s+Check the config file for potential warnings\/errors$/m);
    assert.match(result.stdout, /^  -o, --obfuscate\s+Obfuscate the project$/m);
  }
}

console.log(
  JSON.stringify({
    node: process.version,
    packageVersion: manifest.version,
    exports: expectedExports,
    checks: ["CommonJS", "ESM", "entry points", "source maps", "public API", "CLI help/version"],
  }),
);
