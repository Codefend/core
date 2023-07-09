import fs from "fs";
import path from "path";
import { obfuscate } from "../core/obfuscate";
import { IObfuscationOptions } from "../core/options";
import { IRuntimeOptions } from "../core/runtime";

export function copyFolder(
  from: string,
  to: string,
  ignoredFilesInGeneration: string[],
  obfuscationOptions: IObfuscationOptions,
  runtimeOptions: IRuntimeOptions
) {
  if (!fs.existsSync(to)) fs.mkdirSync(to);
  fs.readdirSync(from).forEach((element) => {
    if (ignoredFilesInGeneration.includes(element)) return;
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(
        path.join(from, element),
        path.join(
          obfuscate(to, obfuscationOptions, runtimeOptions),
          obfuscate(element, obfuscationOptions, runtimeOptions)
        )
      );
    } else {
      copyFolder(
        path.join(from, element),
        path.join(
          obfuscate(to, obfuscationOptions, runtimeOptions),
          obfuscate(element, obfuscationOptions, runtimeOptions)
        ),
        ignoredFilesInGeneration,
        obfuscationOptions,
        runtimeOptions
      );
    }
  });
}
