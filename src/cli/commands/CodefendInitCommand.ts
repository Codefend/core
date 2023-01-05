import { fileSystem, codefendDefaultOptions } from "../../";
import { OPTIONS_FILE_PATH } from "./../../utils/Constants";
export class CodefendInitCommand {
  execute() {
    const options = { ...codefendDefaultOptions };

    if (options.obfuscationOptions.regexList?.length) {
      options.obfuscationOptions.regexList.forEach((regex) => {
        delete regex._regExp;
      });
    }

    fileSystem.fileWriter.writeFile(
      OPTIONS_FILE_PATH,
      JSON.stringify(options, null, 4)
    );

    console.log(".codefendrc.json created.");
  }
}