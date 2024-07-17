import { stats } from "../../core/debug/stats.js";
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
import { LOG_DEFAULT_BAR } from "../../core/utils/constants.js";
import { IOptions } from "../../models/options.js";

export function obfuscateCommand(options: IOptions | null) {
  if (!options) {
    console.warn("Obfuscation process canceled due to unresolved errors.");
    return;
  }

  const generationOptions = buildGenerationOptions(options);
  const transformationOptions = buildTransformationOptions(options);
  const parserOptionsResponse = buildParserOptions(options.parser);
  if (parserOptionsResponse.error) {
    console.warn(parserOptionsResponse.error.errorDescription);
    return;
  }
  const parserOptions = parserOptionsResponse.data;
  const debugOptions = buildDebugOptions(options);
  const runtimeOptions = buildRuntimeOptions();

  console.warn(`\n${LOG_DEFAULT_BAR}Obfuscation started${LOG_DEFAULT_BAR}`);
  console.warn(`Removing existing output folder ${generationOptions.outputDir}`);
  removeFolder(generationOptions.outputDir);

  console.warn("Copying new files");
  copyFolder(
    generationOptions.inputDir,
    generationOptions.outputDir,
    generationOptions.ignore,
    transformationOptions,
    parserOptions!,
    runtimeOptions,
  );

  const fileNames = getAllFileNamesInDir(generationOptions.outputDir);
  console.warn(`Copied ${fileNames.length} file(s)\n`);

  let fileCode;
  fileNames.forEach((fileName) => {
    fileCode = readFile(fileName as string);
    writeFile(fileName as string, obfuscate(fileCode ?? "", transformationOptions, parserOptions!, runtimeOptions));
  });
  stats({ stats: debugOptions.stats }, runtimeOptions);
  console.warn(`Obfuscated ${Object.keys(runtimeOptions.map).length} word(s)`);
  console.warn(`Obfuscation completed.`);
}
