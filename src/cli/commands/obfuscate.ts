import { obfuscate } from "../../core/obfuscate";
import {
  buildTranformationOptions,
  buildParserOptions,
  buildGenerationOptions,
  buildDebugOptions,
} from "../../core/options";
import { buildRuntimeOptions } from "../../core/runtime";
import { copyFolder } from "../../fs/copier";
import { getAllFileNamesInDir, readFile } from "../../fs/reader";
import { removeFolder } from "../../fs/remover";
import { writeFile } from "../../fs/writer";
import { log, stats } from "../../index";
import { IOptions } from "../../models/options";

export function obfuscateCommand(options: IOptions | null) {
  if (!options) {
    log.error("Codefend", "Obfuscation process canceled due to unresolved errors.");
    return;
  }

  const generationOptions = buildGenerationOptions(options);
  const transformationOptions = buildTranformationOptions(options);
  const parserOptions = buildParserOptions(options);
  const debugOptions = buildDebugOptions(options);
  const runtimeOptions = buildRuntimeOptions();

  log.debug("Codefend", "Obfuscation started...", log.info);
  log.debug("Codefend", `Removing existing output folder ${generationOptions.outputDir}...`, log.info);
  removeFolder(generationOptions.outputDir);

  log.debug("Codefend", "Copying new files...", log.info);
  copyFolder(
    generationOptions.inputDir,
    generationOptions.outputDir,
    generationOptions.ignore,
    transformationOptions,
    parserOptions,
    runtimeOptions
  );

  const fileNames = getAllFileNamesInDir(generationOptions.outputDir);
  log.success("Codefend", `Copied ${fileNames.length} file(s)`);

  let fileCode;
  fileNames.forEach((fileName) => {
    fileCode = readFile(fileName as string);
    writeFile(fileName as string, obfuscate(fileCode ?? "", transformationOptions, parserOptions, runtimeOptions));
  });
  stats({ stats: debugOptions.stats }, runtimeOptions);
  log.success("Codefend", `Obfuscated ${Object.keys(runtimeOptions.map).length} word(s)`);
  log.success("Codefend", `Obfuscation completed.`);
}
