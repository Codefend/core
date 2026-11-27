import { describe, expect, it } from "vitest";

import { buildDefaultOptions, buildParserOptions } from "../../core/options/options.js";
import { IParsedWord, IParseOptions, parse } from "../../core/parser/parser.js";
import { CUSTOM_PARSER_NAME, DEFAULT_PARSER_NAME, PARSER_NAMES, PARSERS } from "../../core/utils/constants.js";

describe("Parser", () => {
  describe("prefixed preset", () => {
    it.each(["l_total", "l_firstName", "l_value2"])("discovers the marked name %s", (code) => {
      const parserOptions = buildParserOptions({ name: "prefixed" }).data!;

      expect(parse({ code, parserOptions })).toEqual([{ value: code, fromRegex: "startsWithLUnderscore" }]);
    });

    it.each([
      "external_value",
      "LED_BUILTIN",
      "main",
      "setup",
      "loop",
      "f_readSensor",
      "m_camera",
      "l_total_amount",
      "al_total",
      "l_1value",
      "L_total",
      "pkg-widget",
    ])("does not discover %s", (code) => {
      const parserOptions = buildParserOptions({ name: "prefixed" }).data!;

      expect(parse({ code, parserOptions })).toEqual([]);
    });

    it("uses the same discovery rule as the documentation's custom parser", () => {
      const code = 'const l_value2 = external_value; "l_total"; // l_firstName';
      const preset = buildParserOptions({ name: "prefixed" }).data!;
      const custom = buildParserOptions({
        name: "custom",
        regexList: [{ name: "startsWithLUnderscore", value: "\\bl_[A-Za-z][A-Za-z0-9]*\\b" }],
      }).data!;

      expect(parse({ code, parserOptions: preset })).toEqual(parse({ code, parserOptions: custom }));
      expect(parse({ code, parserOptions: preset }).map((word) => word.value)).toEqual([
        "l_value2",
        "l_total",
        "l_firstName",
      ]);
    });
  });

  it("keeps the default selection unchanged", () => {
    expect(buildDefaultOptions().parser?.name).toBe("default");
    expect(buildParserOptions().data).toEqual(buildParserOptions({ name: "default" }).data);
  });

  it.each([
    { name: PARSER_NAMES.default, values: ["l_total", "external_value", "pkg-widget"] },
    { name: PARSER_NAMES.codeOnly, values: ["l_total", "external_value"] },
    { name: PARSER_NAMES.fileOnly, values: ["pkg-widget"] },
    { name: PARSER_NAMES.Parser_A, values: ["l_total", "external_value", "pkg-widget"] },
  ])("preserves the existing $name preset", ({ name, values }) => {
    const parserOptions = buildParserOptions({ name }).data!;

    expect(parse({ code: "l_total external_value pkg-widget", parserOptions }).map((word) => word.value)).toEqual(
      values,
    );
  });

  it("DEFAULT PARSER", () => {
    const options: IParseOptions = {
      code: `const l_var = 0;`,
      parserOptions: {
        name: DEFAULT_PARSER_NAME,
        regexList: PARSERS[DEFAULT_PARSER_NAME]!.regexList,
      },
    };

    const words: IParsedWord[] = parse(options);
    expect(words).toEqual([{ value: "l_var", fromRegex: "main" }]);
  });

  it("CUSTOM PARSER", () => {
    const options: IParseOptions = {
      code: `const l_var = 0;`,
      parserOptions: buildParserOptions({
        name: CUSTOM_PARSER_NAME,
        regexList: [
          {
            name: "main",
            value: "([a-zA-Z]+(_[a-zA-Z0-9]+)+)",
          },
          {
            name: "file",
            value: "((pkg|cmp|lib|file|folder|module|style|main)+(-[a-zA-Z0-9]+)+)",
          },
        ],
      }).data!,
    };

    const words: IParsedWord[] = parse(options);
    expect(words).toEqual([{ value: "l_var", fromRegex: "main" }]);
  });
});
