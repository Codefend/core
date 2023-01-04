import { describe, expect, it } from "vitest";
import { CodefendCore } from "../index";

describe("Replacer", () => {
  const code = `import * from "./lib-file";const l_var = 0;`;
  const map = { l_var: "Ox0", "lib-file": "Ox1" };
  it("with default options", () => {
    const output = CodefendCore.replacer.replace(code, map);
    expect(output).toEqual(`import * from "./Ox1";const Ox0 = 0;`);
  });
});
