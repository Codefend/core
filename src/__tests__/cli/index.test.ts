import { afterEach, describe, expect, it, vi } from "vitest";

import { startCLI } from "../../cli/index.js";
import { getUnknownOptionMessage, VERSION } from "../../core/utils/constants.js";

describe("CLI", () => {
  const originalArgv = process.argv;
  const helpOutput = expect.stringContaining("Usage: codefend [options]");

  afterEach(() => {
    process.argv = originalArgv;
    vi.restoreAllMocks();
  });

  it.each([
    { name: "no option", args: [], expectedOutput: helpOutput },
    { name: "--help", args: ["--help"], expectedOutput: helpOutput },
    { name: "--version", args: ["--version"], expectedOutput: VERSION },
    { name: "an unknown option", args: ["--unknown"], expectedOutput: getUnknownOptionMessage("--unknown") },
  ])("prints the expected output for $name", ({ args, expectedOutput }) => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const expectedArgs = ["node", "codefend", ...args];
    process.argv = [...expectedArgs];

    startCLI();

    expect(log).toHaveBeenCalledWith(expectedOutput);
    expect(process.argv).toEqual(expectedArgs);
  });
});
