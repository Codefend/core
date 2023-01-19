import { describe, expect, it } from "vitest";
import { ICodefendPredefinedWordOption } from "../core/options/ICodefendOptions";
import {
  CodefendCore,
  codefendDefaultOptions,
  createRuntimeOptions,
} from "../index";

describe("Mapper", () => {
  describe("Build Map", () => {
    const words = [
      { value: "l_var", fromRegex: "main" },
      { value: "lib-file", fromRegex: "file" },
    ];
    it("with default options", () => {
      const map = CodefendCore.mapper.buildMap(
        words,
        {},
        {
          prefix: codefendDefaultOptions.obfuscationOptions.prefix,
          debug: codefendDefaultOptions.debug,
          ignoredWords: codefendDefaultOptions.obfuscationOptions.ignoredWords,
          predefinedWords:
            codefendDefaultOptions.obfuscationOptions.predefinedWords,
        }
      );
      expect(map).toEqual({ l_var: "Ox0", "lib-file": "Ox1" });
    });
  });

  describe("Sort Map", () => {
    let map: Record<string, string> = { l_var: "Ox0", "lib-file": "Ox1" };

    it("should sort map by key length desc", () => {
      map = CodefendCore.mapper.sortMap(map);
      expect(JSON.stringify(map)).toEqual(
        JSON.stringify({ "lib-file": "Ox1", l_var: "Ox0" })
      );
    });
  });

  describe("Ignored words", () => {
    const ignoredWords = ["l_ignored"];
    let map: Record<string, string> = {
      l_var: "Ox0",
      "lib-file": "Ox1",
      l_ignored: "Ox2",
    };

    const runtimeOptions = createRuntimeOptions();

    it("should ignore the word", () => {
      map = CodefendCore.mapper.mapIgnoredWords(
        map,
        ignoredWords,
        {
          debug: true,
        },
        runtimeOptions
      );
      expect(map[ignoredWords[0]]).toEqual(ignoredWords[0]);
    });
  });

  describe("Predefined words", () => {
    const predefinedWords: ICodefendPredefinedWordOption[] = [
      { originalWord: "l_predefined", targetWord: "predefinedTarget" },
    ];
    let map: Record<string, string> = {
      l_var: "Ox0",
      "lib-file": "Ox1",
      l_predefined: "Ox2",
    };

    it("should replace with the target word", () => {
      const runtimeOptions = createRuntimeOptions();

      map = CodefendCore.mapper.mapPredefinedWords(
        map,
        predefinedWords,
        {
          debug: true,
        },
        runtimeOptions
      );
      expect(map[predefinedWords[0].originalWord]).toEqual(
        predefinedWords[0].targetWord
      );
    });
  });

  describe("Predefined and Ignored words", () => {
    const ignoredWords = ["l_predefined_and_ignored"];
    const predefinedWords: ICodefendPredefinedWordOption[] = [
      {
        originalWord: "l_predefined_and_ignored",
        targetWord: "predefinedTarget",
      },
    ];
    const runtimeOptions = createRuntimeOptions();
    let map: Record<string, string> = {
      l_var: "Ox0",
      "lib-file": "Ox1",
      l_predefined_and_ignored: "Ox2",
    };

    it("ignore > predefined", () => {
      map = CodefendCore.mapper.mapIgnoredWords(
        map,
        ignoredWords,
        {
          debug: true,
        },
        runtimeOptions
      );
      map = CodefendCore.mapper.mapPredefinedWords(
        map,
        predefinedWords,
        {
          debug: true,
        },
        runtimeOptions
      );
      expect(map[predefinedWords[0].originalWord]).toEqual(
        predefinedWords[0].targetWord
      );
    });
  });
});
