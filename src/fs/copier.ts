import fs from "fs";
import path from "path";
import { obfuscate } from "../core/obfuscate";
import { IRuntimeOptions } from "../core/runtime";
import { IInternalParserOptions, IInternalTransformationOptions } from "../models/internal";

export function copyFolder(
  from: string,
  to: string,
  ignoredFilesInGeneration: string[],
  transformationOptions: IInternalTransformationOptions,
  parserOptions: IInternalParserOptions,
  runtimeOptions: IRuntimeOptions
) {
  if (!fs.existsSync(to)) fs.mkdirSync(to);
  fs.readdirSync(from).forEach((element) => {
    if (ignoredFilesInGeneration.includes(element)) return;
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(
        path.join(from, element),
        path.join(
          obfuscate(to, transformationOptions, parserOptions, runtimeOptions),
          obfuscate(element, transformationOptions, parserOptions, runtimeOptions)
        )
      );
    } else {
      copyFolder(
        path.join(from, element),
        path.join(
          obfuscate(to, transformationOptions, parserOptions, runtimeOptions),
          obfuscate(element, transformationOptions, parserOptions, runtimeOptions)
        ),
        ignoredFilesInGeneration,
        transformationOptions,
        parserOptions,
        runtimeOptions
      );
    }
  });
}
