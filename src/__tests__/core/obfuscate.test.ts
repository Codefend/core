import { describe, expect, it } from "vitest";
import { buildObfuscateOptions, IObfuscateOptions } from "../../core/obfuscate";
import { buildDefaultOptions } from "../../core/options";
import { obfuscate, buildRuntimeOptions } from "../../index";

describe("Obfuscate", () => {
  describe("main-regex", () => {
    const code = "const l_var = 0;";
    it("with default options", () => {
      const options: IObfuscateOptions = buildObfuscateOptions(buildDefaultOptions());
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, options, runtimeOptions);
      expect(output).toEqual("const Ox0 = 0;");
    });
  });

  describe("predefined-ignored", () => {
    const code = `import * from "./lib-file";const l_var = 0;const l_predefined_and_ignored = 0;`;
    it("with default options", () => {
      const options: IObfuscateOptions = buildObfuscateOptions(buildDefaultOptions());
      options.ignoredWords = ["l_predefined_and_ignored"];
      options.predefinedWords = [
        {
          originalWord: "l_predefined_and_ignored",
          targetWord: "l_predefined_target",
        },
      ];
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, options, runtimeOptions);
      expect(output).toEqual(`import * from "./lib-file";const Ox0 = 0;const l_predefined_and_ignored = 0;`);
    });
  });
});
