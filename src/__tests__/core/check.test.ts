import { describe, expect, it } from "vitest";
import { VALID_VAR_REGEX } from "../../core/utils/constants.js";

describe("Check", () => {
  describe("Check: Pool", () => {
    it("Check that all valid variable names pass the regex validation and all invalid names fail.", () => {
      const validTestCases = ["validName", "_validName", "$validName", "validName1", "valid1Name"];

      const invalidTestCases = ["1invalidName", "invalid-Name", "invalid Name"];

      validTestCases.forEach((name) => {
        expect(VALID_VAR_REGEX.test(name)).toBe(true);
      });
      invalidTestCases.forEach((name) => {
        expect(VALID_VAR_REGEX.test(name)).toBe(false);
      });
    });
  });
});
