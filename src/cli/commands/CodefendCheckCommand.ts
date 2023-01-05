import { fileSystem } from "../../";
import { ICodefendOptions } from "../../core/options/ICodefendOptions";
import { OPTIONS_FILE_PATH } from "./../../utils/Constants";

export interface ICheckResults {
  warnings: string[];
  errors: string[];
}

export class CodefendCheckCommand {
  execute(): ICodefendOptions | null {
    const checkResults: ICheckResults = {
      errors: [],
      warnings: [],
    };

    const file = fileSystem.fileReader.readFile(OPTIONS_FILE_PATH);
    if (!file) {
      checkResults.errors.push(
        ".codefendrc.json not found. Please run codefend -i first to create it."
      );
      this.printCheckResults(checkResults);
      return null;
    }

    const options = fileSystem.fileReader.tryParse(
      file
    ) as ICodefendOptions | null;

    if (!options) {
      checkResults.errors.push(
        ".codefendrc.json does not contains a valid json format"
      );
      this.printCheckResults(checkResults);
      return null;
    }

    if (!options.generationOptions) {
      checkResults.errors.push(
        ".codefendrc.json is missing generationOptions. please run codefend -i to create a new one"
      );
      this.printCheckResults(checkResults);
      return null;
    }

    const success = !checkResults.errors.length;
    this.printCheckResults(checkResults);

    return success ? options : null;
  }

  printCheckResults(checkResults: ICheckResults) {
    console.log(
      `Check completed. ${checkResults.errors.length} error(s)  ${checkResults.warnings.length} warning(s) `
    );
    checkResults.errors.forEach((error) => {
      console.log(`Error: ${error}`);
    });
    checkResults.warnings.forEach((warning) => {
      console.log(`Warning: ${warning}`);
    });
  }
}
