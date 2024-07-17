import { describe, expect, it } from "vitest";

import { buildRuntimeOptions } from "../../core/process/runtime.js";
import { IReplaceOptions, replace } from "../../core/replacer/replacer.js";

describe("Replacer", () => {
  const options: IReplaceOptions = {
    code: `import * from "./lib-file";const l_var = 0;`,
  };
  const runtimeOptions = buildRuntimeOptions();
  runtimeOptions.map = { l_var: "Ox0", "lib-file": "Ox1" };

  it("with default options", () => {
    const output = replace(options, runtimeOptions);
    expect(output).toEqual(`import * from "./Ox1";const Ox0 = 0;`);
  });
});
