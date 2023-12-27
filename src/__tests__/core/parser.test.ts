import { describe, expect, it } from "vitest";

import { buildParserOptions } from "../../core/options/options.js";
import { IParsedWord, IParseOptions, parse } from "../../core/parser/parser.js";
import { CUSTOM_PARSER_NAME, DEFAULT_PARSER_NAME, PARSERS } from "../../core/utils/constants.js";

describe("Parser", () => {
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
