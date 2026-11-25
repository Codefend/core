import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { obfuscateCommand } from "../../cli/commands/obfuscate.js";
import { getAllFileNamesInDir, readFile } from "../../core/generation/read.js";
import { writeFile } from "../../core/generation/write.js";
import { getFileReadErrorMessage } from "../../core/utils/constants.js";
import { IOptions } from "../../models/options.js";

vi.mock("../../core/generation/copy.js", () => ({ copyFolder: vi.fn() }));
vi.mock("../../core/generation/remove.js", () => ({ removeFolder: vi.fn() }));
vi.mock("../../core/generation/read.js", () => ({ getAllFileNamesInDir: vi.fn(), readFile: vi.fn() }));
vi.mock("../../core/generation/write.js", () => ({ writeFile: vi.fn() }));

describe("Obfuscate command", () => {
  const firstFile = "output/first.txt";
  const secondFile = "output/second.txt";
  const options: IOptions = {
    generation: { inputDir: "input", outputDir: "output" },
    debug: { stats: false },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getAllFileNamesInDir).mockReturnValue([firstFile, secondFile]);
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stops without writing when a file cannot be read", () => {
    vi.mocked(readFile).mockReturnValue(null);

    expect(() => obfuscateCommand(options)).toThrow(getFileReadErrorMessage(firstFile));

    expect(readFile).toHaveBeenCalledTimes(1);
    expect(writeFile).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalledWith("Obfuscation completed.");
  });

  it("accepts an empty file as a successful read", () => {
    vi.mocked(getAllFileNamesInDir).mockReturnValue([firstFile]);
    vi.mocked(readFile).mockReturnValue("");

    obfuscateCommand(options);

    expect(writeFile).toHaveBeenCalledWith(firstFile, "");
  });
});
