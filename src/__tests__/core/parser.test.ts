import { describe, expect, it } from "vitest";
import { IParsedWord, IParseOptions, parse } from "../../core/parser";
import { buildDefaultOptions } from "../../index";

describe("Parser", () => {
  describe("main-regex", () => {
    const options: IParseOptions = {
      code: `const l_var = 0;`,
      regexList: buildDefaultOptions().obfuscationOptions.regexList,
    };

    it("with default options", () => {
      const words: IParsedWord[] = parse(options);
      expect(words).toEqual([{ value: "l_var", fromRegex: "main" }]);
    });
  });
});
