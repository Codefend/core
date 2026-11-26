import fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { copyFolder } from "../../../core/generation/copy.js";
import {
  buildGenerationOptions,
  buildParserOptions,
  buildTransformationOptions,
} from "../../../core/options/options.js";
import { buildRuntimeOptions } from "../../../core/process/runtime.js";
import { createTestProject, ITestProject, removeTestProject } from "../../helpers/project.js";

describe("Copying project files", () => {
  let project: ITestProject;
  const transformation = buildTransformationOptions();
  // Match only fixture names so a user's temporary-directory name cannot affect the test.
  const parser = buildParserOptions({
    name: "custom",
    regexList: [{ name: "names", value: "\\bl_(?:output|parent)\\b|\\b(?:file|folder)-entry\\b" }],
  }).data!;

  beforeEach(() => {
    project = createTestProject();
    fs.writeFileSync(path.join(project.input, "source.txt"), "source bytes");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    removeTestProject(project);
  });

  it("copies binary bytes without decoding them", () => {
    const bytes = Buffer.from([0x00, 0x7f, 0x80, 0xff, 0xfe, 0x01]);
    fs.writeFileSync(path.join(project.input, "asset.bin"), bytes);

    copyFolder(project.input, project.output, [], transformation, parser, buildRuntimeOptions());

    expect(fs.readFileSync(path.join(project.output, "asset.bin"))).toEqual(bytes);
  });

  it("excludes ignored directories and their contents", () => {
    fs.mkdirSync(path.join(project.input, "ignored"));
    fs.writeFileSync(path.join(project.input, "ignored", "secret.txt"), "must not be copied");

    copyFolder(project.input, project.output, ["ignored"], transformation, parser, buildRuntimeOptions());

    expect(fs.readdirSync(project.output)).toEqual(["source.txt"]);
    expect(fs.readFileSync(path.join(project.output, "source.txt"), "utf8")).toBe("source bytes");
  });

  it("renames relative directories and files with the shared mapping", () => {
    fs.mkdirSync(path.join(project.input, "folder-entry"));
    fs.writeFileSync(path.join(project.input, "folder-entry", "file-entry.txt"), "nested content");
    const runtime = buildRuntimeOptions();

    copyFolder(project.input, project.output, [], transformation, parser, runtime);

    expect(runtime.map).toEqual({ "folder-entry": "Ox0", "file-entry": "Ox1" });
    expect(fs.readFileSync(path.join(project.output, "Ox0", "Ox1.txt"), "utf8")).toBe("nested content");
  });

  it.each([
    { name: "an absolute output path", output: (input: string) => path.join(input, "output") },
    {
      name: "an output path containing a dot segment",
      output: (input: string) => `${input}${path.sep}.${path.sep}output`,
    },
    { name: "a nested output path", output: (input: string) => path.join(input, "generated", "output") },
  ])("never traverses its own output for $name (F4)", ({ output }) => {
    const destination = output(project.input);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const generation = buildGenerationOptions({ generation: { inputDir: project.input, outputDir: destination } });
    const readDirectory = fs.readdirSync;

    // Stop at the first attempt to read the destination as source; never recurse indefinitely.
    vi.spyOn(fs, "readdirSync").mockImplementation(((...args: Parameters<typeof fs.readdirSync>) => {
      if (path.resolve(String(args[0])) === path.resolve(destination)) {
        throw new Error("Test stopped recursive traversal into the output directory.");
      }
      return readDirectory(...args);
    }) as typeof fs.readdirSync);

    expect(() =>
      copyFolder(project.input, destination, generation.ignore, transformation, parser, buildRuntimeOptions()),
    ).not.toThrow();

    expect(fs.readFileSync(path.join(destination, "source.txt"), "utf8")).toBe("source bytes");
  });

  it.each([
    { name: "the output directory", output: (root: string) => path.join(root, "l_output") },
    { name: "an ancestor directory", output: (root: string) => path.join(root, "l_parent", "output") },
  ])("keeps the configured output root when the parser matches $name (F5)", ({ output }) => {
    const destination = output(project.root);
    fs.mkdirSync(path.dirname(destination), { recursive: true });

    expect(() =>
      copyFolder(project.input, destination, [], transformation, parser, buildRuntimeOptions()),
    ).not.toThrow();

    expect(fs.readFileSync(path.join(destination, "source.txt"), "utf8")).toBe("source bytes");
  });
});
