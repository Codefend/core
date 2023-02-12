import { describe, expect, it } from "vitest";
import { buildMap, IBuildMapOptions, sortMap } from "../../core/mapper";
import { buildRuntimeOptions } from "../../index";

describe("Mapper", () => {
  describe("Build Map", () => {
    const options: IBuildMapOptions = {
      prefix: "Ox",
      words: [
        { value: "l_var", fromRegex: "main" },
        { value: "lib-file", fromRegex: "file" },
      ],
    };
    const runtimeOptions = buildRuntimeOptions();

    it("with default options", () => {
      buildMap(options, runtimeOptions);

      expect(runtimeOptions.map).toEqual({ l_var: "Ox0", "lib-file": "Ox1" });
    });
  });

  describe("Sort Map", () => {
    const runtimeOptions = buildRuntimeOptions();
    runtimeOptions.map = { l_var: "Ox0", "lib-file": "Ox1" };

    it("should sort map by key length desc", () => {
      sortMap(runtimeOptions);
      expect(JSON.stringify(runtimeOptions.map)).toEqual(JSON.stringify({ "lib-file": "Ox1", l_var: "Ox0" }));
    });
  });
});
