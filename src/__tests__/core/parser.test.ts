import { describe, expect, it } from "vitest";
import { buildDefaultOptions, buildParserOptions } from "../../core/options";
import { IParsedWord, IParseOptions, parse } from "../../core/parser";

describe("Parser", () => {
  describe("main-regex", () => {
    const options: IParseOptions = {
      code: `const l_var = 0;`,
      parserOptions: buildParserOptions(buildDefaultOptions()),
    };

    it("with default options", () => {
      const words: IParsedWord[] = parse(options);
      expect(words).toEqual([{ value: "l_var", fromRegex: "main" }]);
    });
  });
});
