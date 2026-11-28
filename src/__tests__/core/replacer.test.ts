import { describe, expect, it } from "vitest";

import { buildParserOptions } from "../../core/options/options.js";
import { buildRuntimeOptions } from "../../core/process/runtime.js";
import { IReplaceOptions, replace } from "../../core/replacer/replacer.js";

describe("Replacer", () => {
  const options: IReplaceOptions = {
    code: `import * from "./lib-file";const l_var = 0;`,
    parserOptions: buildParserOptions().data!,
  };
  const runtimeOptions = buildRuntimeOptions();
  runtimeOptions.map = { l_var: "Ox0", "lib-file": "Ox1" };

  it("with default options", () => {
    const output = replace(options, runtimeOptions);
    expect(output).toEqual(`import * from "./Ox1";const Ox0 = 0;`);
  });

  it("preserves names outside the parser's boundaries and casing", () => {
    const runtime = buildRuntimeOptions();
    runtime.map = { m_total: "Ox0" };

    expect(
      replace(
        {
          code: "m_total am_total m_total_amount M_TOTAL",
          parserOptions: buildParserOptions({ name: "startWithMAndUnderscore" }).data!,
        },
        runtime,
      ),
    ).toBe("Ox0 am_total m_total_amount M_TOTAL");
  });

  it("keeps custom lookahead boundaries", () => {
    const runtime = buildRuntimeOptions();
    runtime.map = { secret: "fixed" };

    expect(
      replace(
        {
          code: "secret; secret! secretSuffix;",
          parserOptions: buildParserOptions({
            name: "custom",
            regexList: [{ name: "beforeSemicolon", value: "secret(?=;)" }],
          }).data!,
        },
        runtime,
      ),
    ).toBe("fixed; secret! secretSuffix;");
  });

  it("does not replace generated output again through another rule", () => {
    const runtime = buildRuntimeOptions();
    runtime.map = { m_first: "m_second", m_second: "done" };

    expect(
      replace(
        {
          code: "m_first m_second",
          parserOptions: buildParserOptions({
            name: "custom",
            regexList: [
              { name: "first", value: "m_first" },
              { name: "second", value: "m_second" },
            ],
          }).data!,
        },
        runtime,
      ),
    ).toBe("m_second done");
  });

  it("replaces overlapping identical matches once", () => {
    const runtime = buildRuntimeOptions();
    runtime.map = { m_total: "Ox0" };

    expect(
      replace(
        {
          code: "m_total",
          parserOptions: buildParserOptions({
            name: "custom",
            regexList: [
              { name: "one", value: "m_total" },
              { name: "two", value: "m_total" },
            ],
          }).data!,
        },
        runtime,
      ),
    ).toBe("Ox0");
  });

  it("preserves empty replacement values", () => {
    const runtime = buildRuntimeOptions();
    runtime.map = { m_total: "" };

    expect(replace({ code: "m_total m_total", parserOptions: buildParserOptions().data! }, runtime)).toBe(" ");
  });

  it("leaves an unmapped match unchanged", () => {
    expect(replace({ code: "m_total", parserOptions: buildParserOptions().data! }, buildRuntimeOptions())).toBe(
      "m_total",
    );
  });

  it("handles zero-length custom matches without repeating an insertion", () => {
    const runtime = buildRuntimeOptions();
    runtime.map = { "": "+" };

    expect(
      replace(
        {
          code: "ab",
          parserOptions: buildParserOptions({ name: "custom", regexList: [{ name: "empty", value: "" }] }).data!,
        },
        runtime,
      ),
    ).toBe("+a+b+");
  });
});
