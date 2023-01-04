import { describe, expect, it } from "vitest";
import { CodefendCore } from "../index";

describe("Mapper", () => {
  const words = [
    { value: "l_var", fromRegex: "main" },
    { value: "lib-file", fromRegex: "file" },
  ];
  it("with default options", () => {
    const map = CodefendCore.mapper.buildMap(words, {}, "Ox");
    expect(map).toEqual({ l_var: "Ox0", "lib-file": "Ox1" });
  });
});
