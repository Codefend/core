import { describe, expect, it } from "vitest";
import { CodefendCore } from "../index";

describe("Replacer", () => {
  const code = "const l_a = 0;";
  const map = { l_a: "Ox0" };
  it("with default options", () => {
    const output = CodefendCore.replacer.replace(code, map);
    expect(output).toEqual("const Ox0 = 0;");
  });
});
