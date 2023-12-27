import { describe, expect, it } from "vitest";

import { buildTransformationPoolOption } from "../../../core/options/options.js";
import { buildRuntimeOptions, WordEncryptionType } from "../../../core/process/runtime.js";
import { IMapCustomGeneratedWordsOptions, mapPoolWords } from "../../../core/transformation/pool.js";
describe("Pool words", () => {
    const pool = [
        "s",
        "sm",
        "normalUpperCase",
        "_c.o,n/t'a;in[s]-s=p+e*c%i$a#l@c!h^a&racters",
        "contain\nsnewline",
        "0123StartWithNumber",
    ];
    const expectedParsedPool = ["normaluppercase", "containsspecialcharacters", "containsnewline", "startwithnumber"];

    const options: IMapCustomGeneratedWordsOptions = {
        prefix: "Ox",
        pool: buildTransformationPoolOption(pool),
    };

    const runtimeOptions = buildRuntimeOptions();

    runtimeOptions.map = {
        l_var: "Ox0",
        "lib-file": "Ox1",
        l_predefined: "Ox2",
        l_var2: "Ox3",
        l_var3: "Ox4",
    };

    runtimeOptions.processed.map["l_var"] = { target: "", type: WordEncryptionType.default, count: 0 };
    runtimeOptions.processed.map["lib-file"] = { target: "", type: WordEncryptionType.default, count: 0 };
    runtimeOptions.processed.map["l_predefined"] = { target: "", type: WordEncryptionType.default, count: 0 };
    runtimeOptions.processed.map["l_var2"] = { target: "", type: WordEncryptionType.default, count: 0 };
    runtimeOptions.processed.map["l_var3"] = { target: "", type: WordEncryptionType.default, count: 0 };

    mapPoolWords(options, runtimeOptions);

    it("ensure correct pool parsing", () => {
        expect(options.pool).toEqual(expectedParsedPool);
    });

    it("ensure correct mapping", () => {
        expect(runtimeOptions.map["l_var"]).toEqual(options.pool[0]);
        expect(runtimeOptions.map["lib-file"]).toEqual(options.pool[1]);
        expect(runtimeOptions.map["l_predefined"]).toEqual(options.pool[2]);
        expect(runtimeOptions.map["l_var2"]).toEqual(options.pool[3]);
    });

    it("ensure fallback to prefix when pool is fully consumed", () => {
        const key = "l_var3";
        expect(runtimeOptions.map[key]).toEqual(runtimeOptions.map[key]);
    });
});
