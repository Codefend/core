import { obfuscate } from "../../core/obfuscate";
import { IOptions } from "../../core/options";
import { initializeRegex } from "../../core/parser";
import { buildRuntimeOptions } from "../../core/runtime";
import { copyFolder } from "../../fs/copier";
import { getAllFileNamesInDir, readFile } from "../../fs/reader";
import { removeFolder } from "../../fs/remover";
import { writeFile } from "../../fs/writer";
import { buildObfuscationOptions, log, stats } from "../../index";

export function obfuscateCommand(options: IOptions | null) {
  if (!options) {
    log.error("Codefend", "Obfuscation process canceled due to unresolved errors.");
    return;
  }

  if (!options.generationOptions) {
    return;
  }
  applyTransformationsOnOptions(options);

  log.debug("Codefend", "Obfuscation started...", log.info);
  log.debug("Codefend", `Removing existing output folder ${options.generationOptions.outputDir}...`, log.info);
  removeFolder(options.generationOptions.outputDir);
  log.debug("Codefend", "Copying new files...", log.info);
  copyFolder(
    options.generationOptions.inputDir,
    options.generationOptions.outputDir,
    options.generationOptions.ignoredFilesInGeneration
  );

  const fileNames = getAllFileNamesInDir(options.generationOptions.outputDir);
  log.success("Codefend", `Copied ${fileNames.length} file(s)`);
  const obfuscationOptions = buildObfuscationOptions(options.obfuscationOptions);
  const runtimeOptions = buildRuntimeOptions();
  let fileCode;
  fileNames.forEach((fileName) => {
    fileCode = readFile(fileName as string);
    writeFile(fileName as string, obfuscate(fileCode ?? "", obfuscationOptions, runtimeOptions));
  });
  stats({ stats: obfuscationOptions.stats }, runtimeOptions);
  log.success("Codefend", `Obfuscated ${Object.keys(runtimeOptions.map).length} word(s)`);
  log.success("Codefend", `Obfuscation completed.`);
}
function applyTransformationsOnOptions(options: IOptions) {
  initializeRegexList(options);
  addInternallyRequiredFilesToIgnoreInGeneration(options);
}

function initializeRegexList(options: IOptions) {
  options.obfuscationOptions.regexList.forEach((regexListOption) => {
    regexListOption._regExp = initializeRegex(regexListOption);
  });
}

function addInternallyRequiredFilesToIgnoreInGeneration(options: IOptions) {
  if (!options.generationOptions?.ignoredFilesInGeneration.includes(options.generationOptions.outputDir)) {
    options.generationOptions?.ignoredFilesInGeneration.push(options.generationOptions.outputDir);
  }
}
