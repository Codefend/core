import { describe, expect, it } from "vitest";

import { buildRuntimeOptions } from "../../../core/process/runtime.js";
import { IMapIgnoredWordsOptions, mapIgnoredWords } from "../../../core/transformation/ignore.js";
describe("Ignored words", () => {
    const options: IMapIgnoredWordsOptions = {
        ignore: ["l_ignored"],
    };
    const runtimeOptions = buildRuntimeOptions();
    runtimeOptions.map = {
        l_var: "Ox0",
        "lib-file": "Ox1",
        l_ignored: "Ox2",
    };
    describe("should ignore the word", () => {
        mapIgnoredWords(options, runtimeOptions);

        it("ensure correct mapping", () => {
            expect(runtimeOptions.map[options.ignore[0]!]).toEqual(options.ignore[0]);
        });
    });
});
