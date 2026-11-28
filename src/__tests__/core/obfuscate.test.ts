import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

import { buildDefaultOptions, buildParserOptions, buildTransformationOptions } from "../../core/options/options.js";
import { obfuscate } from "../../core/process/obfuscate.js";
import { buildRuntimeOptions } from "../../core/process/runtime.js";

describe("Obfuscate", () => {
  describe("exact replacement", () => {
    const presets = ["default", "codeOnly", "startWithMAndUnderscore"] as const;

    it.each(presets)("preserves executable case variants with %s", (name) => {
      const code = "(() => { const m_total = 1; const M_TOTAL = 2; return m_total + M_TOTAL; })()";
      const output = obfuscate(
        code,
        buildTransformationOptions(),
        buildParserOptions({ name }).data!,
        buildRuntimeOptions(),
      );

      expect(runInNewContext(output)).toBe(3);
      if (name === "startWithMAndUnderscore") expect(output).toContain("M_TOTAL");
    });

    it("preserves unselected substrings across calls sharing a runtime", () => {
      const runtime = buildRuntimeOptions();
      const parser = buildParserOptions({ name: "startWithMAndUnderscore" }).data!;
      const transformation = buildTransformationOptions();
      obfuscate("m_total", transformation, parser, runtime);

      expect(obfuscate("am_total m_total_amount M_TOTAL", transformation, parser, runtime)).toBe(
        "am_total m_total_amount M_TOTAL",
      );
    });

    it.each(presets)("preserves case variants of ignored words with %s", (name) => {
      expect(
        obfuscate(
          "keep KEEP",
          buildTransformationOptions({ ignore: ["keep"] }),
          buildParserOptions({ name }).data!,
          buildRuntimeOptions(),
        ),
      ).toBe("keep KEEP");
    });

    it.each(["default", "fileOnly"] as const)("preserves uppercase file names with %s", (name) => {
      expect(
        obfuscate(
          "file-main FILE-MAIN",
          buildTransformationOptions(),
          buildParserOptions({ name }).data!,
          buildRuntimeOptions(),
        ),
      ).toBe("Ox0 FILE-MAIN");
    });

    it.each(presets)("treats static keys literally and case-sensitively with %s", (name) => {
      expect(
        obfuscate(
          "a.b axb A.B",
          buildTransformationOptions({ static: [{ from: "a.b", to: "fixed" }] }),
          buildParserOptions({ name }).data!,
          buildRuntimeOptions(),
        ),
      ).toBe("fixed axb A.B");
    });

    it.each(presets)("accepts an ignored literal containing regex punctuation with %s", (name) => {
      expect(
        obfuscate(
          "[",
          buildTransformationOptions({ ignore: ["["] }),
          buildParserOptions({ name }).data!,
          buildRuntimeOptions(),
        ),
      ).toBe("[");
    });

    it.each(presets)("prefers the longer static match with %s", (name) => {
      expect(
        obfuscate(
          "m_short-suffix",
          buildTransformationOptions({ static: [{ from: "m_short-suffix", to: "fixed" }] }),
          buildParserOptions({ name }).data!,
          buildRuntimeOptions(),
        ),
      ).toBe("fixed");
    });

    it("retains static mappings across calls", () => {
      const runtime = buildRuntimeOptions();
      const parser = buildParserOptions().data!;
      obfuscate("a.b", buildTransformationOptions({ static: [{ from: "a.b", to: "fixed" }] }), parser, runtime);

      expect(obfuscate("a.b axb", buildTransformationOptions(), parser, runtime)).toBe("fixed axb");
    });

    it("retains intentionally partial custom rules", () => {
      expect(
        obfuscate(
          "secretSuffix",
          buildTransformationOptions(),
          buildParserOptions({ name: "custom", regexList: [{ name: "partial", value: "secret" }] }).data!,
          buildRuntimeOptions(),
        ),
      ).toBe("Ox0Suffix");
    });

    it.each(["[", "]", "(", ")", "\\", "a.b", "a+b", "a?b", "$value", "a|b", "^x$", "a{2}", "/file"])(
      "accepts the literal static key %s",
      (word) => {
        expect(
          obfuscate(
            `${word} unchanged`,
            buildTransformationOptions({ static: [{ from: word, to: "fixed" }] }),
            buildParserOptions().data!,
            buildRuntimeOptions(),
          ),
        ).toBe("fixed unchanged");
      },
    );

    it("inserts static targets literally", () => {
      expect(
        obfuscate(
          "m_total",
          buildTransformationOptions({ static: [{ from: "m_total", to: "$&" }] }),
          buildParserOptions().data!,
          buildRuntimeOptions(),
        ),
      ).toBe("$&");
    });
  });

  it("executes the startWithMAndUnderscore preset output while preserving unrelated names", () => {
    const code = `(() => {
      const LED_BUILTIN = 2;
      const external_value = 3;
      const m_total = LED_BUILTIN + external_value;
      return m_total;
    })()`;
    const parserOptions = buildParserOptions({ name: "startWithMAndUnderscore" }).data!;
    const transformationOptions = buildTransformationOptions();

    const output = obfuscate(code, transformationOptions, parserOptions, buildRuntimeOptions());

    expect(output).not.toContain("m_total");
    expect(output).toContain("LED_BUILTIN");
    expect(output).toContain("external_value");
    expect(runInNewContext(code)).toBe(5);
    expect(runInNewContext(output)).toBe(5);
  });

  describe("main-regex", () => {
    const code = "const l_var = 0;";
    it("with default options", () => {
      const options = buildDefaultOptions();
      const transformationOptions = buildTransformationOptions(options.transformation);
      const parserOptions = buildParserOptions(options.parser).data!;
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, transformationOptions, parserOptions, runtimeOptions);
      expect(output).toEqual("const Ox0 = 0;");
    });
  });

  describe("predefined-ignored", () => {
    const code = `import * from "./lib-file";const l_var = 0;const l_predefined_and_ignored = 0;`;
    it("with default options", () => {
      const options = buildDefaultOptions();
      const transformationOptions = buildTransformationOptions(options.transformation);
      const parserOptions = buildParserOptions(options.parser).data!;

      transformationOptions.ignore = ["l_predefined_and_ignored"];
      transformationOptions.static = [
        {
          from: "l_predefined_and_ignored",
          to: "l_predefined_target",
        },
      ];
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, transformationOptions, parserOptions, runtimeOptions);
      expect(output).toEqual(`import * from "./Ox1";const Ox0 = 0;const l_predefined_and_ignored = 0;`);
    });
  });

  describe("override options", () => {
    const code = "const l_var = 0;";
    const defaultOptions = buildDefaultOptions();
    const transformationOptions = buildTransformationOptions(defaultOptions.transformation);
    transformationOptions.prefix = "Zx";
    const parserOptions = buildParserOptions(defaultOptions.parser).data!;
    it("prefix overridden", () => {
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, transformationOptions, parserOptions, runtimeOptions);
      expect(output).toEqual("const Zx0 = 0;");
    });
  });

  describe("repeated-match statistics", () => {
    it.each([
      {
        name: "default",
        options: {},
        expectedReplacement: "Ox0",
        expectedFirstOutput: "Ox0 Ox0 Ox0",
        expectedSecondOutput: "Ox0 Ox0",
      },
      {
        name: "static",
        options: { static: [{ from: "l_value", to: "fixed" }] },
        expectedReplacement: "fixed",
        expectedFirstOutput: "fixed fixed fixed",
        expectedSecondOutput: "fixed fixed",
      },
      {
        name: "ignored",
        options: { ignore: ["l_value"] },
        expectedReplacement: "l_value",
        expectedFirstOutput: "l_value l_value l_value",
        expectedSecondOutput: "l_value l_value",
      },
      {
        name: "pool",
        options: { pool: ["alpha"] },
        expectedReplacement: "alpha",
        expectedFirstOutput: "alpha alpha alpha",
        expectedSecondOutput: "alpha alpha",
      },
      {
        name: "empty static",
        options: { static: [{ from: "l_value", to: "" }] },
        expectedReplacement: "",
        expectedFirstOutput: "  ",
        expectedSecondOutput: " ",
      },
    ])(
      "counts matches across calls without changing $name output",
      ({ options, expectedReplacement, expectedFirstOutput, expectedSecondOutput }) => {
        const transformationOptions = buildTransformationOptions(options);
        const parserOptions = buildParserOptions().data!;
        const runtimeOptions = buildRuntimeOptions();

        const firstOutput = obfuscate("l_value l_value l_value", transformationOptions, parserOptions, runtimeOptions);

        expect(firstOutput).toBe(expectedFirstOutput);
        expect(runtimeOptions.map).toEqual({ l_value: expectedReplacement });
        expect(runtimeOptions.processed.map.l_value!.count).toBe(3);
        const mappingAfterFirstCall = { ...runtimeOptions.processed.map.l_value! };

        const secondOutput = obfuscate("l_value l_value", transformationOptions, parserOptions, runtimeOptions);

        expect(secondOutput).toBe(expectedSecondOutput);
        expect(runtimeOptions.map).toEqual({ l_value: expectedReplacement });
        expect(runtimeOptions.processed.map.l_value).toEqual({ ...mappingAfterFirstCall, count: 5 });
      },
    );
  });
});
