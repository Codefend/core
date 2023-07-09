import { describe, expect, it } from "vitest";
import { buildDefaultOptions, buildObfuscationOptions, IObfuscationOptions } from "../../core/options";
import { obfuscate, buildRuntimeOptions } from "../../index";

describe("Obfuscate", () => {
  describe("main-regex", () => {
    const code = "const l_var = 0;";
    it("with default options", () => {
      const options: IObfuscationOptions = buildObfuscationOptions();
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, options, runtimeOptions);
      expect(output).toEqual("const Ox0 = 0;");
    });
  });

  describe("predefined-ignored", () => {
    const code = `import * from "./lib-file";const l_var = 0;const l_predefined_and_ignored = 0;`;
    it("with default options", () => {
      const options: IObfuscationOptions = buildObfuscationOptions();
      options.ignoredWords = ["l_predefined_and_ignored"];
      options.predefinedWords = [
        {
          originalWord: "l_predefined_and_ignored",
          targetWord: "l_predefined_target",
        },
      ];
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, options, runtimeOptions);
      expect(output).toEqual(`import * from "./Ox1";const Ox0 = 0;const l_predefined_and_ignored = 0;`);
    });
  });

  describe("override options", () => {
    const code = "const l_var = 0;";
    const defaultOptions = buildDefaultOptions();
    const options: IObfuscationOptions = buildObfuscationOptions({
      prefix: "Zx",
      ignoredWords: [],
      predefinedWords: [],
      stats: false,
      regexList: defaultOptions.obfuscationOptions.regexList,
      customGeneratedWords: [],
    });
    it("prefix overridden", () => {
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, options, runtimeOptions);
      expect(output).toEqual("const Zx0 = 0;");
    });
  });
});
