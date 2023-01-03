import { describe, expect, it } from "vitest";
import { obfuscate, CodefendCore } from "../index";

describe("Obfuscate", () => {
  const code = "const l_a = 0;";
  it("with default options", () => {
    const output = obfuscate(code);
    expect(output).toEqual("const Ox0 = 0;");
  });
});

describe("Parser", () => {
  const code = "const l_a = 0;";
  it("with default options", () => {
    const words = CodefendCore.parser.parse(code);
    expect(words).toEqual([{ value: "l_a", regexIndex: 1 }]);
  });
});

describe("Mapper", () => {
  const words = [{ value: "l_a", regexIndex: 1 }];
  it("with default options", () => {
    const map = CodefendCore.mapper.buildMap(words, {}, "Ox");
    expect(map).toEqual({ l_a: "Ox0" });
  });
});

describe("Replacer", () => {
  const code = "const l_a = 0;";
  const map = { l_a: "Ox0" };
  it("with default options", () => {
    const output = CodefendCore.replacer.replace(map, code);
    expect(output).toEqual("const Ox0 = 0;");
  });
});
