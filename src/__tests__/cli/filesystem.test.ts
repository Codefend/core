import fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { obfuscateCommand } from "../../cli/commands/obfuscate.js";
import { IOptions } from "../../models/options.js";
import { createTestProject, ITestProject, removeTestProject } from "../helpers/project.js";

describe("Obfuscating an isolated project on disk", () => {
  let project: ITestProject;
  let options: IOptions;

  beforeEach(() => {
    project = createTestProject();
    options = {
      generation: { inputDir: project.input, outputDir: project.output },
      // Avoid matching unrelated names in the host's temporary-directory path.
      parser: { name: "custom", regexList: [{ name: "names", value: "\\bl_value\\b|\\bfile-asset\\b" }] },
      debug: { stats: false },
    };
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    removeTestProject(project);
  });

  it.each([
    { source: "asset.bin", output: "asset.bin" },
    { source: "file-asset.bin", output: "Ox0.bin" },
  ])("preserves binary contents when copying $source to $output (F2)", ({ source, output }) => {
    const bytes = Buffer.from([0x00, 0x7f, 0x80, 0xff, 0xfe, 0x01]);
    fs.writeFileSync(path.join(project.input, source), bytes);

    obfuscateCommand(options);

    expect(fs.readFileSync(path.join(project.output, output))).toEqual(bytes);
    expect(fs.readFileSync(path.join(project.input, source))).toEqual(bytes);
  });

  it("preserves non-ASCII UTF-8 text while transforming identifiers", () => {
    const code = 'const l_value = "\u00e9\u4f60\u597d";';
    fs.writeFileSync(path.join(project.input, "source.js"), code);

    obfuscateCommand(options);

    expect(fs.readFileSync(path.join(project.output, "source.js"), "utf8")).toBe('const Ox0 = "\u00e9\u4f60\u597d";');
    expect(fs.readFileSync(path.join(project.input, "source.js"), "utf8")).toBe(code);
  });

  it("preserves a legitimate empty file", () => {
    fs.writeFileSync(path.join(project.input, "empty.txt"), "");

    obfuscateCommand(options);

    expect(fs.readFileSync(path.join(project.output, "empty.txt")).length).toBe(0);
    expect(console.warn).toHaveBeenCalledWith("Obfuscation completed.");
  });
});
