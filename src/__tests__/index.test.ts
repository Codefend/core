import { describe, expect, it } from "vitest";
import { Codefend } from "../index";

describe("parser()", () => {
  const code = "const l_a = 0;";
  it("Obfuscate with default options", () => {
    const output = Codefend.obfuscate(code);
    expect(output).toEqual("const Ox0 = 0;");
  });
});
