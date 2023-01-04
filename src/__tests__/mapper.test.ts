import { describe, expect, it } from "vitest";
import { CodefendCore } from "../index";

describe("Mapper", () => {
  const words = [{ value: "l_a", fromRegex: "main" }];
  it("with default options", () => {
    const map = CodefendCore.mapper.buildMap(words, {}, "Ox");
    expect(map).toEqual({ l_a: "Ox0" });
  });
});
