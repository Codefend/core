import { describe, expect, it } from "vitest";

import { buildDefaultOptions, buildParserOptions, buildTransformationOptions } from "../../core/options/options.js";
import { obfuscate } from "../../core/process/obfuscate.js";
import { buildRuntimeOptions } from "../../core/process/runtime.js";
import { IOptions } from "../../models/options.js";

describe("Obfuscate", () => {
  describe("main-regex", () => {
    const code = "const l_var = 0;";
    it("with default options", () => {
      const options: IOptions = buildDefaultOptions();
      const transformationOptions = buildTransformationOptions(options);
      const parserOptions = buildParserOptions(options.parser).data!;
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, transformationOptions, parserOptions, runtimeOptions);
      expect(output).toEqual("const Ox0 = 0;");
    });
  });

  describe("predefined-ignored", () => {
    const code = `import * from "./lib-file";const l_var = 0;const l_predefined_and_ignored = 0;`;
    it("with default options", () => {
      const options: IOptions = buildDefaultOptions();
      const transformationOptions = buildTransformationOptions(options);
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
    const defaultOptions: IOptions = buildDefaultOptions();
    const transformationOptions = buildTransformationOptions(defaultOptions);
    transformationOptions.prefix = "Zx";
    const parserOptions = buildParserOptions(defaultOptions.parser).data!;
    it("prefix overridden", () => {
      const runtimeOptions = buildRuntimeOptions();
      const output = obfuscate(code, transformationOptions, parserOptions, runtimeOptions);
      expect(output).toEqual("const Zx0 = 0;");
    });
  });
});
