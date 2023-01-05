import { fileSystem, CodefendCore, obfuscate } from "../../";
import { ICodefendOptions } from "../../core/options/ICodefendOptions";

export class CodefendObfuscateCommand {
  execute(options: ICodefendOptions | null) {
    if (!options) {
      console.log(
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
    console.log("Obfuscation started...");

    console.log("removing existing output folder...");
    fileSystem.folderManager.removeFolder(options.generationOptions.outputDir);
    console.log("copying new files...");
    fileSystem.folderManager.copyFolderSync(
      options.generationOptions.inputDir,
      options.generationOptions.outputDir,
      options.generationOptions.ignoredFilesInGeneration
    );

    const fileNames = fileSystem.folderManager.getAllFileNamesInDir(
      options.generationOptions.outputDir
    );
    console.log(`copied ${fileNames.length} file(s)`);
    const map: Record<string, string> = {};
    let fileCode;
    fileNames.forEach((fileName) => {
      fileCode = fileSystem.fileReader.readFile(fileName as string);
      fileSystem.fileWriter.writeFile(
        fileName as string,
        obfuscate(fileCode ?? "", map, options)
      );
    });
    console.log("Obfuscation completed.");
  }
}
