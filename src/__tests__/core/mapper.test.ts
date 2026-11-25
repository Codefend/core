import { describe, expect, it } from "vitest";

import { buildMap, IBuildMapOptions, sortMap } from "../../core/mapper/mapper.js";
import { buildRuntimeOptions } from "../../core/process/runtime.js";

describe("Mapper", () => {
  describe("Build Map", () => {
    const options: IBuildMapOptions = {
      words: [
        { value: "l_var", fromRegex: "main" },
        { value: "lib-file", fromRegex: "file" },
      ],
    };
    const runtimeOptions = buildRuntimeOptions();

    describe("with default options", () => {
      buildMap(options, runtimeOptions);
      it("ensure correct mapping", () => {
        expect(runtimeOptions.map).toEqual({ l_var: "", "lib-file": "" });
      });
      it("ensure correct stats", () => {
        expect(runtimeOptions.processed.map[options.words[0]!.value]!.count).toEqual(1);
      });
    });

    describe("Repeated-match statistics", () => {
      it("counts all three matches before a replacement is assigned", () => {
        const runtimeOptions = buildRuntimeOptions();
        const word = { value: "l_value", fromRegex: "main" };

        buildMap({ words: [word, word, word] }, runtimeOptions);

        expect(runtimeOptions.map).toEqual({ l_value: "" });
        expect(runtimeOptions.processed.map.l_value!.count).toBe(3);
      });

      it("keeps a separate count for each name", () => {
        const runtimeOptions = buildRuntimeOptions();
        const firstWord = { value: "l_first", fromRegex: "main" };
        const secondWord = { value: "l_second", fromRegex: "main" };

        buildMap({ words: [firstWord, secondWord, firstWord, secondWord, firstWord] }, runtimeOptions);

        expect(runtimeOptions.processed.map.l_first!.count).toBe(3);
        expect(runtimeOptions.processed.map.l_second!.count).toBe(2);
      });

      it("adds two new matches to the previous count of three", () => {
        const runtimeOptions = buildRuntimeOptions();
        const word = { value: "l_value", fromRegex: "main" };

        buildMap({ words: [word, word, word] }, runtimeOptions);
        expect(runtimeOptions.processed.map.l_value!.count).toBe(3);

        buildMap({ words: [word, word] }, runtimeOptions);

        expect(runtimeOptions.map).toEqual({ l_value: "" });
        expect(runtimeOptions.processed.map.l_value!.count).toBe(5);
      });
    });
  });

  describe("Sort Map", () => {
    const runtimeOptions = buildRuntimeOptions();
    runtimeOptions.map = { l_var: "", "lib-file": "" };

    it("should sort map by key length desc", () => {
      sortMap(runtimeOptions);
      expect(JSON.stringify(runtimeOptions.map)).toEqual(JSON.stringify({ "lib-file": "", l_var: "" }));
    });
  });
});
