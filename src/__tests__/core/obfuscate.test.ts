import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

import { buildDefaultOptions, buildParserOptions, buildTransformationOptions } from "../../core/options/options.js";
import { obfuscate } from "../../core/process/obfuscate.js";
import { buildRuntimeOptions } from "../../core/process/runtime.js";

describe("Obfuscate", () => {
  it("executes the prefixed preset output while preserving unrelated names", () => {
    const code = `(() => {
      const LED_BUILTIN = 2;
      const external_value = 3;
      const l_total = LED_BUILTIN + external_value;
      return l_total;
    })()`;
    const parserOptions = buildParserOptions({ name: "prefixed" }).data!;
    const transformationOptions = buildTransformationOptions();

    const output = obfuscate(code, transformationOptions, parserOptions, buildRuntimeOptions());

    expect(output).not.toContain("l_total");
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
