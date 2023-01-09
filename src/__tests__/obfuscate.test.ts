import { describe, expect, it } from "vitest";
import { obfuscate } from "../index";

describe("Obfuscate", () => {
  describe("main-regex", () => {
    const code = "const l_var = 0;";
    it("with default options", () => {
      const output = obfuscate(code);
      expect(output).toEqual("const Ox0 = 0;");
    });
  });

  describe("predefined-ignored", () => {
    const code = `import * from "./lib-file";const l_var = 0;const l_predefined_and_ignored = 0;`;
    it("with default options", () => {
      const output = obfuscate(
        code,
        {},
        {
          obfuscationOptions: {
            ignoredWords: ["l_predefined_and_ignored"],
            predefinedWords: [
              {
                originalWord: "l_predefined_and_ignored",
                targetWord: "l_predefined_target",
              },
            ],
          },
        }
      );
      expect(output).toEqual(
        `import * from "./lib-file";const Ox0 = 0;const l_predefined_and_ignored = 0;`
      );
    });
  });
});
