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

    options.obfuscationOptions.regexList?.forEach((regexListOption) => {
      regexListOption._regExp =
        CodefendCore.parser.initializeRegex(regexListOption);
    });
    if (!options.generationOptions) {
      return;
    }
    logger.info("Codefend", "Obfuscation started...");
    logger.info(
      "Codefend",
      `removing existing output folder ${options.generationOptions.outputDir}...`
    );
    fileSystem.folderManager.removeFolder(options.generationOptions.outputDir);
    logger.info("Codefend", "copying new files...");
    fileSystem.folderManager.copyFolderSync(
      options.generationOptions.inputDir,
      options.generationOptions.outputDir,
      options.generationOptions.ignoredFilesInGeneration
    );

    const fileNames = fileSystem.folderManager.getAllFileNamesInDir(
      options.generationOptions.outputDir
    );
    logger.success("Codefend", `copied ${fileNames.length} file(s)`);
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
}
