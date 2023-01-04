import { describe, expect, it } from "vitest";
import { obfuscate } from "../index";

describe("Obfuscate", () => {
  const code = "const l_a = 0;";
  it("with default options", () => {
    const output = obfuscate(code);
    expect(output).toEqual("const Ox0 = 0;");
  });
});
