import { getObfuscatedWordsCount, stats } from "../../core/debug/stats.js";
import { copyFolder } from "../../core/generation/copy.js";
import { getAllFileNamesInDir, readFile } from "../../core/generation/read.js";
import { removeFolder } from "../../core/generation/remove.js";
import { writeFile } from "../../core/generation/write.js";
import {
  buildDebugOptions,
  buildGenerationOptions,
  buildParserOptions,
  buildTransformationOptions,
} from "../../core/options/options.js";
import { obfuscate } from "../../core/process/obfuscate.js";
import { buildRuntimeOptions } from "../../core/process/runtime.js";
import { IOptions } from "../../models/options.js";

export function obfuscateCommand(options: IOptions | null): void {
  if (!options) {
    console.warn("Obfuscation process canceled due to unresolved errors.");
    return;
  }

  const generationOptions = buildGenerationOptions(options);
  const transformationOptions = buildTransformationOptions(options.transformation);
  const parserOptionsResponse = buildParserOptions(options.parser);
  if (parserOptionsResponse.error) {
    console.warn(parserOptionsResponse.error.errorDescription);
    return;
  }
  const parserOptions = parserOptionsResponse.data;
  const debugOptions = buildDebugOptions(options.debug);
  const runtimeOptions = buildRuntimeOptions();

  removeFolder(generationOptions.outputDir);
  copyFolder(
    generationOptions.inputDir,
    generationOptions.outputDir,
    generationOptions.ignore,
    transformationOptions,
    parserOptions!,
    runtimeOptions,
  );

  const fileNames = getAllFileNamesInDir(generationOptions.outputDir);
  console.warn(`Obfuscated ${fileNames.length} file(s)\n`);

  let fileCode;
  fileNames.forEach((fileName) => {
    fileCode = readFile(fileName);
    writeFile(fileName, obfuscate(fileCode ?? "", transformationOptions, parserOptions!, runtimeOptions));
  });
  stats({ stats: debugOptions.stats }, runtimeOptions);
  console.warn(`Obfuscated ${getObfuscatedWordsCount(runtimeOptions)} word(s)`);
  console.warn(`Obfuscation completed.`);
}
