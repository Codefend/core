import { describe, expect, it } from "vitest";

import { buildGenerationOptions } from "../../core/options/options.js";
import { IOptions } from "../../models/options.js";

describe("Generation options", () => {
  it.each([{ ignore: [] }, { ignore: ["node_modules", ".git"] }])(
    "does not mutate a caller's ignore array $ignore (T8)",
    ({ ignore }) => {
      const original = [...ignore];
      const options: IOptions = { generation: { inputDir: "input", outputDir: "output", ignore } };

      const generation = buildGenerationOptions(options);

      expect.soft(ignore).toEqual(original);
      expect(generation.ignore).toEqual([...original, "output"]);
    },
  );

  it("does not duplicate an output directory already ignored", () => {
    const options: IOptions = {
      generation: { inputDir: "input", outputDir: "output", ignore: ["node_modules", "output"] },
    };

    expect(buildGenerationOptions(options).ignore).toEqual(["node_modules", "output"]);
  });

  it("excludes output when no ignore list was provided", () => {
    const options: IOptions = { generation: { inputDir: "input", outputDir: "output" } };

    expect(buildGenerationOptions(options).ignore).toEqual(["output"]);
    expect(options.generation.ignore).toBeUndefined();
  });
});
