import { describe, expect, it } from "vitest";

import { buildRuntimeOptions } from "../../../core/process/runtime.js";
import { IMapStaticWordsOptions, mapStaticWords } from "../../../core/transformation/static.js";
describe("Static words", () => {
  const options: IMapStaticWordsOptions = {
    static: [{ from: "l_predefined", to: "predefinedTarget" }],
  };
  const runtimeOptions = buildRuntimeOptions();

  runtimeOptions.map = {
    l_var: "Ox0",
    "lib-file": "Ox1",
    l_predefined: "Ox2",
  };

  describe("should replace with the target word", () => {
    mapStaticWords(options, runtimeOptions);

    it("ensure correct mapping", () => {
      expect(runtimeOptions.map[options.static[0]!.from]).toEqual(options.static[0]!.to);
    });
  });
});
