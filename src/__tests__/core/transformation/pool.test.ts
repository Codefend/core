import { describe, expect, it } from "vitest";

import { buildMap } from "../../../core/mapper/mapper.js";
import { buildTransformationPoolOption } from "../../../core/options/options.js";
import { buildRuntimeOptions, WordEncryptionType } from "../../../core/process/runtime.js";
import { mapDefaultWords } from "../../../core/transformation/default.js";
import { mapIgnoredWords } from "../../../core/transformation/ignore.js";
import { mapPoolWords } from "../../../core/transformation/pool.js";
import { mapStaticWords } from "../../../core/transformation/static.js";

describe("Pool words", () => {
  const pool = [
    "s",
    "sm",
    "normalUpperCase",
    "_c.o,n/t'a;in[s]-s=p+e*c%i$a#l@c!h^a&racters",
    "contain\nsnewline",
    "0123StartWithNumber",
  ];
  const expectedParsedPool = ["normaluppercase", "containsspecialcharacters", "containsnewline", "startwithnumber"];

  it("ensure correct pool parsing", () => {
    expect(buildTransformationPoolOption(pool)).toEqual(expectedParsedPool);
  });

  it("ensure correct mapping", () => {
    const runtime = buildRuntimeOptions();
    buildMap(
      {
        words: [
          { value: "l_first", fromRegex: "main" },
          { value: "l_second", fromRegex: "main" },
        ],
      },
      runtime,
    );

    mapPoolWords({ prefix: "Ox", pool: ["alpha", "bravo"] }, runtime);

    expect(runtime.map).toEqual({ l_first: "alpha", l_second: "bravo" });
    expect(runtime.processed.map.l_first).toEqual({ target: "alpha", type: WordEncryptionType.pool, count: 1 });
    expect(runtime.processed.map.l_second).toEqual({ target: "bravo", type: WordEncryptionType.pool, count: 1 });
  });

  it("ensure fallback to prefix when pool is fully consumed", () => {
    const runtime = buildRuntimeOptions();
    buildMap(
      {
        words: [
          { value: "l_first", fromRegex: "main" },
          { value: "l_second", fromRegex: "main" },
        ],
      },
      runtime,
    );

    mapPoolWords({ prefix: "Zx", pool: ["alpha"] }, runtime);
    mapDefaultWords({ prefix: "Zx" }, runtime);

    expect(runtime.map).toEqual({ l_first: "alpha", l_second: "Zx0" });
    expect(runtime.processed.map.l_second).toEqual({ target: "Zx0", type: WordEncryptionType.default, count: 1 });
  });

  it("preserves static and ignored mappings without consuming pool entries", () => {
    const runtime = buildRuntimeOptions();
    buildMap({ words: ["l_static", "l_ignored", "l_first"].map((value) => ({ value, fromRegex: "main" })) }, runtime);
    mapStaticWords({ static: [{ from: "l_static", to: "fixed" }] }, runtime);
    mapIgnoredWords({ ignore: ["l_ignored"] }, runtime);

    mapPoolWords({ prefix: "Ox", pool: ["alpha"] }, runtime);
    mapDefaultWords({ prefix: "Ox" }, runtime);

    expect(runtime.map).toEqual({ l_static: "fixed", l_ignored: "l_ignored", l_first: "alpha" });
    expect(runtime.processed.map.l_static!.type).toBe(WordEncryptionType.static);
    expect(runtime.processed.map.l_ignored!.type).toBe(WordEncryptionType.ignore);
  });

  it("leaves every word available for the default transformation when the pool is empty", () => {
    const runtime = buildRuntimeOptions();
    buildMap({ words: [{ value: "l_first", fromRegex: "main" }] }, runtime);

    mapPoolWords({ prefix: "Zx", pool: [] }, runtime);
    mapDefaultWords({ prefix: "Zx" }, runtime);

    expect(runtime.map).toEqual({ l_first: "Zx0" });
    expect(runtime.processed.map.l_first!.type).toBe(WordEncryptionType.default);
  });
});
