import { describe, expect, it } from "vitest";
import { IMapPredefinedWords, mapPredefinedWords } from "../../core/predefined";
import { buildRuntimeOptions } from "../../core/runtime";

describe("Predefined words", () => {
  const options: IMapPredefinedWords = {
    predefinedWords: [{ originalWord: "l_predefined", targetWord: "predefinedTarget" }],
  };
  const runtimeOptions = buildRuntimeOptions();

  runtimeOptions.map = {
    l_var: "Ox0",
    "lib-file": "Ox1",
    l_predefined: "Ox2",
  };

  describe("should replace with the target word", () => {
    mapPredefinedWords(options, runtimeOptions);

    it("ensure correct mapping", () => {
      expect(runtimeOptions.map[options.predefinedWords[0].originalWord]).toEqual(
        options.predefinedWords[0].targetWord
      );
    });

    it("ensure correct stats", () => {
      expect(runtimeOptions.processed.map[options.predefinedWords[0].originalWord].count).toEqual(0);
    });
  });
});
