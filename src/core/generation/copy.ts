import fs from "fs";
import path from "path";

import { IInternalParserOptions, IInternalTransformationOptions } from "../../models/internal.js";
import { obfuscate } from "../process/obfuscate.js";
import { IRuntimeOptions } from "../process/runtime.js";

export function copyFolder(
  from: string,
  to: string,
  ignoredFilesInGeneration: string[],
  transformationOptions: IInternalTransformationOptions,
  parserOptions: IInternalParserOptions,
  runtimeOptions: IRuntimeOptions,
): void {
  if (!fs.existsSync(to)) fs.mkdirSync(to);
  fs.readdirSync(from).forEach((element) => {
    if (ignoredFilesInGeneration.includes(element)) return;
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(
        path.join(from, element),
        path.join(
          obfuscate(to, transformationOptions, parserOptions, runtimeOptions),
          obfuscate(element, transformationOptions, parserOptions, runtimeOptions),
        ),
      );
    } else {
      copyFolder(
        path.join(from, element),
        path.join(
          obfuscate(to, transformationOptions, parserOptions, runtimeOptions),
          obfuscate(element, transformationOptions, parserOptions, runtimeOptions),
        ),
        ignoredFilesInGeneration,
        transformationOptions,
        parserOptions,
        runtimeOptions,
      );
    }
  });
}
