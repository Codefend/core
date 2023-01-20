import { describe, expect, it } from "vitest";
import { CodefendCore, codefendDefaultOptions } from "../index";

describe("Parser", () => {
  describe("main-regex", () => {
    const code = "const l_var = 0;";
    it("with default options", () => {
      const words = CodefendCore.parser.parse(code, codefendDefaultOptions.obfuscationOptions.regexList);
      expect(words).toEqual([{ value: "l_var", fromRegex: "main" }]);
    });
  });
});
