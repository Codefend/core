import { describe, expect, it } from "vitest";
import { obfuscate } from "../index";

describe("Obfuscate", () => {
  describe("main-regex", () => {
    const code = "const l_a = 0;";
    it("with default options", () => {
      const output = obfuscate(code);
      expect(output).toEqual("const Ox0 = 0;");
    });
  });

  describe("file-regex", () => {
    const code = `import lib_utils from "./lib-utils";`;
    it("with default options", () => {
      const output = obfuscate(code);
      expect(output).toEqual(`import Ox0 from "./Ox1";`);
    });
  });

  describe("all-regex", () => {
    const code = `import lib_utils from "./lib-utils";const l_a = 0;`;
    it("with default options", () => {
      const output = obfuscate(code);
      expect(output).toEqual(`import Ox0 from "./Ox2";const Ox1 = 0;`);
    });
  });
});
