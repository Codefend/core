import { describe, expect, it } from "vitest";
import { CodefendCore } from "../index";

describe("Mapper", () => {
  describe("Build Map", () => {
    const words = [
      { value: "l_var", fromRegex: "main" },
      { value: "lib-file", fromRegex: "file" },
    ];
    it("with default options", () => {
      const map = CodefendCore.mapper.buildMap(words, {}, "Ox");
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
});
