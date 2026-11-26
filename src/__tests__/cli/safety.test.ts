import fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { obfuscateCommand } from "../../cli/commands/obfuscate.js";
import { copyFolder } from "../../core/generation/copy.js";
import { getAllFileNamesInDir } from "../../core/generation/read.js";
import { removeFolder } from "../../core/generation/remove.js";
import { IOptions } from "../../models/options.js";
import { createTestProject, ITestProject, removeTestProject } from "../helpers/project.js";

// Unsafe destinations must never reach a real deletion or copy operation.
vi.mock("../../core/generation/copy.js", () => ({ copyFolder: vi.fn() }));
vi.mock("../../core/generation/remove.js", () => ({ removeFolder: vi.fn() }));
vi.mock("../../core/generation/read.js", () => ({ getAllFileNamesInDir: vi.fn(), readFile: vi.fn() }));
vi.mock("../../core/generation/write.js", () => ({ writeFile: vi.fn() }));

describe("Obfuscation filesystem safety (F1)", () => {
  let project: ITestProject;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getAllFileNamesInDir).mockReturnValue([]);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    project = createTestProject();
    fs.writeFileSync(path.join(project.input, "source.txt"), "source must survive");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    removeTestProject(project);
  });

  function expectSafeRejection(options: IOptions): void {
    try {
      obfuscateCommand(options);
    } catch {
      // Validation may throw or report a diagnostic; either must precede filesystem changes.
    }
    expect.soft(removeFolder).not.toHaveBeenCalled();
    expect.soft(copyFolder).not.toHaveBeenCalled();
    expect.soft(console.warn).not.toHaveBeenCalledWith("Obfuscation completed.");
  }

  it("allows copying to a separate output directory", () => {
    obfuscateCommand({
      generation: { inputDir: project.input, outputDir: project.output },
      debug: { stats: false },
    });

    expect(removeFolder).toHaveBeenCalledExactlyOnceWith(project.output);
    expect(copyFolder).toHaveBeenCalledExactlyOnceWith(
      project.input,
      project.output,
      [project.output],
      expect.any(Object),
      expect.any(Object),
      expect.any(Object),
    );
    expect(console.warn).toHaveBeenCalledWith("Obfuscation completed.");
  });

  it.each([
    { name: "the input directory", destination: (project: ITestProject) => project.input },
    { name: "a normalized alias of the input", destination: (project: ITestProject) => `${project.input}${path.sep}.` },
    { name: "an ancestor of the input", destination: (project: ITestProject) => project.root },
    { name: "the filesystem root", destination: (project: ITestProject) => path.parse(project.root).root },
  ])("rejects $name before removing any files", ({ destination }) => {
    expectSafeRejection({
      generation: { inputDir: project.input, outputDir: destination(project) },
      debug: { stats: false },
    });
    expect(fs.readFileSync(path.join(project.input, "source.txt"), "utf8")).toBe("source must survive");
  });

  it.each([
    { kind: "missing", name: "missing directory" },
    { kind: "file", name: "regular file" },
  ])("preserves existing output when the input is a $name", ({ kind }) => {
    const input = path.join(project.root, kind);
    if (kind === "file") fs.writeFileSync(input, "not a directory");
    fs.mkdirSync(project.output);
    const existingFile = path.join(project.output, "keep.txt");
    fs.writeFileSync(existingFile, "previous output must survive");

    expectSafeRejection({
      generation: { inputDir: input, outputDir: project.output },
      debug: { stats: false },
    });
    expect(fs.readFileSync(existingFile, "utf8")).toBe("previous output must survive");
  });
});
