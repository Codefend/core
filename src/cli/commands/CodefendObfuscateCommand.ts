import { fileSystem, CodefendCore, obfuscate, logger } from "../../";
import { ICodefendOptions } from "../../core/options/ICodefendOptions";

export class CodefendObfuscateCommand {
  execute(options: ICodefendOptions | null) {
    if (!options) {
      logger.error(
        "Codefend",
        "Could not start with Obfuscation. Please resolve errors first."
      );
      return;
    }

    if (!options.generationOptions) {
      return;
    }
    this.applyTransformationsOnOptions(options);

    logger.debug("Codefend", "Obfuscation started...", options.debug);
    logger.debug(
      "Codefend",
      `Removing existing output folder ${options.generationOptions.outputDir}...`,
      options.debug
    );
    fileSystem.folderManager.removeFolder(options.generationOptions.outputDir);
    logger.debug("Codefend", "Copying new files...", options.debug);
    fileSystem.folderManager.copyFolderSync(
      options.generationOptions.inputDir,
      options.generationOptions.outputDir,
      options.generationOptions.ignoredFilesInGeneration
    );

    const fileNames = fileSystem.folderManager.getAllFileNamesInDir(
      options.generationOptions.outputDir
    );
    logger.success("Codefend", `Copied ${fileNames.length} file(s)`);
    const map: Record<string, string> = {};
    let fileCode;
    fileNames.forEach((fileName) => {
      fileCode = fileSystem.fileReader.readFile(fileName as string);
      fileSystem.fileWriter.writeFile(
        fileName as string,
        obfuscate(fileCode ?? "", map, options)
      );
    });
    logger.success("Codefend", `Obfuscated ${Object.keys(map).length} word(s)`);
    logger.success("Codefend", `Obfuscation completed.`);
  }
  applyTransformationsOnOptions(options: ICodefendOptions) {
    this.initializeRegexList(options);
    this.addInternallyRequiredFilesToIgnoreInGeneration(options);
  }

  initializeRegexList(options: ICodefendOptions) {
    options.obfuscationOptions.regexList.forEach((regexListOption) => {
      regexListOption._regExp =
        CodefendCore.parser.initializeRegex(regexListOption);
    });
  }

  addInternallyRequiredFilesToIgnoreInGeneration(options: ICodefendOptions) {
    if (
      !options.generationOptions?.ignoredFilesInGeneration.includes(
        options.generationOptions.outputDir
      )
    ) {
      options.generationOptions?.ignoredFilesInGeneration.push(
        options.generationOptions.outputDir
      );
    }
  }
}
