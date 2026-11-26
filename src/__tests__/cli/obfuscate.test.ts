import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { obfuscateCommand } from "../../cli/commands/obfuscate.js";
import { copyFolder } from "../../core/generation/copy.js";
import { getAllFileNamesInDir, readFile } from "../../core/generation/read.js";
import { removeFolder } from "../../core/generation/remove.js";
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

  it("cancels without filesystem changes when configuration checking failed", () => {
    obfuscateCommand(null);

    expect(removeFolder).not.toHaveBeenCalled();
    expect(copyFolder).not.toHaveBeenCalled();
    expect(getAllFileNamesInDir).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });

  it("rejects a custom parser without expressions before removing output", () => {
    obfuscateCommand({ ...options, parser: { name: "custom", regexList: [] } });

    expect(removeFolder).not.toHaveBeenCalled();
    expect(copyFolder).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith("CUSTOM Parser should have at least 1 regex item in regex list");
  });

  it("stops at a later read failure without processing subsequent files", () => {
    vi.mocked(getAllFileNamesInDir).mockReturnValue([firstFile, secondFile, "output/third.txt"]);
    vi.mocked(readFile).mockReturnValueOnce("const l_value = 1;").mockReturnValueOnce(null);

    expect(() => obfuscateCommand(options)).toThrow(getFileReadErrorMessage(secondFile));

    expect(readFile).toHaveBeenCalledTimes(2);
    expect(writeFile).toHaveBeenCalledExactlyOnceWith(firstFile, "const Ox0 = 1;");
    expect(console.warn).not.toHaveBeenCalledWith("Obfuscation completed.");
  });

  it("surfaces copy errors before attempting to rewrite file contents", () => {
    const error = new Error("Copy failed");
    vi.mocked(copyFolder).mockImplementation(() => {
      throw error;
    });

    expect(() => obfuscateCommand(options)).toThrow(error);

    expect(readFile).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalledWith("Obfuscation completed.");
  });

  it("surfaces write errors without reading the next file or reporting completion", () => {
    const error = new Error("Write failed");
    vi.mocked(readFile).mockReturnValue("const l_value = 1;");
    vi.mocked(writeFile).mockImplementation(() => {
      throw error;
    });

    expect(() => obfuscateCommand(options)).toThrow(error);

    expect(readFile).toHaveBeenCalledExactlyOnceWith(firstFile);
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(console.warn).not.toHaveBeenCalledWith("Obfuscation completed.");
  });

  it("keeps a shared identifier consistent when a later file introduces a new name", () => {
    vi.mocked(readFile)
      .mockReturnValueOnce("export const l_value = 1;")
      .mockReturnValueOnce('import { l_value } from "./first"; const l_other = l_value;');

    obfuscateCommand(options);

    expect(writeFile).toHaveBeenNthCalledWith(1, firstFile, "export const Ox0 = 1;");
    expect(writeFile).toHaveBeenNthCalledWith(2, secondFile, 'import { Ox0 } from "./first"; const Ox1 = Ox0;');
  });
});
