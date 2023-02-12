import { describe, expect, it } from "vitest";
import { IMapIgnoredWordsOptions } from "../../core/ignored";
import { buildRuntimeOptions } from "../../core/runtime";
import { mapIgnoredWords } from "../../index";

describe("Ignored words", () => {
  const options: IMapIgnoredWordsOptions = {
    ignoredWords: ["l_ignored"],
  };
  const runtimeOptions = buildRuntimeOptions();
  runtimeOptions.map = {
    l_var: "Ox0",
    "lib-file": "Ox1",
    l_ignored: "Ox2",
  };
  it("should ignore the word", () => {
    mapIgnoredWords(options, runtimeOptions);
    expect(runtimeOptions.map[options.ignoredWords[0]]).toEqual(options.ignoredWords[0]);
  });
});
